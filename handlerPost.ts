import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { Resend } from "npm:resend";
import { PREFIX } from "./constants.ts";
import { normalizeName, normalizeEmail } from "./utils.ts";
import { renderEmailSignupConfirm } from "./emails/signup-confirm.tsx";
import { renderEmailSignupSuccess } from "./emails/signup-success.tsx";
import { renderEmailAdminSignupSuccess } from "./emails/admin-signup-success.tsx";

const resend = new Resend(Deno.env.get("API_KEY_RESEND"));

const handlerPost = async (request: Request, kv: Deno.Kv) => {
  const body: {
    name: string;
    email: string;
    eventId: number;
    eventName: string;
    eventDate: string;
    eventLocation: string;
  } = await request.json();

  const normalizedBodyName = normalizeName(body.name);
  const normalizedBodyEmail = normalizeEmail(body.email);

  const ticketsIterator = kv.list<KvEntryTicket>({
    prefix: [PREFIX],
  });
  const tickets = await Array.fromAsync(ticketsIterator);
  const emailPreviouslyConfirmed = tickets.some(
    ({ value }) => value.email === normalizedBodyEmail && value.confirmed,
  );
  if (emailPreviouslyConfirmed) {
    await kv.set([PREFIX, body.eventId, ulid()], {
      timestamp: new Date().toISOString(),
      eventId: body.eventId,
      name: normalizedBodyName,
      email: normalizedBodyEmail,
      confirmed: true,
    });

    const [emailUser, emailAdmin] = [
      renderEmailSignupSuccess({
        eventUrl: `https://nn1.dev/events/${body.eventId}`,
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventLocation: body.eventLocation,
      }),
      renderEmailAdminSignupSuccess({
        name: normalizedBodyName,
        email: normalizedBodyEmail,
      }),
    ];
    const [emailUserResponse, emailAdminResponse] = await Promise.all([
      resend.emails.send({
        from: "NN1 Dev Club <club@nn1.dev>",
        to: normalizedBodyEmail,
        subject: body.eventName,
        html: emailUser.html,
        text: emailUser.text,
      }),
      resend.emails.send({
        from: "NN1 Dev Club <club@nn1.dev>",
        to: "club@nn1.dev",
        subject: "✨ New signup",
        html: emailAdmin.html,
        text: emailAdmin.text,
      }),
    ]);

    if (emailUserResponse.error || emailAdminResponse.error) {
      return Response.json(
        {
          status: "error",
          statusCode: 400,
          data: null,
          error: emailUserResponse.error || emailAdminResponse.error,
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        status: "success",
        statusCode: 200,
        value: body,
        error: null,
      },
      { status: 200 },
    );
  }

  const ticketId = ulid();
  const ticketToken = crypto.randomUUID();

  await kv.set([PREFIX, body.eventId, ticketId], {
    timestamp: new Date().toISOString(),
    eventId: body.eventId,
    name: normalizedBodyName,
    email: normalizedBodyEmail,
    token: ticketToken,
    confirmed: false,
  });

  const email = renderEmailSignupConfirm({
    eventName: body.eventName,
    url: `https://nn1.dev/events/${body.eventId}/${ticketId}/${ticketToken}`,
  });

  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: normalizedBodyEmail,
    subject: "Confirm your email please",
    html: email.html,
    text: email.text,
  });

  if (error) {
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        data: null,
        error,
      },
      { status: 400 },
    );
  }

  return Response.json(
    {
      status: "success",
      statusCode: 201,
      data: body,
      error: null,
    },
    { status: 201 },
  );
};

export default handlerPost;

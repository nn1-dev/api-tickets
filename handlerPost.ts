import { Resend } from "npm:resend";
import { PREFIX_TICKET, PREFIX_TOKEN } from "./constants.ts";
import { normalizeName, normalizeEmail } from "./utils.ts";
import { renderEmailSignupConfirm } from "./emails/signup-confirm.tsx";
import { renderEmailSignupSuccess } from "./emails/signup-success.tsx";
import { renderEmailAdminSignupSuccess } from "./emails/admin-signup-success.tsx";

const resend = new Resend(Deno.env.get("API_KEY_RESEND"));

const handlerPost = async (request: Request, kv: Deno.Kv) => {
  const body: {
    eventId: number;
    eventUrl: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    name: string;
    email: string;
  } = await request.json();

  const normalizedBodyName = normalizeName(body.name);
  const normalizedBodyEmail = normalizeEmail(body.email);

  const entriesTickets = kv.list<KvEntryTicket>({
    prefix: [PREFIX_TICKET],
  });
  const entriesTicketsArray = await Array.fromAsync(entriesTickets);
  const emailPreviouslyConfirmed = entriesTicketsArray.some(
    ({ value }) => value.email === normalizedBodyEmail && value.confirmed,
  );
  if (emailPreviouslyConfirmed) {
    await kv.set([PREFIX_TICKET, body.eventId, normalizedBodyEmail], {
      timestamp: new Date().toISOString(),
      eventId: body.eventId,
      name: normalizedBodyName,
      email: normalizedBodyEmail,
      confirmed: true,
    });

    const [emailUser, emailAdmin] = [
      renderEmailSignupSuccess({
        eventUrl: body.eventUrl,
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
        subject: "New signup",
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

  const token = crypto.randomUUID();

  await Promise.all([
    kv.set([PREFIX_TICKET, body.eventId, normalizeEmail(body.email)], {
      timestamp: new Date().toISOString(),
      eventId: body.eventId,
      name: normalizedBodyName,
      email: normalizeEmail(body.email),
      token,
      confirmed: false,
    }),
    kv.set([PREFIX_TOKEN, token], {
      eventId: body.eventId,
      email: normalizeEmail(body.email),
    }),
  ]);

  const email = renderEmailSignupConfirm({
    eventName: body.eventName,
    url: `https://nn1.dev/events/${body.eventId}/${token}`,
  });

  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: normalizeEmail(body.email),
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

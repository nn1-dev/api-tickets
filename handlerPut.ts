import { Resend } from "npm:resend";
import { PREFIX_TICKET, PREFIX_TOKEN } from "./constants.ts";
import { renderEmailSignupSuccess } from "./emails/signup-success.tsx";
import { renderEmailAdminSignupSuccess } from "./emails/admin-signup-success.tsx";

const resend = new Resend(Deno.env.get("API_KEY_RESEND"));

const handlerPut = async (request: Request, kv: Deno.Kv) => {
  const body: {
    token: ReturnType<typeof crypto.randomUUID>;
    eventUrl: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
  } = await request.json();

  const token = await kv.get<KvEntryToken>([PREFIX_TOKEN, body.token]);

  if (!token.value) {
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        value: null,
        error: "Invalid token.",
      },
      { status: 400 },
    );
  }

  const ticket = await kv.get<KvEntryTicket>([
    PREFIX_TICKET,
    token.value.eventId,
    token.value.email,
  ]);

  if (!ticket.value) {
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        value: null,
        error: "Invalid ticket.",
      },
      { status: 400 },
    );
  }

  const ticketNew = {
    timestamp: ticket.value.timestamp,
    id: ticket.value.id,
    name: ticket.value.name,
    email: ticket.value.email,
    confirmed: true,
  };

  await Promise.all([
    await kv.set(
      [PREFIX_TICKET, token.value.eventId, token.value.email],
      ticketNew,
    ),
    await kv.delete([PREFIX_TOKEN, body.token]),
  ]);

  const [emailUser, emailAdmin] = [
    renderEmailSignupSuccess({
      eventUrl: body.eventUrl,
      eventName: body.eventName,
      eventDate: body.eventDate,
      eventLocation: body.eventLocation,
    }),
    renderEmailAdminSignupSuccess({
      name: ticket.value.name,
      email: ticket.value.email,
    }),
  ];

  const [emailUserResponse, emailAdminResponse] = await Promise.all([
    resend.emails.send({
      from: "NN1 Dev Club <club@nn1.dev>",
      to: ticket.value.email,
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
      value: ticketNew,
      error: null,
    },
    { status: 200 },
  );
};

export default handlerPut;

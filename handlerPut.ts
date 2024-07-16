import { Resend } from "npm:resend";
import { PREFIX } from "./constants.ts";
import { renderEmailSignupSuccess } from "./emails/signup-success.tsx";
import { renderEmailAdminSignupSuccess } from "./emails/admin-signup-success.tsx";

const resend = new Resend(Deno.env.get("API_KEY_RESEND"));

const handlerPut = async (request: Request, kv: Deno.Kv) => {
  const body: {
    ticketId: string;
    ticketToken: ReturnType<typeof crypto.randomUUID>;
    eventId: number;
    eventName: string;
    eventDate: string;
    eventLocation: string;
  } = await request.json();

  const ticket = await kv.get<KvEntryTicket>([
    PREFIX,
    body.eventId,
    body.ticketId,
  ]);

  if (!ticket.value || ticket.value.token !== body.ticketToken) {
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        value: null,
        error: "Invalid request.",
      },
      { status: 400 },
    );
  }

  const { token, ...rest } = ticket.value;
  const newValue = {
    ...rest,
    confirmed: true,
  };
  await kv.set([PREFIX, body.eventId, body.ticketId], newValue);

  const [emailUser, emailAdmin] = [
    renderEmailSignupSuccess({
      eventUrl: `https://nn1.dev/events/${body.eventId}`,
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
      data: newValue,
      error: null,
    },
    { status: 200 },
  );
};

export default handlerPut;

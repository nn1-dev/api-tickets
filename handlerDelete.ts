import { Resend } from "npm:resend";
import { PREFIX } from "./constants.ts";
import { renderEmailAdminSignupCancel } from "https://raw.githubusercontent.com/nn1-dev/emails/main/emails/admin-signup-cancel.tsx";

const resend = new Resend(Deno.env.get("API_KEY_RESEND"));

const handlerDelete = async (request: Request, kv: Deno.Kv) => {
  console.log(`✨ DELETE: ${request.url}`);
  const pattern = new URLPattern({
    pathname: "/:eventId?/:ticketId?",
  });
  const patternResult = pattern.exec(request.url);
  const eventId = patternResult?.pathname.groups.eventId;
  const ticketId = patternResult?.pathname.groups.ticketId;

  if (!eventId || !ticketId) {
    console.log(`✨ 400`);
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        data: null,
        error: "Invalid request.",
      },
      { status: 400 },
    );
  }

  const ticket = await kv.get<KvEntryTicket>([
    PREFIX,
    Number(eventId),
    ticketId,
  ]);

  if (!ticket.value) {
    console.log(`✨ 400`);
    return Response.json(
      {
        status: "error",
        statusCode: 400,
        data: null,
        error: "Ticket does not exists.",
      },
      { status: 400 },
    );
  }

  const email = renderEmailAdminSignupCancel({
    name: ticket.value.name,
    email: ticket.value.email,
  });

  resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: Deno.env.get("ADMIN_RECIPIENTS")?.split(",")!,
    subject: "Ticket cancelled 👎",
    html: email.html,
    text: email.text,
  });

  await kv.delete([PREFIX, Number(eventId), ticketId]);

  console.log(`✨ 200`);
  return Response.json(
    {
      status: "success",
      statusCode: 200,
      data: {
        eventId,
        ticketId,
      },
      error: null,
    },
    { status: 200 },
  );
};

export default handlerDelete;

import { PREFIX_TICKET, PREFIX_TOKEN } from "./constants.ts";

const handlerDelete = async (request: Request, kv: Deno.Kv) => {
  const body: { eventId: number; email: string } = await request.json();
  const ticket = await kv.get<KvEntryTicket>([
    PREFIX_TICKET,
    body.eventId,
    body.email,
  ]);

  if (ticket.value?.token) {
    await Promise.all([
      kv.delete([PREFIX_TICKET, body.eventId, body.email]),
      kv.delete([PREFIX_TOKEN, ticket.value.token]),
    ]);
  } else {
    await kv.delete([PREFIX_TICKET, body.eventId, body.email]);
  }

  return Response.json(
    {
      status: "success",
      statusCode: 200,
      data: body,
      error: null,
    },
    { status: 200 },
  );
};

export default handlerDelete;

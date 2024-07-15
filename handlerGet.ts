import { PREFIX } from "./constants.ts";

const handlerGet = async (_request: Request, kv: Deno.Kv) => {
  const ticketsIterator = kv.list<KvEntryTicket>({ prefix: [PREFIX] });
  const tickets = await Array.fromAsync(ticketsIterator);

  return Response.json(
    {
      status: "success",
      statusCode: 200,
      data: tickets,
      error: null,
    },
    { status: 200 },
  );
};

export default handlerGet;

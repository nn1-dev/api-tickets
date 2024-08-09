import { PREFIX } from "./constants.ts";

const handlerGet = async (request: Request, kv: Deno.Kv) => {
  console.log(`✨ GET: ${request.url}`);
  const pattern = new URLPattern({
    pathname: "/:eventId?/:ticketId?",
  });
  const patternResult = pattern.exec(request.url);
  const eventId = patternResult?.pathname.groups.eventId;
  const ticketId = patternResult?.pathname.groups.ticketId;
  const key = [PREFIX, Number(eventId), ticketId].filter(Boolean) as (
    | string
    | number
  )[];

  // const ticketsIterator = kv.list<KvEntryTicket>({ prefix });
  const tickets = ticketId
    ? await kv.get<KvEntryTicket>(key)
    : await Array.fromAsync(kv.list<KvEntryTicket>({ prefix: key }));

  console.log(`✨ 200`);
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

import { PREFIX_TICKET, PREFIX_TOKEN } from "./constants.ts";

const handlerGet = async (_request: Request, kv: Deno.Kv) => {
  const [entriesTickets, entriesTokens] = [
    kv.list<KvEntryTicket>({ prefix: [PREFIX_TICKET] }),
    kv.list<KvEntryToken>({ prefix: [PREFIX_TOKEN] }),
  ];
  const [responseTickets, responseTokens] = await Promise.all([
    Array.fromAsync(entriesTickets),
    Array.fromAsync(entriesTokens),
  ]);

  return Response.json(
    {
      status: "success",
      statusCode: 200,
      data: {
        tickets: responseTickets,
        tokens: responseTokens,
      },
      error: null,
    },
    { status: 200 },
  );
};

export default handlerGet;

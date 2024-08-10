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

  if (ticketId) {
    const ticket = await kv.get<KvEntryTicket>(key);

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

    console.log(`✨ 200`);
    return Response.json(
      {
        status: "success",
        statusCode: 200,
        data: ticket,
        error: null,
      },
      { status: 200 },
    );
  }

  const tickets = await Array.fromAsync(
    kv.list<KvEntryTicket>({ prefix: key }),
  );

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

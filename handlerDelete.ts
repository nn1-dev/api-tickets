import { PREFIX } from "./constants.ts";

const handlerDelete = async (request: Request, kv: Deno.Kv) => {
  const pattern = new URLPattern({
    pathname: "/:eventId?/:ticketId?",
  });
  const patternResult = pattern.exec(request.url);
  const eventId = patternResult?.pathname.groups.eventId;
  const ticketId = patternResult?.pathname.groups.ticketId;

  if (!eventId || !ticketId) {
    return Response.json(
      {
        status: "success",
        statusCode: 400,
        data: null,
        error: "Invalid request.",
      },
      { status: 400 },
    );
  }

  await kv.delete([PREFIX, Number(eventId), ticketId]);

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

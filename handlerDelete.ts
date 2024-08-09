import { PREFIX } from "./constants.ts";

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
        status: "success",
        statusCode: 400,
        data: null,
        error: "Invalid request.",
      },
      { status: 400 },
    );
  }

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

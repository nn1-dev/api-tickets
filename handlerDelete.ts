import { PREFIX } from "./constants.ts";

const handlerDelete = async (request: Request, kv: Deno.Kv) => {
  const body: { eventId: number; ticketId: string } = await request.json();

  await kv.delete([PREFIX, body.eventId, body.ticketId]);

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

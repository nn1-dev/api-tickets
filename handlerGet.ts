import { PREFIX } from "./constants.ts";

const handlerGet = async (_request: Request, kv: Deno.Kv) => {
  const entries = kv.list<string>({
    prefix: [PREFIX],
  });
  const response = await Array.fromAsync(entries);

  return Response.json(
    {
      status: "success",
      statusCode: 200,
      data: response,
      error: null,
    },
    { status: 200 },
  );
};

export default handlerGet;

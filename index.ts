import * as Sentry from "https://deno.land/x/sentry@8.25.0/index.mjs";
import handlerDelete from "./handlerDelete.ts";
import handlerPost from "./handlerPost.ts";
import handlerPut from "./handlerPut.ts";
import handlerGet from "./handlerGet.ts";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN"),
  tracesSampleRate: 1.0,
});

const kv = await Deno.openKv();

const HANDLER_MAPPER = {
  GET: handlerGet,
  POST: handlerPost,
  PUT: handlerPut,
  DELETE: handlerDelete,
};

Deno.serve(async (request) => {
  const auth = request.headers.get("Authorization");

  if (auth !== `Bearer ${Deno.env.get("API_KEY")}`) {
    return Response.json(
      {
        status: "error",
        statusCode: 401,
        data: null,
        error: "Nice try 👍",
      },
      { status: 401 },
    );
  }

  return await HANDLER_MAPPER[request.method as keyof typeof HANDLER_MAPPER](
    request,
    kv,
  );
});

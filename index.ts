import * as Sentry from "https://deno.land/x/sentry@8.27.0/index.mjs";
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
    Sentry.captureException("Unauthorized API use");
    console.log(`🚨 401`);
    console.log({ method: request.method });
    console.log({ referrer: request.referrer });
    console.log({ mode: request.mode });
    console.log({ redirect: request.redirect });
    console.log({ body: request.body });
    console.log({ bodyJSON: await request.json() });
    console.log({ headers: request.headers });
    console.log({ destination: request.destination });
    console.log({ credentials: request.credentials });
    console.log({ url: request.url });
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

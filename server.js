import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
    return {
      // Map the ACCOUNTS kv binding that cloudflare gives us to accounts on the context
      // for loaders to use
      accounts: context.env.ACCOUNTS,
    };
  },
});

export function onRequest(context) {
  return handleRequest(context);
}

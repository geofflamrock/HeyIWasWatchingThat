import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { formatRelative, parseISO } from "date-fns";
import type { Account, AccountClaim, Context } from "~/api";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { isArray } from "lodash";
// import type { KVNamespace } from "@cloudflare/workers-types";

// declare const ACCOUNTS: KVNamespace;

export const loader: LoaderFunction = async ({
  params,
  context,
}: {
  params: Params;
  context: Context;
}) => {
  const { accounts } = context;
  const account: Account | null = await accounts.get(`${params.accountId}`, {
    type: "json",
  });

  if (account === null)
    throw new Response("Not Found", {
      status: 404,
    });

  let existingClaims: AccountClaim | Array<AccountClaim> | null =
    await accounts.get(`claims:${params.accountId}`, { type: "json" });

  let claims: Array<AccountClaim> = [];

  if (existingClaims === null) {
    claims = [];
  } else if (isArray(existingClaims)) {
    claims = [...existingClaims];
  } else {
    claims = [existingClaims];
  }

  console.log(claims);
  console.log(account);

  return json<Account>({
    ...account,
    claims,
  });
};

export default function AccountRoute() {
  const account: Account = useLoaderData<Account>();
  // const account: Account = {
  //   id: "hGbyDfoa",
  //   name: "NBA",
  //   maxClaims: 2,
  //   defaultTimeoutInMinutes: 180,
  //   claims: [
  //     {
  //       name: "Geoff",
  //       endTime: new Date(2022, 4, 22, 14, 30, 0),
  //     },
  //   ],
  // };

  const accountIsAvailable = account.claims.length < account.maxClaims;

  console.log(account);

  return (
    <div className="flex flex-col gap-8 items-center">
      {account.claims.length > 0 &&
        account.claims.map((claim) => {
          return (
            <div
              key={claim.name}
              className="rounded-lg p-4 border-2 border-lime-600 text-4xl"
            >
              {claim.name} is watching {account.name} until{" "}
              {formatRelative(parseISO(claim.endTime), new Date())}
            </div>
          );
        })}

      {accountIsAvailable ? (
        <div className="flex flex-col gap-8 items-center">
          <div className="text-4xl">
            {account.claims.length === 0
              ? "No-one is"
              : account.claims.length === 1
              ? `${account.claims.length} person is`
              : `${account.claims.length} people are`}{" "}
            watching {account.name} right now,{" "}
            {account.maxClaims - account.claims.length} more can watch
          </div>
          <Form
            action="claim"
            method="post"
            className="flex flex-row gap-2 items-center"
          >
            <input
              name="name"
              className="rounded-lg border-2 border-lime-600 bg-zinc-700 h-12 p-4"
              placeholder="Name"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-lime-600 text-zinc-900 py-3 px-6"
            >
              I'm watching!
            </button>
          </Form>
        </div>
      ) : (
        <div className="text-4xl">
          All accounts are taken for {account.name}, sorry you'll need to wait
        </div>
      )}
      {/* <div className="text-4xl">Share this link</div>
      <div className="text-4xl">http://localhost:8788{location.pathname}</div> */}
    </div>
  );
}

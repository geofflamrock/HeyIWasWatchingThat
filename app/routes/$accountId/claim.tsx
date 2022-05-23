import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { addMinutes } from "date-fns";
import invariant from "tiny-invariant";
import type { Account, AccountClaim, Context } from "~/api";
import type { Params } from "react-router-dom";
import { isArray } from "lodash";
import { customAlphabet } from "nanoid/non-secure";

export const action: ActionFunction = async ({
  request,
  context,
  params,
}: {
  request: Request;
  context: Context;
  params: Params;
}) => {
  invariant(params.accountId, "Account id must be provided");
  const accountId = params.accountId;

  const body = await request.formData();
  const name = body.get("name");
  invariant(name, "Name must be provided");

  const { accounts } = context;

  const account: Account | null = await accounts.get(`${accountId}`, {
    type: "json",
  });
  if (account === null)
    throw new Response("Not Found", {
      status: 404,
    });

  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    8
  );
  const id = nanoid();

  const claim: AccountClaim = {
    id: id,
    name: name.toString(),
    endTime: addMinutes(
      new Date(),
      account.defaultTimeoutInMinutes
    ).toISOString(),
  };

  let existingClaims: AccountClaim | Array<AccountClaim> | null =
    await accounts.get(`claims:${account.id}`, { type: "json" });

  if (existingClaims === null) existingClaims = [];
  else if (!isArray(existingClaims)) existingClaims = [existingClaims];

  console.log(existingClaims);

  existingClaims.push(claim);

  console.log(existingClaims);

  await accounts.put(`claims:${account.id}`, JSON.stringify(existingClaims), {
    expirationTtl: account.defaultTimeoutInMinutes * 60,
  });

  return redirect(`/${account.id}`);
};

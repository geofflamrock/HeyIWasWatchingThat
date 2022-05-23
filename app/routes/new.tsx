import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { Account, AccountClaim, Context } from "~/api";
import { customAlphabet } from "nanoid/non-secure";
import { useActionData } from "@remix-run/react";
import { Layout } from "~/components/Layout/Layout";

export const action: ActionFunction = async ({
  request,
  context,
}: {
  request: Request;
  context: Context;
}) => {
  const body = await request.formData();

  const { accounts } = context;

  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    8
  );
  const id = nanoid();

  const account: Account = {
    id: id,
    name: body.get("name")?.toString() || "",
    claims: [],
    defaultTimeoutInMinutes: parseInt(
      body.get("defaultTimeoutInMinutes")?.toString() || "180"
    ),
    maxClaims: parseInt(body.get("maxClaims")?.toString() || "1"),
  };

  await accounts.put(account.id, JSON.stringify(account));
  const url = new URL(request.url);

  return json<Account>({
    url: `${url.origin}/${account.id}`,
    ...account,
  });
};

export default function NewAccountRoute() {
  const account = useActionData<Account>();

  if (account === undefined) return null;

  return (
    <Layout>
      <div className="flex flex-col items-center text-4xl text-center gap-8">
        <h1>New account {account.name} created! </h1>
        <h1>
          Send this link to everyone using this account so you can know who is
          watching! Only people you send the link to can access it.
        </h1>
        <h1>{account.url}</h1>
      </div>
    </Layout>
  );
}

import { Form, Link } from "@remix-run/react";
import { Layout } from "~/components/Layout/Layout";
import type { Account } from "~/api";

export default function Index() {
  const accounts: Array<Account> = [
    {
      id: "hGbyDfoa",
      name: "NBA",
      maxClaims: 1,
      defaultTimeoutInMinutes: 180,
      claims: [],
    },
    {
      id: "hGbyDfob",
      name: "Netflix",
      maxClaims: 4,
      defaultTimeoutInMinutes: 180,
      claims: [],
    },
  ];

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-2">
        {accounts.map((account) => {
          return (
            <Link
              to={`${account.id}`}
              key={account.id}
              className="text-white p-4 border-2 border-lime-100 rounded-lg hover:bg-zinc-700"
            >
              {account.name}: Maximum of {account.maxClaims} devices
            </Link>
          );
        })}
      </div>
      <div>
        <Form action="/new" method="post">
          <input
            name="name"
            placeholder="name"
            required
            className="rounded-lg border-2 border-lime-600 bg-zinc-700 h-12 p-4"
          />
          <input
            name="maxClaims"
            placeholder="Maximum number of devices at one time"
            required
            className="rounded-lg border-2 border-lime-600 bg-zinc-700 h-12 p-4"
          />
          <input
            name="defaultTimeoutInMinutes"
            placeholder="Default watch time (mins)"
            className="rounded-lg border-2 border-lime-600 bg-zinc-700 h-12 p-4"
          ></input>
          <button
            type="submit"
            className="rounded-lg bg-lime-600 text-zinc-900 p-3"
          >
            Create
          </button>
        </Form>
      </div>
    </Layout>
  );
}

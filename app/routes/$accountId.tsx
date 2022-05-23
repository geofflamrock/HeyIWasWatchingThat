import { Outlet } from "@remix-run/react";
import { Layout } from "~/components/Layout/Layout";

export default function GroupsRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

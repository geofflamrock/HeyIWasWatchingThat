import React from "react";
import { Header } from "./Header";
import { Container } from "./Container";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <Container>
      <div className="flex flex-col gap-12 px-4 py-12">
        <Header />
        {children}
      </div>
    </Container>
  );
}

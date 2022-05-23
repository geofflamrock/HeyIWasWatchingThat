import { Link } from "@remix-run/react";

export function Header() {
  return (
    <Link to="/">
      <h1 className="text-lime-600 text-6xl text-center">
        Hey, I Was Watching That!
      </h1>
    </Link>
  );
}

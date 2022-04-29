import { json, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  return null;
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}

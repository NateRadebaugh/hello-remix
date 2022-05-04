import { Link } from "@remix-run/react";
import { siteTitle } from "config";
import { requireUserSession } from "~/session";
import type { LoaderFunction, MetaFunction } from "~/utils/types";

type LoaderData = null;

export const meta: MetaFunction<LoaderData> = () => ({
  title: "Home - " + siteTitle,
});

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
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

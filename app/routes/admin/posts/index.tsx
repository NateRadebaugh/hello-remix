import { Link } from "@remix-run/react";
import { siteTitle } from "config";
import { requireUserSession } from "~/session";
import type { LoaderFunction, MetaFunction } from "~/utils/types";

type LoaderData = null;

export const meta: MetaFunction<LoaderData> = () => ({
  title: "Posts - Admin - " + siteTitle,
});

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const session = await requireUserSession(request);
  return null;
};

export default function PostsIndex() {
  return (
    <p>
      <Link to="new">Create a New Post</Link>
    </p>
  );
}

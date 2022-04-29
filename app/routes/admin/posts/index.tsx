import { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
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

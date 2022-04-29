import { LoaderFunction, json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { getPosts } from "~/post";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  return json(await getPosts());
};

export default function Index() {
  return (
    <>
      <ul>
        <li>
          Admin:
          <ul>
            <li>
              <Link to="/admin/app/code-detail">App Code Detail</Link>
            </li>
            <li>
              <Link to="/admin/app/security-user">Security Users</Link>
            </li>
            <li>
              <Link to="/admin/posts">Posts</Link>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}

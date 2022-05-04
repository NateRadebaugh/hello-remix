import { Link } from "@remix-run/react";
import { siteTitle } from "config";
import { getPosts } from "~/post";
import { requireUserSession } from "~/session";
import type { LoaderFunction, MetaFunction } from "~/utils/types";
import { json } from "~/utils/types";

type LoaderData = Awaited<ReturnType<typeof getPosts>>;

export const meta: MetaFunction<LoaderData> = () => ({
  title: "Admin - " + siteTitle,
});

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
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

import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/post";
import type { Post } from "~/post";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  return json(await getPosts());
};

export default function Admin() {
  const posts = useLoaderData<Post[]>();
  return (
    <div className="row">
      <nav className="col-auto" style={{ width: "180px" }}>
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/admin/posts/${post.slug}/edit`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="col">
        <Outlet />
      </div>
    </div>
  );
}

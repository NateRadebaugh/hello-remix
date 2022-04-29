import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/post";
import type { Post } from "~/post";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  return json(await getPosts());
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>
              {post.title} <small className="link-dark">({post.type})</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

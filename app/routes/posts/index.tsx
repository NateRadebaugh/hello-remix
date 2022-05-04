import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/post";
import type { Post } from "~/post";
import { requireUserSession } from "~/session";
import type { LoaderFunction, MetaFunction } from "~/utils/types";
import { json } from "~/utils/types";
import { siteTitle } from "config";

type LoaderData = Awaited<ReturnType<typeof getPosts>>;

export const meta: MetaFunction<LoaderData> = () => ({
  title: "Posts - " + siteTitle,
});

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const session = await requireUserSession(request);
  return json(await getPosts());
};

export default function Posts() {
  const posts = useLoaderData<LoaderData>();

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

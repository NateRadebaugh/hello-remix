import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/post";
import type { Post } from "~/post";
import { stringInvariant } from "~/utils/invariants";

export const loader: LoaderFunction = async ({ params }) => {
  stringInvariant(params.slug);
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  return (
    <div>
      <Link to={"/admin/posts/" + post.slug + "/edit"} className="float-end">
        Edit Post
      </Link>
      <h1>
        {post.title}
        {Boolean(post.type) && (
          <small className="text-muted">({post.type})</small>
        )}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}

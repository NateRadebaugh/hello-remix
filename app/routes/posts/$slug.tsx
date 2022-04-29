import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/post";
import type { Post } from "~/post";
import { stringInvariant } from "~/utils/invariants";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  stringInvariant(params.slug);
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
        <h1>
          {post.title}
          {Boolean(post.type) && (
            <small className="text-muted">({post.type})</small>
          )}
        </h1>

        <Link to={"/admin/posts/" + post.slug + "/edit"}>Edit Post</Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}

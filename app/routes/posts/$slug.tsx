import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/post";
import type { Post } from "~/post";
import { stringInvariant } from "~/utils/invariants";
import { requireUserSession } from "~/session";
import { siteTitle } from "config";
import type { LoaderFunction, MetaFunction } from "~/utils/types";
import { json } from "~/utils/types";

type LoaderData = Awaited<ReturnType<typeof getPost>>;

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: data.title + " - Post - " + siteTitle,
});

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
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

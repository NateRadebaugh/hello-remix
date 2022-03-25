import { json, Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";

import { getPost } from "~/post";
import type { Post } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  return (
    <main>
      <Link to={"/admin/posts/" + post.slug + "/edit"} className="float-end">
        Edit Post
      </Link>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </main>
  );
}

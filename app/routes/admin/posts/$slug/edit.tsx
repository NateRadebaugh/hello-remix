import {
  useTransition,
  useActionData,
  Form,
  redirect,
  json,
  LoaderFunction,
  useLoaderData,
  Link,
} from "remix";
import type { ActionFunction } from "remix";
import invariant from "tiny-invariant";

import { isValidPostType, updatePost } from "~/post";
import { getPostSource } from "~/post";
import type { PostSource } from "~/post";
import PostTypePicker from "~/components/post-type-picker";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPostSource(params.slug));
};

type PostError = {
  title?: string;
  slug?: string;
  type?: string;
  markdown?: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const type = formData.get("type");
  const markdown = formData.get("markdown");
  const slug = params.slug;

  const errors: PostError = {};
  if (!title) errors.title = "Title is required";
  if (!type) errors.type = "Type is required";
  if (!markdown) errors.markdown = "Markdown is required";

  if (Object.keys(errors).length) {
    return json(errors);
  }

  invariant(typeof title === "string");
  invariant(isValidPostType(type));
  invariant(typeof markdown === "string");
  invariant(typeof slug === "string");

  await updatePost({
    slug: slug,
    title: title,
    type: type,
    markdown: markdown,
  });

  return redirect("/posts/" + slug);
};

export default function EditPost() {
  const errors = useActionData();
  const transition = useTransition();
  const post = useLoaderData<PostSource>();

  return (
    <Form key={post.slug} method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? <em className="error">Slug is required</em> : null}
            <em>{post.slug}</em>
          </label>
        </p>
        <p>
          <label className="w-100">
            Post Title:{" "}
            {errors?.title ? (
              <em className="error">Title is required</em>
            ) : null}{" "}
            <input
              type="text"
              className="form-control"
              name="title"
              defaultValue={post.title}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Post Type:{" "}
            {errors?.title ? <em className="error">Type is required</em> : null}{" "}
            <PostTypePicker name="type" defaultValue={post.type} />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Markdown:</label>{" "}
          {errors?.markdown ? (
            <em className="error">Markdown is required</em>
          ) : null}
          <br />
          <textarea
            id="markdown"
            className="form-control"
            rows={20}
            name="markdown"
            defaultValue={post.markdown}
          />
        </p>
        <p>
          <button type="submit" className="btn btn-primary me-2">
            {transition.submission ? "Updating..." : "Update Post"}
          </button>

          <Link to={"/posts/" + post.slug}>Cancel</Link>
        </p>
      </fieldset>
    </Form>
  );
}

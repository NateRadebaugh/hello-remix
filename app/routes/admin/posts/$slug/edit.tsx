import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { updatePost } from "~/post";
import { getPostSource } from "~/post";
import type { PostSource } from "~/post";
import UserTypePicker from "~/components/user-type-picker";
import { stringInvariant } from "~/utils/invariants";
import { getUserTypes } from "~/models/appCodeDetail.server";

interface LoaderData {
  post: PostSource;
  initialUserTypeOptions: Awaited<ReturnType<typeof getUserTypes>>;
}

export const loader: LoaderFunction = async ({ params }) => {
  stringInvariant(params.slug);

  const loaderData: LoaderData = {
    post: await getPostSource(params.slug),
    initialUserTypeOptions: await getUserTypes(),
  };
  return json(loaderData);
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

  stringInvariant(title);
  stringInvariant(type);
  stringInvariant(markdown);
  stringInvariant(slug);

  await updatePost({
    slug: slug,
    title: title,
    type: type,
    markdown: markdown,
  });

  return redirect("/posts/" + slug);
};

export default function EditPost() {
  const errors = useActionData<PostError>();
  const transition = useTransition();
  const { post, initialUserTypeOptions } = useLoaderData<LoaderData>();

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
            User Type:{" "}
            {errors?.type ? <em className="error">Type is required</em> : null}{" "}
            <UserTypePicker
              name="type"
              defaultValue={post.type}
              initialData={initialUserTypeOptions}
            />
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
            rows={10}
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

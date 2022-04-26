import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost } from "~/post";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return json(errors);
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <p>
          <label className="w-100">
            Post Title:{" "}
            {errors?.title ? (
              <em className="error">Title is required</em>
            ) : null}{" "}
            <input type="text" className="form-control" name="title" />
          </label>
        </p>
        <p>
          <label className="w-100">
            Post Slug:{" "}
            {errors?.slug ? <em className="error">Slug is required</em> : null}
            <input type="text" className="form-control" name="slug" />
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
          />
        </p>
        <p>
          <button type="submit" className="btn btn-primary me-3">
            {transition.submission ? "Creating..." : "Create Post"}
          </button>

          <Link to="/admin">Cancel</Link>
        </p>
      </fieldset>
    </Form>
  );
}

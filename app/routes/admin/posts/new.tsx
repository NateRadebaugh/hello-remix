import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { createPost } from "~/post";
import UserTypePicker from "~/components/user-type-picker";
import { stringInvariant } from "~/utils/invariants";
import { getUserTypes } from "~/models/appCodeDetail.server";
import { requireUserSession } from "~/session";
import { ActionFunction } from "~/utils/types";

interface LoaderData {
  initialUserTypeOptions: Awaited<ReturnType<typeof getUserTypes>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  const loaderData: LoaderData = {
    initialUserTypeOptions: await getUserTypes(session),
  };
  return json(loaderData);
};

type PostData = {
  title?: string;
  slug?: string;
  type?: string;
  markdown?: string;
}

type PostError = {
  title?: boolean;
  slug?: boolean;
  type?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction<PostData> = async ({ request }) => {
  const formData = await request.formData();

  const slug = formData.get("slug");
  const title = formData.get("title");
  const type = formData.get("type");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return json(errors);
  }

  stringInvariant(slug);
  stringInvariant(type);
  stringInvariant(title);
  stringInvariant(markdown);
  await createPost({ slug, title, type, markdown });

  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData<PostError>();
  const transition = useTransition();
  const { initialUserTypeOptions } = useLoaderData<LoaderData>();

  return (
    <Form method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <p>
          <label className="w-100">
            Post Slug:{" "}
            {errors?.slug ? <em className="error">Slug is required</em> : null}
            <input type="text" className="form-control" name="slug" />
          </label>
        </p>
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
            User Type:{" "}
            {errors?.title ? <em className="error">Type is required</em> : null}{" "}
            <UserTypePicker name="type" initialData={initialUserTypeOptions} />
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

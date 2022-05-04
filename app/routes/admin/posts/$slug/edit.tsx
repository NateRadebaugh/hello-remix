import { json, redirect } from "~/utils/types";
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
import { requireUserSession } from "~/session";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "~/utils/types";
import StandardTextInput from "~/components/standard-text-input";
import StandardFieldWrapper from "~/components/standard-field-wrapper";
import { siteTitle } from "config";

export const meta: MetaFunction<LoaderData> = () => ({
  title: "Edit Post - Admin - " + siteTitle,
});

interface LoaderData {
  post: PostSource;
  initialUserTypeOptions: Awaited<ReturnType<typeof getUserTypes>>;
}

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const session = await requireUserSession(request);
  stringInvariant(params.slug);

  const loaderData = {
    asdf: true,
    post: await getPostSource(params.slug),
    initialUserTypeOptions: await getUserTypes(session),
  };
  return json(loaderData);
};

type IFormData = {
  title?: string;
  slug?: string;
  type?: string;
  markdown?: string;
};

type PostError = {
  title?: string;
  slug?: string;
  type?: string;
  markdown?: string;
};

export const action: ActionFunction<IFormData> = async ({
  request,
  params,
}) => {
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
      <h1>Edit Post</h1>
      <fieldset disabled={Boolean(transition.submission)}>
        <StandardFieldWrapper<IFormData>
          label="Post Slug:"
          error={errors?.slug}
        >
          <em>{post.slug}</em>
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Post Title:"
          error={errors?.title}
        >
          <StandardTextInput<IFormData>
            name="title"
            defaultValue={post.title}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="User Type:"
          error={errors?.type}
        >
          <UserTypePicker<IFormData>
            name="type"
            defaultValue={post.type}
            initialData={initialUserTypeOptions}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Markdown:"
          error={errors?.markdown}
        >
          <StandardTextInput<IFormData>
            rows={10}
            name="markdown"
            defaultValue={post.markdown}
          />
        </StandardFieldWrapper>

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

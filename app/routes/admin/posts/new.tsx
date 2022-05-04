import type { LoaderFunction } from "~/utils/types";
import { json, redirect } from "~/utils/types";
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
import type { ActionFunction } from "~/utils/types";
import StandardTextInput from "~/components/standard-text-input";
import StandardFieldWrapper from "~/components/standard-field-wrapper";

// TODO: remove fake timeout
function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

interface LoaderData {
  initialUserTypeOptions: Awaited<ReturnType<typeof getUserTypes>>;
}

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const session = await requireUserSession(request);
  return json({
    initialUserTypeOptions: await getUserTypes(session),
  });
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

export const action: ActionFunction<IFormData> = async ({ request }) => {
  const formData = await request.formData();

  const slug = formData.get("slug");
  const title = formData.get("title");
  const type = formData.get("type");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = "Title is required";
  if (!slug) errors.slug = "Slug is required";
  if (!type) errors.type = "User Type is required";
  if (!markdown) errors.markdown = "Markdown is required";

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
        <StandardFieldWrapper<IFormData>
          label="Post Slug:"
          error={errors?.slug}
        >
          <StandardTextInput<IFormData> name="slug" />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Post Title:"
          error={errors?.title}
        >
          <StandardTextInput<IFormData> name="title" />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="User Type:"
          error={errors?.type}
        >
          <UserTypePicker<IFormData>
            name="type"
            initialData={initialUserTypeOptions}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Markdown:"
          error={errors?.markdown}
        >
          <StandardTextInput<IFormData> rows={14} name="markdown" />
        </StandardFieldWrapper>

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

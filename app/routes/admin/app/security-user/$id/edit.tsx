import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import type { SecurityUser } from "~/models/securityUser.server";
import { getSecurityUser } from "~/models/securityUser.server";
import type { Session } from "~/session";
import { getUserSession, requireUserSession } from "~/session";
import { parseInt } from "~/utils/parse";
import type { ActionFunction } from "~/utils/types";

interface LoaderData {
  isEdit: boolean;
  item: Awaited<ReturnType<typeof getOne>> | undefined;
}

interface IFormData extends SecurityUser {}

async function getOne(session: Session, id: number) {
  return await getSecurityUser(session, {
    SecurityUserId: id,

    select: {
      SecurityUserId: true,
    },
  });
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  if (params.id !== undefined) {
    const id = parseInt(params.id);
    const item = await getOne(session, id);
    invariant(item, "SecurityUser not found");
    return json<LoaderData>({ isEdit: true, item });
  }

  return null;
};

type SaveError = Partial<Record<keyof SecurityUser, string>>;

export const action: ActionFunction<SecurityUser> = async ({
  request,
  params,
}) => {
  const session = await getUserSession(request);
  const formData = await request.formData();

  const rawSecurityUserId = params.id;
  // const codeGroup = formData.get("CodeGroup");
  // const codeValue = formData.get("CodeValue");
  // const description = formData.get("Description");
  // const rawActive = formData.get("Active");
  // const rawIsDefault = formData.get("Default");
  // const rawSort = formData.get("Sort");

  const errors: SaveError = {};
  // if (!codeGroup) errors.CodeGroup = "CodeGroup is required";
  // if (!codeValue) errors.CodeValue = "CodeValue is required";
  // if (rawActive === null) errors.Active = "Active is required";
  // if (rawIsDefault === null) errors.Default = "Default is required";
  // if (rawSort === null) errors.Sort = "Sort is required";

  // if (Object.keys(errors).length) {
  //   return json(errors);
  // }

  // stringInvariant(codeGroup);
  // stringInvariant(codeValue);
  // stringInvariant(description);

  // const active = parseCheckbox(rawActive);
  // const isDefault = parseCheckbox(rawIsDefault);

  // const sort = parseInt(rawSort);

  // if (rawSecurityUserId !== undefined) {
  //   const securityUserId = parseInt(rawSecurityUserId);

  //   await updateSecurityUser(session, {
  //     SecurityUserId: securityUserId,
  //     CodeGroup: codeGroup,
  //     CodeValue: codeValue,
  //     Description: description,
  //     Active: active,
  //     Default: isDefault,
  //     Sort: sort,
  //   });
  // } else {
  //   invariant(!params.SecurityUserId);

  //   await createSecurityUser(session, {
  //     CodeGroup: codeGroup,
  //     CodeValue: codeValue,
  //     Description: description,
  //     Active: active,
  //     Default: isDefault,
  //     Sort: sort,
  //   });
  // }

  return redirect("/admin/app/security-user");
};

export default function EditSecurityUser() {
  const errors = useActionData<SaveError>();
  const transition = useTransition();
  const { isEdit, item } = useLoaderData<LoaderData | undefined>() ?? {};

  return (
    <Form key={item?.SecurityUserId} method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <h1>{isEdit ? "Edit" : "New"} Security User</h1>
        <p>
          <button type="submit" className="btn btn-primary me-2">
            {transition.submission ? "Saving..." : "Save"}
          </button>

          <Link to={"/admin/app/security-user"}>Cancel</Link>
        </p>
      </fieldset>
    </Form>
  );
}

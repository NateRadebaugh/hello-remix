import type { ActionFunction, LoaderFunction } from "@remix-run/node";
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
import {
  createSecurityUser,
  getSecurityUser,
  updateSecurityUser,
} from "~/models/securityUser.server";
import { getUserSession, requireUserSession } from "~/session";
import { stringInvariant } from "~/utils/invariants";
import { parseCheckbox, parseInt } from "~/utils/parse";

interface LoaderData {
  isEdit: boolean;
  item: SecurityUser | undefined;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  if (params.id !== undefined) {
    const id = parseInt(params.id);

    const item = await getSecurityUser(session, {
      SecurityUserId: id,
    });
    invariant(item, "SecurityUser not found");
    return json<LoaderData>({ isEdit: true, item });
  }

  return null;
};

type SaveError = Partial<Record<keyof SecurityUser, string>>;

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getUserSession(request);
  const formData = await request.formData();

  const rawSecurityUserId = params.id;
  const codeGroup = formData.get("CodeGroup");
  const codeValue = formData.get("CodeValue");
  const description = formData.get("Description");
  const rawActive = formData.get("Active");
  const rawIsDefault = formData.get("Default");
  const rawSort = formData.get("Sort");

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

  return redirect("/admin/app/code-detail");
};

export default function EditSecurityUser() {
  const errors = useActionData<SaveError>();
  const transition = useTransition();
  const { isEdit, item } = useLoaderData<LoaderData | undefined>() ?? {};

  return (
    <Form key={item?.SecurityUserId} method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <h1>{isEdit ? "Edit" : "New"} Security User</h1>
        {/* <p>
          <label className="w-100">
            Group:{" "}
            {errors?.CodeGroup ? (
              <em className="text-danger">{errors.CodeGroup}</em>
            ) : null}{" "}
            <input
              type="text"
              className="form-control"
              name="CodeGroup"
              defaultValue={item?.CodeGroup}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Value:{" "}
            {errors?.CodeValue ? (
              <em className="text-danger">{errors.CodeValue}</em>
            ) : null}{" "}
            <input
              type="text"
              className="form-control"
              name="CodeValue"
              defaultValue={item?.CodeValue}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Description:{" "}
            {errors?.Description ? (
              <em className="text-danger">{errors.Description}</em>
            ) : null}{" "}
            <input
              type="text"
              className="form-control"
              name="Description"
              defaultValue={item?.Description ?? ""}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Active?{" "}
            {errors?.Active ? (
              <em className="text-danger">{errors.Active}</em>
            ) : null}{" "}
            <input
              type="checkbox"
              name="Active"
              defaultChecked={item?.Active ?? true}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Default?{" "}
            {errors?.Default ? (
              <em className="text-danger">{errors.Default}</em>
            ) : null}{" "}
            <input
              type="checkbox"
              name="Default"
              defaultChecked={item?.Default ?? false}
            />
          </label>
        </p>
        <p>
          <label className="w-100">
            Sort:{" "}
            {errors?.Sort ? (
              <em className="text-danger">{errors.Sort}</em>
            ) : null}{" "}
            <input
              type="number"
              className="form-control"
              name="Sort"
              min={0}
              defaultValue={item?.Sort ?? "0"}
            />
          </label>
        </p> */}
        <p>
          <button type="submit" className="btn btn-primary me-2">
            {transition.submission ? "Saving..." : "Save"}
          </button>

          <Link to={"/admin/app/code-detail"}>Cancel</Link>
        </p>
      </fieldset>
    </Form>
  );
}

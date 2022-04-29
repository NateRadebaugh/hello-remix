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
import type { AppCodeDetail } from "~/models/appCodeDetail.server";
import {
  createAppCodeDetail,
  getAppCodeDetail,
  updateAppCodeDetail,
} from "~/models/appCodeDetail.server";
import { stringInvariant } from "~/utils/invariants";
import { parseCheckbox, parseInt } from "~/utils/parse";

interface LoaderData {
  isEdit: boolean;
  item: AppCodeDetail | undefined;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.id !== undefined) {
    const id = parseInt(params.id);

    const item = await getAppCodeDetail({
      AppCodeDetailId: id,
    });
    invariant(item, "AppCodeDetail not found");
    return json<LoaderData>({ isEdit: true, item });
  }

  return null;
};

type SaveError = Partial<Record<keyof AppCodeDetail, string>>;

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const rawAppCodeDetailId = params.id;
  const codeGroup = formData.get("CodeGroup");
  const codeValue = formData.get("CodeValue");
  const description = formData.get("Description");
  const rawActive = formData.get("Active");
  const rawIsDefault = formData.get("Default");
  const rawSort = formData.get("Sort");

  const errors: SaveError = {};
  if (!codeGroup) errors.CodeGroup = "CodeGroup is required";
  if (!codeValue) errors.CodeValue = "CodeValue is required";
  if (rawActive === null) errors.Active = "Active is required";
  if (rawIsDefault === null) errors.Default = "Default is required";
  if (rawSort === null) errors.Sort = "Sort is required";

  if (Object.keys(errors).length) {
    return json(errors);
  }

  stringInvariant(codeGroup);
  stringInvariant(codeValue);
  stringInvariant(description);

  const active = parseCheckbox(rawActive);
  const isDefault = parseCheckbox(rawIsDefault);

  const sort = parseInt(rawSort);

  if (rawAppCodeDetailId !== undefined) {
    const appCodeDetailId = parseInt(rawAppCodeDetailId);

    await updateAppCodeDetail({
      AppCodeDetailId: appCodeDetailId,
      CodeGroup: codeGroup,
      CodeValue: codeValue,
      Description: description,
      Active: active,
      Default: isDefault,
      Sort: sort,
    });
  } else {
    invariant(!params.AppCodeDetailId);

    await createAppCodeDetail({
      CodeGroup: codeGroup,
      CodeValue: codeValue,
      Description: description,
      Active: active,
      Default: isDefault,
      Sort: sort,
    });
  }

  return redirect("/admin/app/code-detail");
};

export default function EditAppCodeDetail() {
  const errors = useActionData<SaveError>();
  const transition = useTransition();
  const { isEdit, item } = useLoaderData<LoaderData | undefined>() ?? {};

  return (
    <Form key={item?.AppCodeDetailId} method="post">
      <fieldset disabled={Boolean(transition.submission)}>
        <h1>{isEdit ? "Edit" : "New"} App Code Detail</h1>
        <p>
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
        </p>
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

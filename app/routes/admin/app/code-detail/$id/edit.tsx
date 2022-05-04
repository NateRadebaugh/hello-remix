import type { LoaderFunction } from "~/utils/types";
import { json, redirect } from "~/utils/types";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import StandardCheckbox from "~/components/standard-checkbox";
import StandardFieldWrapper from "~/components/standard-field-wrapper";
import StandardTextInput from "~/components/standard-text-input";
import type { AppCodeDetail } from "~/models/appCodeDetail.server";
import {
  createAppCodeDetail,
  getAppCodeDetail,
  updateAppCodeDetail,
} from "~/models/appCodeDetail.server";
import type { Session } from "~/session";
import { getUserSession, requireUserSession } from "~/session";
import { stringInvariant } from "~/utils/invariants";
import { parseCheckbox, parseInt } from "~/utils/parse";
import type { ActionFunction } from "~/utils/types";

interface LoaderData {
  isEdit: boolean;
  item: Awaited<ReturnType<typeof getOne>> | undefined;
}

interface IFormData extends AppCodeDetail {}

async function getOne(session: Session, id: number) {
  return await getAppCodeDetail(session, {
    AppCodeDetailId: id,

    select: {
      AppCodeDetailId: true,
      CodeGroup: true,
      CodeValue: true,
      Description: true,
      Active: true,
      Default: true,
      Sort: true,
    },
  });
}

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const session = await requireUserSession(request);
  if (params.id !== undefined) {
    const id = parseInt(params.id);
    const item = await getOne(session, id);
    invariant(item, "AppCodeDetail not found");
    return json({ isEdit: true, item });
  }

  return json({
    isEdit: false,
    item: undefined,
  });
};

type SaveError = Partial<Record<keyof AppCodeDetail, string>>;

export const action: ActionFunction<AppCodeDetail> = async ({
  request,
  params,
}) => {
  const session = await getUserSession(request);
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

    await updateAppCodeDetail(session, {
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

    await createAppCodeDetail(session, {
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

        <StandardFieldWrapper<IFormData>
          label="Group:"
          required
          error={errors?.CodeGroup}
        >
          <StandardTextInput<IFormData>
            name="CodeGroup"
            defaultValue={item?.CodeGroup}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Value:"
          required
          error={errors?.CodeValue}
        >
          <StandardTextInput<IFormData>
            name="CodeValue"
            defaultValue={item?.CodeValue}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Description:"
          error={errors?.Description}
        >
          <StandardTextInput<IFormData>
            name="Description"
            defaultValue={item?.Description ?? ""}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData> label="Active?" error={errors?.Active}>
          <StandardCheckbox<IFormData>
            name="Active"
            defaultChecked={item?.Active ?? true}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData>
          label="Default?"
          error={errors?.Default}
        >
          <StandardCheckbox<IFormData>
            name="Default"
            defaultChecked={item?.Default ?? true}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper<IFormData> label="Sort:" error={errors?.Sort}>
          <StandardTextInput<IFormData>
            name="Sort"
            defaultValue={item?.Sort ?? ""}
            required
          />
        </StandardFieldWrapper>

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

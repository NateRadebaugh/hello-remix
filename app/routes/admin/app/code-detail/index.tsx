import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import StandardDropdown from "~/components/standard-dropdown";
import { getAppCodeDetailListItems as rawGetAppCodeDetailListItems } from "~/models/appCodeDetail.server";
import type { Session } from "~/session";
import { getUserSession, requireUserSession } from "~/session";
import type { WhereType } from "~/models/appCodeDetail.server";

function getAppCodeDetailListItems(session: Session, where: WhereType) {
  return rawGetAppCodeDetailListItems(session, {
    select: {
      AppCodeDetailId: true,
      CodeValue: true,
      CodeGroup: true,
      Active: true,
      Default: true,
      Sort: true,
      Description: true,
    },
    where: where,
  });
}

type Unarray<T> = T extends (infer U)[] ? U : T;
type DropdownItem = Unarray<Awaited<ReturnType<typeof getAppCodeDetailListItems>>>;

type LoaderData = {
  items: DropdownItem[];
};

type IFormData = {
  group?: string;
  value?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  const items = await getAppCodeDetailListItems(session, {});
  return json<LoaderData>({ items });
};

interface TypedFormData<TFormData> {
  append<TField extends keyof TFormData>(
    name: TField,
    value: TFormData[TField] | Blob,
    fileName?: string
  ): void;
  delete(name: keyof TFormData): void;
  get(name: keyof TFormData): FormDataEntryValue | null;
  getAll(name: keyof TFormData): FormDataEntryValue[];
  has(name: keyof TFormData): boolean;
  set<TField extends keyof TFormData>(
    name: TField,
    value: TFormData[TField] | Blob,
    fileName?: string
  ): void;
  forEach(
    callbackfn: (
      value: FormDataEntryValue,
      key: string,
      parent: FormData
    ) => void,
    thisArg?: unknown
  ): void;
}

function typedFormData<TFormData>(
  formData: FormData
): TypedFormData<TFormData> {
  const typed = formData;
  return typed as TypedFormData<TFormData>;
}

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getUserSession(request);
  const formData = typedFormData<IFormData>(await request.formData());

  const where: WhereType = {};
  const group = formData.get("group");
  if (group) {
    where.CodeGroup = {
      contains: group.toString(),
    };
  }

  const value = formData.get("value");
  if (value) {
    where.CodeValue = {
      contains: value.toString(),
    };
  }

  const items = await getAppCodeDetailListItems(session, where);

  return json<LoaderData>({ items });
};

export default function Index() {
  const ref = useRef<HTMLFormElement | null>(null);
  const fetcher = useFetcher<LoaderData>();
  const { data: { items = [] } = {} } = fetcher;

  useEffect(() => {
    fetcher.submit({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h1>App Code Detail</h1>
        <div>
          <Link to="new" className="btn btn-primary">
            New
          </Link>
        </div>
      </div>

      <fetcher.Form ref={ref} method="post">
        <div className="border mb-3">
          <div className="d-flex border-bottom bg-light p-3">
            <strong>Filter</strong>
          </div>
          <div className="p-3">
            <div className="row align-items-end">
              <div className="col-md-3">
                <label className="w-100">
                  Group:
                  <StandardDropdown<DropdownItem>
                    name="group"
                    initialData={[]}
                    fetcher={() =>
                      fetch(`/api/app-code-detail-search`).then(
                        (res) => res.json() as unknown as DropdownItem[]
                      )
                    }
                    labelField="CodeGroup"
                    valueField="CodeGroup"
                  />
                </label>
              </div>
              <div className="col-md-3">
                <label>
                  Value:
                  <input type="text" name="value" className="form-control" />
                </label>
              </div>

              <div className="col-auto d-flex flex-row-reverse">
                <button className="btn btn-primary">Search</button>
                <button
                  className="btn btn-secondary me-1"
                  onClick={() => ref.current?.reset()}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </fetcher.Form>

      <table className="table">
        <thead>
          <tr>
            {/* Tablet/Desktop */}
            <th scope="col" className="d-none d-md-table-cell">
              Group
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Value
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Sort
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Description
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Active
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Default
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Actions
            </th>

            {/* Mobile */}
            <th scope="col" className="d-table-cell d-md-none">
              Code Detail
            </th>
            <th scope="col" className="d-table-cell d-md-none">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.AppCodeDetailId}>
              {/* Tablet/Desktop */}
              <td scope="row" className="d-none d-md-table-cell">
                {item.CodeGroup}
              </td>
              <td className="d-none d-md-table-cell">{item.CodeValue}</td>
              <td className="d-none d-md-table-cell">{item.Sort}</td>
              <td className="d-none d-md-table-cell">{item.Description}</td>
              <td className="d-none d-md-table-cell">
                {item.Active ? "yes" : "no"}
              </td>
              <td className="d-none d-md-table-cell">
                {item.Default ? "yes" : "no"}
              </td>

              {/* Mobile */}
              <td scope="row" className="d-table-cell d-md-none">
                <h4 className="mb-0">Code Group: {item.CodeGroup}</h4>
                <strong>Code Value:</strong> {item.CodeValue}
                <br />
                <strong>Sort:</strong> {item.Sort}
                <br />
                <strong>Description:</strong> {item.Description}
                <br />
                <strong>Active?</strong> {item.Active ? "yes" : "no"}
                <br />
                <strong>Default?</strong> {item.Default ? "yes" : "no"}
              </td>

              <td>
                <Link to={`${item.AppCodeDetailId}/edit`}>Edit</Link>
                <br />
                <Link
                  to={`${item.AppCodeDetailId}/delete`}
                  className="text-danger"
                  onClick={(e) => {
                    if (!confirm("Are you sure?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

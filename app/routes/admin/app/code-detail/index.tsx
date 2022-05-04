import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import StandardDropdown from "~/components/standard-dropdown";
import { getAppCodeDetailListItems as rawGetAppCodeDetailListItems } from "~/models/appCodeDetail.server";
import type { Session } from "~/session";
import { getUserSession, requireUserSession } from "~/session";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  Unarray,
} from "~/utils/types";
import { json } from "~/utils/types";
import StandardTextInput from "~/components/standard-text-input";
import StandardCheckbox from "~/components/standard-checkbox";
import type { Prisma } from "@prisma/client";
import StandardFieldWrapper from "~/components/standard-field-wrapper";
import { siteTitle } from "config";

export const meta: MetaFunction<LoaderData> = () => ({
  title: "App Code Details - Admin - " + siteTitle,
});

// TODO: remove fake timeout
function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

function getAppCodeDetailListItems(
  session: Session,
  where: Prisma.AppCodeDetailWhereInput
) {
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

type DropdownItem = Unarray<
  Awaited<ReturnType<typeof getAppCodeDetailListItems>>
>;

type LoaderData = {
  items: DropdownItem[];
};

type IFormData = {
  group?: string;
  value?: string;
  description?: string;
  includeInactive?: "on";
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const session = await requireUserSession(request);
  const items = await getAppCodeDetailListItems(session, {
    Active: true,
  });
  return json({ items: items });
};

export const action: ActionFunction<IFormData> = async ({
  request,
  params,
}) => {
  const session = await getUserSession(request);
  const formData = await request.formData();

  const where: Prisma.AppCodeDetailWhereInput = {};
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

  const description = formData.get("description");
  if (description) {
    where.Description = {
      contains: description.toString(),
    };
  }

  const includeInactive = formData.get("includeInactive");
  console.log({ includeInactive });
  if (includeInactive !== "on") {
    where.Active = {
      equals: true,
    };
  }

  const items = await getAppCodeDetailListItems(session, where);

  return json<LoaderData>({ items });
};

export default function Index() {
  const ref = useRef<HTMLFormElement | null>(null);
  const initialData = useLoaderData<LoaderData>();
  const fetcher = useFetcher<LoaderData>();
  const items = fetcher.data?.items ?? initialData.items;

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
              <div className="col-sm-6 col-md-3">
                <StandardFieldWrapper<IFormData> label="Group:">
                  <StandardDropdown<IFormData, DropdownItem>
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
                </StandardFieldWrapper>
              </div>
              <div className="col-sm-6 col-md-3">
                <StandardFieldWrapper<IFormData> label="Value:">
                  <StandardTextInput<IFormData> name="value" />
                </StandardFieldWrapper>
              </div>
              <div className="col-sm-6 col-md-3">
                <StandardFieldWrapper<IFormData> label="Description:">
                  <StandardTextInput<IFormData> name="description" />
                </StandardFieldWrapper>
              </div>
              <div className="col-sm-6 col-md-3">
                <StandardFieldWrapper<IFormData> label="Include Inactive:">
                  <StandardCheckbox<IFormData> name="includeInactive" />
                </StandardFieldWrapper>
              </div>

              <div className="col-auto ms-auto d-flex flex-row-reverse">
                <button className="btn btn-primary mb-1">Search</button>
                <button
                  className="btn btn-secondary mb-1 me-1"
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
          {fetcher.state === "idle" &&
            items.map((item) => (
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
                  <Link to={`${item.AppCodeDetailId}`}>View</Link>
                  <br />
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

          {(fetcher.state === "loading" || fetcher.state === "submitting") && (
            <>
              {[1, 2, 3].map((row) => (
                <tr key={row}>
                  <td>
                    <div className="placeholder-glow">
                      <span
                        className="placeholder"
                        style={{ width: "400px" }}
                      ></span>
                    </div>
                  </td>
                  {[1, 2, 3, 4, 5].map((col) => (
                    <td key={col}>
                      <div className="placeholder-glow">
                        <span className="placeholder w-75"></span>
                      </div>
                    </td>
                  ))}
                  <td key="actions">
                    <div className="placeholder-glow">
                      <span className="placeholder w-100"></span>
                      <span className="placeholder w-75"></span>
                      <span className="placeholder w-100"></span>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

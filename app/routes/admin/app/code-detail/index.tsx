import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAppCodeDetailListItems } from "~/models/appCodeDetail.server";

type LoaderData = {
  items: Awaited<ReturnType<typeof getAppCodeDetailListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const items = await getAppCodeDetailListItems();
  return json<LoaderData>({ items });
};

export default function Index() {
  const { items } = useLoaderData<LoaderData>();

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
              <td className="d-none d-md-table-cell">
                <Link to={`${item.AppCodeDetailId}/edit`}>
                  {item.CodeValue}
                </Link>
              </td>
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
                <h4 className="mb-0">{item.CodeGroup}</h4>
                <Link to={`${item.AppCodeDetailId}/edit`}>
                  <strong>{item.CodeValue}</strong>
                </Link>
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
                <p>
                  <Link to={`${item.AppCodeDetailId}/edit`}>Edit</Link>
                </p>
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

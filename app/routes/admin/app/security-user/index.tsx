import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSecurityUserListItems } from "~/models/securityUser.server";
import { requireUserSession } from "~/session";

type LoaderData = {
  items: Awaited<ReturnType<typeof getSecurityUserListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  const items = await getSecurityUserListItems(session);
  return json<LoaderData>({ items });
};

export default function Index() {
  const { items } = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h1>Security User</h1>
        <div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            {/* Tablet/Desktop */}
            <th scope="col" className="d-none d-md-table-cell">
              Name
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Username
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Email Address
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Active
            </th>
            <th scope="col" className="d-none d-md-table-cell">
              Roles
            </th>

            {/* Mobile */}
            <th scope="col" className="d-table-cell d-md-none">
              Security User
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.SecurityUserId}>
              {/* Tablet/Desktop */}
              <td scope="row" className="d-none d-md-table-cell">
                {item.FirstName} {item.LastName}
              </td>
              <td className="d-none d-md-table-cell">
                {item.UserName || "---"}
              </td>
              <td className="d-none d-md-table-cell">
                {item.EmailAddress || "---"}
              </td>
              <td className="d-none d-md-table-cell">
                {item.Active ? "yes" : "no"}
              </td>
              <td className="d-none d-md-table-cell">
                {item.SecurityUserRoleMembership.length > 0
                  ? item.SecurityUserRoleMembership.map((x) =>
                      x.SecurityRole.ADGroupName
                        ? `${x.SecurityRole.Name} (ADGroup: ${x.SecurityRole.ADGroupName})`
                        : x.SecurityRole.Name
                    )
                  : "---"}
              </td>

              {/* Mobile */}
              <td scope="row" className="d-table-cell d-md-none">
                <h4 className="mb-0">
                  {item.FirstName} {item.LastName}
                </h4>
                <strong>UserName:</strong> {item.UserName || "---"}
                <br />
                <strong>EmailAddress:</strong> {item.EmailAddress || "---"}
                <br />
                <strong>Active:</strong> {item.Active ? "yes" : "no"}
                <br />
                <strong>Roles:</strong>{" "}
                {item.SecurityUserRoleMembership.length > 0
                  ? item.SecurityUserRoleMembership.map((x) =>
                      x.SecurityRole.ADGroupName
                        ? `${x.SecurityRole.Name} (ADGroup: ${x.SecurityRole.ADGroupName})`
                        : x.SecurityRole.Name
                    )
                  : "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

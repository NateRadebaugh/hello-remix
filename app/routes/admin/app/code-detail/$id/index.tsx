import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getAppCodeDetail } from "~/models/appCodeDetail.server";
import { getSecurityUserListItems } from "~/models/securityUser.server";
import type { Session } from "~/session";
import { requireUserSession } from "~/session";

type LoaderData = {
  item: Awaited<ReturnType<typeof getOne>> | undefined;
} & (
  | {
      group: "SecurityUser.UserType";
      relatedItems: Awaited<ReturnType<typeof getRelatedSecurityUsers>>;
    }
  | {
      group: undefined;
    }
);

async function getRelatedSecurityUsers(session: Session) {
  return await getSecurityUserListItems(session);
}

async function getOne(session: Session, id: number) {
  return await getAppCodeDetail(session, {
    AppCodeDetailId: id,

    select: {
      CodeGroup: true,
      CodeValue: true,
      Description: true,
      Active: true,
      Default: true,
      Sort: true,
    },
  });
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  if (params.id !== undefined) {
    const id = parseInt(params.id);
    const item = await getOne(session, id);
    invariant(item, "AppCodeDetail not found");

    switch (item.CodeGroup) {
      case "SecurityUser.UserType":
        {
          const relatedSecurityUsers = await getRelatedSecurityUsers(session);
          return json<LoaderData>({
            item,
            group: "SecurityUser.UserType",
            relatedItems: relatedSecurityUsers,
          });
        }
        break;

      default:
        return json<LoaderData>({
          item,
          group: undefined,
        });
    }
  }

  return null;
};

export default function View() {
  const navigate = useNavigate();
  const { item, ...rest } = useLoaderData<LoaderData>();

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto">
          <h1>App Code Detail</h1>
        </div>

        <div className="col-auto ms-auto">
          <a
            href="/admin/app/code-detail"
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Cancel
          </a>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-4">
          <strong>Group:</strong>
          <p>{item?.CodeGroup}</p>

          <strong>Value:</strong>
          <p>{item?.CodeValue}</p>

          <strong>Description:</strong>
          <p>{item?.Description}</p>

          <strong>Active:</strong>
          <p>{item?.Active ? "yes" : "no"}</p>

          <strong>Default:</strong>
          <p>{item?.Default ? "yes" : "no"}</p>

          <strong>Sort:</strong>
          <p>{item?.Sort}</p>
        </div>

        <div className="col-md-6 col-lg-8">
          {rest.group === "SecurityUser.UserType" && (
            <>
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
                  {rest.relatedItems.map((item) => (
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
                        <strong>EmailAddress:</strong>{" "}
                        {item.EmailAddress || "---"}
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

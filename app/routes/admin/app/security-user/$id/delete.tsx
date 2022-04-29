import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteSecurityUser } from "~/models/securityUser.server";
import { requireUserSession } from "~/session";
import { parseInt } from "~/utils/parse";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  const id = parseInt(params.id);

  const item = await deleteSecurityUser(session, {
    SecurityUserId: id,
  });
  invariant(item, "SecurityUser not found");

  return redirect("/admin/app/security-user");
};

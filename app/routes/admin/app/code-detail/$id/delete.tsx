import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteAppCodeDetail } from "~/models/appCodeDetail.server";
import { requireUserSession } from "~/session";
import { parseInt } from "~/utils/parse";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  const id = parseInt(params.id);

  const item = await deleteAppCodeDetail(session, {
    AppCodeDetailId: id,
  });
  invariant(item, "AppCodeDetail not found");

  return redirect("/admin/app/code-detail");
};

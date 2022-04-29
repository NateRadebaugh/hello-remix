import type { LoaderFunction } from "remix";
import { redirect } from "remix";
import invariant from "tiny-invariant";
import { deleteAppCodeDetail } from "~/models/appCodeDetail.server";
import { parseInt } from "~/utils/parse";

export const loader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.id);

  const item = await deleteAppCodeDetail({
    AppCodeDetailId: id,
  });
  invariant(item, "AppCodeDetail not found");

  return redirect("/admin/app/code-detail");
};
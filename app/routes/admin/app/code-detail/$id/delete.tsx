import type { LoaderFunction } from "remix";
import { redirect } from "remix";
import invariant from "tiny-invariant";
import { deleteAppCodeDetail } from "~/models/appCodeDetail.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(typeof params.id === "string");
  const id = parseInt(params.id, 10);
  invariant(!isNaN(id));

  const item = await deleteAppCodeDetail({
    AppCodeDetailId: id,
  });
  invariant(item, "AppCodeDetail not found");

  return redirect("/admin/app/code-detail");
};

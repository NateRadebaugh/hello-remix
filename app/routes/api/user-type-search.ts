import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAppCodeDetailListItems } from "~/models/appCodeDetail.server";
import { requireUserSession } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireUserSession(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json(
    await getAppCodeDetailListItems(session, {
      where: {
        CodeGroup: "SecurityUser.UserType",
        Active: true,
      },
    })
  );
};

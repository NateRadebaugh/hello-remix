import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAppCodeDetailListItems } from "~/models/appCodeDetail.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json(await getAppCodeDetailListItems("SecurityUser.UserType"));
};

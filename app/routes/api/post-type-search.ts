import { json } from "remix";
import type { LoaderFunction } from "remix";
import { searchPostTypes } from "~/post";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const data = await searchPostTypes(url.searchParams.get("q") ?? undefined);
  return json(data, 200);
};

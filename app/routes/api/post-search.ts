import { json } from "remix";
import type { LoaderFunction } from "remix";
import { searchPosts } from "~/post";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const data = await searchPosts(url.searchParams.get("q") ?? undefined);
  return json(data, 200);
};

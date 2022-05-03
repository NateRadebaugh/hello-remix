import { prisma } from "~/db.server";
import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserSession } from "~/session";

export async function loader({ request }: DataFunctionArgs) {
  const session = await requireUserSession(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json(
    await prisma.appCodeDetail.groupBy({
      by: ["CodeGroup"],
      where: {},
    })
  );
}

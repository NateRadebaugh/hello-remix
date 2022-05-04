import { siteTitle } from "config";
import type { MetaFunction } from "~/utils/types";
import Page from "./$id/edit";

import type { LoaderData } from "./$id/edit";
export * from "./$id/edit";

export const meta: MetaFunction<LoaderData> = () => ({
  title: "New App Code Detail - Admin - " + siteTitle,
});

export default Page;

import { AppCodeDetail } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export function getAppCodeDetail({
  AppCodeDetailId,
}: {
  AppCodeDetailId: number;
}) {
  return prisma.appCodeDetail.findFirst({
    where: { AppCodeDetailId },
  });
}

export function getAppCodeDetailListItems(codeGroup?: string) {
  return prisma.appCodeDetail.findMany({
    where: { CodeGroup: codeGroup },
    select: {
      AppCodeDetailId: true,
      CodeGroup: true,
      CodeValue: true,
      Description: true,
      Default: true,
      Active: true,
      Sort: true,
    },
    orderBy: [{ CodeGroup: "asc" }, { Sort: "asc" }, { ModifyDate: "desc" }],
  });
}

export async function getUserTypes() {
  return await getAppCodeDetailListItems("SecurityUser.UserType");
}

export function createAppCodeDetail(
  item: Omit<
    AppCodeDetail,
    | "AppCodeDetailId"
    | "CreateDate"
    | "CreateUser"
    | "ModifyDate"
    | "ModifyUser"
  >
) {
  return prisma.appCodeDetail.create({
    data: {
      ...item,
      CreateDate: new Date(),
      CreateUser: "TODO",
      ModifyDate: undefined,
      ModifyUser: undefined,
    },
  });
}

export function updateAppCodeDetail(
  item: Partial<AppCodeDetail> & { AppCodeDetailId: number }
) {
  invariant(
    item.AppCodeDetailId !== undefined,
    `item.AppCodeDetailId must be set`
  );
  invariant(item.AppCodeDetailId > 0, `item.AppCodeDetailId must be > 0`);

  const { AppCodeDetailId, ...data } = item;
  return prisma.appCodeDetail.update({
    data: { ...data, ModifyDate: new Date(), ModifyUser: "TODO" },
    where: { AppCodeDetailId: AppCodeDetailId },
  });
}

export function deleteAppCodeDetail({
  AppCodeDetailId,
}: {
  AppCodeDetailId: number;
}) {
  invariant(AppCodeDetailId > 0, `AppCodeDetailId must be > 0`);

  return prisma.appCodeDetail.deleteMany({
    where: { AppCodeDetailId },
  });
}

export type { AppCodeDetail } from "@prisma/client";

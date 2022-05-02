import type { AppCodeDetail } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { Session } from "~/session";

export function getAppCodeDetail(
  session: Session,
  {
    AppCodeDetailId,
  }: {
    AppCodeDetailId: number;
  }
) {
  invariant(session);
  return prisma.appCodeDetail.findFirst({
    where: { AppCodeDetailId },
  });
}

export type WhereType = NonNullable<
  Parameters<typeof prisma.appCodeDetail.findMany>["0"]
>["where"];

export type SelectType = NonNullable<
  Parameters<typeof prisma.appCodeDetail.findMany>["0"]
>["select"];

export function getAppCodeDetailListItems(
  session: Session,
  arg: Parameters<typeof prisma.appCodeDetail.findMany>["0"]
) {
  invariant(session);
  return prisma.appCodeDetail.findMany(arg);
}

export async function getUserTypes(session: Session) {
  return await getAppCodeDetailListItems(session, {
    where: {
      CodeGroup: "SecurityUser.UserType",
    },
  });
}

export function createAppCodeDetail(
  session: Session,
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
  session: Session,
  item: Partial<AppCodeDetail> | { AppCodeDetailId: number }
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

export function deleteAppCodeDetail(
  session: Session,
  {
    AppCodeDetailId,
  }: {
    AppCodeDetailId: number;
  }
) {
  invariant(session);
  invariant(AppCodeDetailId > 0, `AppCodeDetailId must be > 0`);

  return prisma.appCodeDetail.deleteMany({
    where: { AppCodeDetailId },
  });
}

export type { AppCodeDetail } from "@prisma/client";

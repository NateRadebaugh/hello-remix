import type { AppCodeDetail, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import type { Session } from "~/session";

export function getAppCodeDetail<TSelect extends Prisma.AppCodeDetailSelect>(
  session: Session,
  {
    select,
    AppCodeDetailId,
  }: {
    select: TSelect;
    AppCodeDetailId: number;
  }
) {
  invariant(session);
  return prisma.appCodeDetail.findFirst({
    select: select,
    where: { AppCodeDetailId },
  });
}

export function getAppCodeDetailListItems(
  session: Session,
  arg: Prisma.AppCodeDetailFindManyArgs
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

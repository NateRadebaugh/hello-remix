import type { Prisma, SecurityUser } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import type { Session } from "~/session";

export async function authenticateSecurityUser(
  session: Session,
  payload: { email: string; password: string }
) {
  invariant(session);
  invariant(payload.email);
  invariant(payload.password);

  const items = await prisma.securityUser.findMany({
    where: {
      UserName: payload.email,
      Active: true,
    },
    select: {
      SecurityUserId: true,
      FirstName: true,
      LastName: true,
      EmailAddress: true,
      SecurityUserRoleMembership: {
        select: {
          SecurityRole: {
            select: {
              Name: true,
              ADGroupName: true,
            },
          },
        },
      },
      Active: true,
    },
    orderBy: [{ EmailAddress: "asc" }, { ModifyDate: "desc" }],
    take: 1,
  });

  if (!items[0]) {
    return { error: "Email does not exist" };
  }

  // TODO: check password

  return { securityUser: items[0] };
}

export function getSecurityUser<TSelect extends Prisma.SecurityUserSelect>(
  session: Session,
  {
    select,
    SecurityUserId,
  }: {
    select: TSelect;
    SecurityUserId: number;
  }
) {
  invariant(session);
  return prisma.securityUser.findFirst({
    select: select,
    where: { SecurityUserId },
  });
}

export function getSecurityUserListItems(session: Session) {
  invariant(session);
  return prisma.securityUser.findMany({
    select: {
      SecurityUserId: true,
      FirstName: true,
      LastName: true,
      UserName: true,
      EmailAddress: true,
      SecurityUserRoleMembership: {
        select: {
          SecurityRole: {
            select: {
              Name: true,
              ADGroupName: true,
            },
          },
        },
      },
      Active: true,
    },
    orderBy: [{ EmailAddress: "asc" }, { ModifyDate: "desc" }],
  });
}

export function createSecurityUser(
  session: Session,
  item: Omit<
    SecurityUser,
    "SecurityUserId" | "CreateDate" | "CreateUser" | "ModifyDate" | "ModifyUser"
  >
) {
  return prisma.securityUser.create({
    data: {
      ...item,
      CreateDate: new Date(),
      CreateUser: "TODO",
      ModifyDate: undefined,
      ModifyUser: undefined,
    },
  });
}

export function updateSecurityUser(
  session: Session,
  item: Partial<SecurityUser> | { SecurityUserId: number }
) {
  invariant(
    item.SecurityUserId !== undefined,
    `item.SecurityUserId must be set`
  );
  invariant(item.SecurityUserId > 0, `item.SecurityUserId must be > 0`);

  const { SecurityUserId, ...data } = item;
  return prisma.securityUser.update({
    data: { ...data, ModifyDate: new Date(), ModifyUser: "TODO" },
    where: { SecurityUserId: SecurityUserId },
  });
}

export function deleteSecurityUser(
  session: Session,
  {
    SecurityUserId,
  }: {
    SecurityUserId: number;
  }
) {
  invariant(session);
  invariant(SecurityUserId > 0, `SecurityUserId must be > 0`);

  return prisma.securityUser.deleteMany({
    where: { SecurityUserId },
  });
}

export type { SecurityUser } from "@prisma/client";

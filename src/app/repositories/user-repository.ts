import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { hashPassword } from "@/lib/auth-utils";

export async function findUserById(
  userId: string,
  selectFields?: Prisma.UserSelect,
) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: selectFields,
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  return prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });
}

export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function findAccountsByUserId(
  userId: string,
  selectFields?: Prisma.BankAccountSelect,
) {
  return prisma.bankAccount.findMany({
    where: { userId },
    select: selectFields,
  });
}

export async function findAccountById(
  accountId: string,
  selectFields?: Prisma.BankAccountSelect,
) {
  return prisma.bankAccount.findUnique({
    where: { id: accountId },
    select: selectFields,
  });
}

export async function createAccount(
  userId: string,
  data: Omit<Prisma.BankAccountCreateInput, "user">,
) {
  return prisma.bankAccount.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateAccount(
  accountId: string,
  data: Prisma.BankAccountUpdateInput,
) {
  return prisma.bankAccount.update({
    where: { id: accountId },
    data,
  });
}

export async function deleteAccount(accountId: string) {
  return prisma.bankAccount.delete({
    where: { id: accountId },
  });
}

export async function getTotalBalanceByUserId(userId: string): Promise<number> {
  const result = await prisma.bankAccount.aggregate({
    where: { userId },
    _sum: { balance: true },
  });

  return Number(result._sum.balance) || 0;
}

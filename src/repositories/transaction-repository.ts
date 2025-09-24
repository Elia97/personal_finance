import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function findTransactionsByUserId(
  userId: string,
  accountId?: string,
  selectFields?: Prisma.TransactionSelect,
) {
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(accountId && { bankAccountId: accountId }),
    },
    select: selectFields,
    orderBy: { date: "desc" },
  });
}

export async function findTransactionById(
  transactionId: string,
  selectFields?: Prisma.TransactionSelect,
) {
  return prisma.transaction.findUnique({
    where: { id: transactionId },
    select: selectFields,
  });
}

export async function createTransaction(
  userId: string,
  data: Omit<Prisma.TransactionCreateInput, "user">,
) {
  return prisma.transaction.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateTransaction(
  transactionId: string,
  data: Prisma.TransactionUpdateInput,
) {
  return prisma.transaction.update({
    where: { id: transactionId },
    data,
  });
}

export async function deleteTransaction(transactionId: string) {
  return prisma.transaction.delete({
    where: { id: transactionId },
  });
}

export async function getTransactionSummaryByUserId(
  userId: string,
  accountId?: string,
): Promise<{ totalIncome: number; totalExpenses: number }> {
  const incomeResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "INCOME",
      ...(accountId && { bankAccountId: accountId }),
    },
    _sum: { amount: true },
  });

  const expenseResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "EXPENSE",
      ...(accountId && { bankAccountId: accountId }),
    },
    _sum: { amount: true },
  });

  return {
    totalIncome: Number(incomeResult._sum.amount) || 0,
    totalExpenses: Number(expenseResult._sum.amount) || 0,
  };
}

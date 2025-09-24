import prisma from "@/lib/prisma";
import type { Prisma, CategoryType } from "@/generated/prisma";

export async function findCategoriesByUserId(
  userId: string,
  selectFields?: Prisma.CategorySelect,
) {
  if (selectFields) {
    return prisma.category.findMany({
      where: {
        OR: [
          { userId }, // User custom categories
          { userId: null }, // System categories
        ],
      },
      select: selectFields,
    });
  }

  return prisma.category.findMany({
    where: {
      OR: [
        { userId }, // User custom categories
        { userId: null }, // System categories
      ],
    },
    include: {
      children: true,
    },
  });
}

export async function findCategoryById(
  categoryId: string,
  selectFields?: Prisma.CategorySelect,
) {
  return prisma.category.findUnique({
    where: { id: categoryId },
    select: selectFields,
  });
}

export async function createCategory(
  userId: string,
  data: Omit<Prisma.CategoryCreateInput, "user">,
) {
  return prisma.category.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function createSubcategory(
  userId: string,
  parentId: string,
  data: { name: string; type: CategoryType },
) {
  return prisma.category.create({
    data: {
      name: data.name,
      type: data.type,
      parentId,
      userId,
    },
  });
}

export async function updateCategory(
  categoryId: string,
  data: Prisma.CategoryUpdateInput,
) {
  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
}

export async function deleteCategory(categoryId: string) {
  return prisma.category.delete({
    where: { id: categoryId },
  });
}

export async function findGoalsByUserId(
  userId: string,
  selectFields?: Prisma.GoalSelect,
) {
  return prisma.goal.findMany({
    where: { userId },
    select: selectFields,
    orderBy: { deadline: "asc" },
  });
}

export async function createGoal(
  userId: string,
  data: Omit<Prisma.GoalCreateInput, "user">,
) {
  return prisma.goal.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateGoal(goalId: string, data: Prisma.GoalUpdateInput) {
  return prisma.goal.update({
    where: { id: goalId },
    data,
  });
}

export async function deleteGoal(goalId: string) {
  return prisma.goal.delete({
    where: { id: goalId },
  });
}

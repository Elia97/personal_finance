"use server";

import { getAuthSession } from "@/lib/auth-utils";
import { CategoriesService, GoalsService } from "@/lib/services/settings";
import {
  Category,
  Goal,
  CreateGoalData,
  UpdateGoalData,
} from "@/lib/types/settings";
import { revalidatePath } from "next/cache";

// Actions per le categorie
export async function getCategoriesAction(): Promise<Category[]> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    return await CategoriesService.getAll();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function addSubcategoryAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const categoryId = formData.get("categoryId") as string;
    const name = formData.get("name") as string;

    if (!categoryId || !name?.trim()) {
      return { error: "Category ID and name are required." };
    }

    await CategoriesService.addSubcategory(categoryId, {
      name: name.trim(),
      parentId: categoryId,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error adding subcategory:", error);
    return { error: "Failed to add subcategory." };
  }
}

export async function deleteSubcategoryAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const categoryId = formData.get("categoryId") as string;
    const subcategoryId = formData.get("subcategoryId") as string;

    if (!categoryId || !subcategoryId) {
      return { error: "Category ID and subcategory ID are required." };
    }

    await CategoriesService.deleteSubcategory(categoryId, subcategoryId);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return { error: "Failed to delete subcategory." };
  }
}

// Actions per gli obiettivi
export async function getGoalsAction(): Promise<Goal[]> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    return await GoalsService.getAll();
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw new Error("Failed to fetch goals");
  }
}

export async function createGoalAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const name = formData.get("name") as string;
    const target = formData.get("target") as string;
    const deadline = formData.get("deadline") as string;

    if (!name?.trim() || !target || !deadline) {
      return { error: "All fields are required." };
    }

    const targetValue = Number.parseInt(target);
    if (isNaN(targetValue) || targetValue <= 0) {
      return { error: "Target must be a positive number." };
    }

    const goalData: CreateGoalData = {
      name: name.trim(),
      target: targetValue,
      deadline,
    };

    await GoalsService.create(goalData);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { error: "Failed to create goal." };
  }
}

export async function deleteGoalAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const goalId = formData.get("goalId") as string;

    if (!goalId) {
      return { error: "Goal ID is required." };
    }

    const goalIdNumber = Number.parseInt(goalId);
    if (isNaN(goalIdNumber)) {
      return { error: "Invalid goal ID." };
    }

    await GoalsService.delete(goalIdNumber);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { error: "Failed to delete goal." };
  }
}

export async function updateGoalAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const goalId = formData.get("goalId") as string;
    const name = formData.get("name") as string;
    const target = formData.get("target") as string;
    const current = formData.get("current") as string;
    const deadline = formData.get("deadline") as string;

    if (!goalId) {
      return { error: "Goal ID is required." };
    }

    const goalIdNumber = Number.parseInt(goalId);
    if (isNaN(goalIdNumber)) {
      return { error: "Invalid goal ID." };
    }

    const updateData: UpdateGoalData = { id: goalIdNumber };

    if (name?.trim()) updateData.name = name.trim();
    if (target) {
      const targetValue = Number.parseInt(target);
      if (isNaN(targetValue) || targetValue <= 0) {
        return { error: "Target must be a positive number." };
      }
      updateData.target = targetValue;
    }
    if (current) {
      const currentValue = Number.parseInt(current);
      if (isNaN(currentValue) || currentValue < 0) {
        return { error: "Current amount cannot be negative." };
      }
      updateData.current = currentValue;
    }
    if (deadline) updateData.deadline = deadline;

    await GoalsService.update(updateData);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { error: "Failed to update goal." };
  }
}

// Action combinata per ottenere tutti i dati delle impostazioni
export async function getSettingsDataAction(): Promise<{
  categories: Category[];
  goals: Goal[];
}> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    const [categories, goals] = await Promise.all([
      CategoriesService.getAll(),
      GoalsService.getAll(),
    ]);

    return { categories, goals };
  } catch (error) {
    console.error("Error fetching settings data:", error);
    throw new Error("Failed to fetch settings data");
  }
}

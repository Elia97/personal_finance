import {
  findCategoriesByUserId,
  createSubcategory,
  deleteCategory,
  findGoalsByUserId,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/repositories/settings-repository";
import type {
  Category as PrismaCategory,
  Goal as PrismaGoal,
  CategoryType,
} from "@/generated/prisma";

// Types for settings operations
export interface Category extends Omit<PrismaCategory, "children"> {
  children?: Category[];
}

export type Goal = PrismaGoal;

export interface CreateSubcategoryData {
  name: string;
  type: CategoryType;
}

export interface CreateGoalData {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface UpdateGoalData {
  id: string;
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
}

// Services per le categorie
export class CategoriesService {
  static async getAllByUserId(userId: string): Promise<Category[]> {
    try {
      return await findCategoriesByUserId(userId);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
      throw new Error("Impossibile caricare le categorie");
    }
  }

  static async addSubcategory(
    userId: string,
    parentId: string,
    subcategoryData: CreateSubcategoryData,
  ): Promise<void> {
    try {
      if (!subcategoryData.name.trim()) {
        throw new Error("Il nome della sottocategoria è obbligatorio");
      }

      await createSubcategory(userId, parentId, {
        name: subcategoryData.name.trim(),
        type: subcategoryData.type,
      });
    } catch (error) {
      console.error("Errore nell'aggiunta della sottocategoria:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiunta della sottocategoria");
    }
  }

  static async deleteSubcategory(subcategoryId: string): Promise<void> {
    try {
      await deleteCategory(subcategoryId);
    } catch (error) {
      console.error("Errore nella cancellazione della sottocategoria:", error);
      throw new Error("Impossibile eliminare la sottocategoria");
    }
  }
}

// Services per gli obiettivi
export class GoalsService {
  static async getAllByUserId(userId: string): Promise<Goal[]> {
    try {
      return await findGoalsByUserId(userId);
    } catch (error) {
      console.error("Errore nel caricamento degli obiettivi:", error);
      throw new Error("Impossibile caricare gli obiettivi");
    }
  }

  static async create(userId: string, goalData: CreateGoalData): Promise<void> {
    try {
      // Validazione input
      if (!goalData.name.trim()) {
        throw new Error("Il nome dell'obiettivo è obbligatorio");
      }
      if (goalData.targetAmount <= 0) {
        throw new Error("L'importo target deve essere maggiore di zero");
      }
      if (!goalData.deadline) {
        throw new Error("La data di scadenza è obbligatoria");
      }

      await createGoal(userId, {
        name: goalData.name.trim(),
        targetAmount: goalData.targetAmount,
        deadline: new Date(goalData.deadline),
      });
    } catch (error) {
      console.error("Errore nella creazione dell'obiettivo:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nella creazione dell'obiettivo");
    }
  }

  static async update(goalData: UpdateGoalData): Promise<void> {
    try {
      // Validazione input se i campi sono presenti
      if (goalData.name !== undefined && !goalData.name.trim()) {
        throw new Error("Il nome dell'obiettivo non può essere vuoto");
      }
      if (goalData.targetAmount !== undefined && goalData.targetAmount <= 0) {
        throw new Error("L'importo target deve essere maggiore di zero");
      }
      if (goalData.currentAmount !== undefined && goalData.currentAmount < 0) {
        throw new Error("L'importo corrente non può essere negativo");
      }

      const updateData: Partial<{
        name: string;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
      }> = {};
      if (goalData.name !== undefined) updateData.name = goalData.name.trim();
      if (goalData.targetAmount !== undefined)
        updateData.targetAmount = goalData.targetAmount;
      if (goalData.currentAmount !== undefined)
        updateData.currentAmount = goalData.currentAmount;
      if (goalData.deadline !== undefined)
        updateData.deadline = new Date(goalData.deadline);

      await updateGoal(goalData.id, updateData);
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'obiettivo:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiornamento dell'obiettivo");
    }
  }

  static async delete(goalId: string): Promise<void> {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error("Errore nella cancellazione dell'obiettivo:", error);
      throw new Error("Impossibile eliminare l'obiettivo");
    }
  }
}

// Utility per gestire gli errori in modo consistente
export const handleServiceError = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

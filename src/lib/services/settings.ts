import {
  getCategoriesFromDB,
  addSubcategoryToDB,
  deleteSubcategoryFromDB,
} from "@/lib/data/categories";
import {
  getGoalsFromDB,
  createGoalInDB,
  updateGoalInDB,
  deleteGoalFromDB,
} from "@/lib/data/goals";
import {
  Category,
  Goal,
  CreateSubcategoryData,
  CreateGoalData,
  UpdateGoalData,
} from "@/lib/types/settings";

// Services per le categorie
export class CategoriesService {
  static async getAll(): Promise<Category[]> {
    try {
      return await getCategoriesFromDB();
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
      throw new Error("Impossibile caricare le categorie");
    }
  }

  static async addSubcategory(
    categoryId: string,
    subcategoryData: CreateSubcategoryData,
  ): Promise<Category[]> {
    try {
      if (!subcategoryData.name.trim()) {
        throw new Error("Il nome della sottocategoria è obbligatorio");
      }

      return await addSubcategoryToDB(categoryId, {
        name: subcategoryData.name.trim(),
      });
    } catch (error) {
      console.error("Errore nell'aggiunta della sottocategoria:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiunta della sottocategoria");
    }
  }

  static async deleteSubcategory(
    categoryId: string,
    subcategoryId: string,
  ): Promise<Category[]> {
    try {
      return await deleteSubcategoryFromDB(categoryId, subcategoryId);
    } catch (error) {
      console.error("Errore nella cancellazione della sottocategoria:", error);
      throw new Error("Impossibile eliminare la sottocategoria");
    }
  }
}

// Services per gli obiettivi
export class GoalsService {
  static async getAll(): Promise<Goal[]> {
    try {
      return await getGoalsFromDB();
    } catch (error) {
      console.error("Errore nel caricamento degli obiettivi:", error);
      throw new Error("Impossibile caricare gli obiettivi");
    }
  }

  static async create(goalData: CreateGoalData): Promise<Goal[]> {
    try {
      // Validazione input
      if (!goalData.name.trim()) {
        throw new Error("Il nome dell'obiettivo è obbligatorio");
      }
      if (goalData.target <= 0) {
        throw new Error("L'importo target deve essere maggiore di zero");
      }
      if (!goalData.deadline) {
        throw new Error("La data di scadenza è obbligatoria");
      }

      const cleanedData: CreateGoalData = {
        name: goalData.name.trim(),
        target: goalData.target,
        deadline: goalData.deadline,
      };

      return await createGoalInDB(cleanedData);
    } catch (error) {
      console.error("Errore nella creazione dell'obiettivo:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nella creazione dell'obiettivo");
    }
  }

  static async update(goalData: UpdateGoalData): Promise<Goal[]> {
    try {
      // Validazione input se i campi sono presenti
      if (goalData.name !== undefined && !goalData.name.trim()) {
        throw new Error("Il nome dell'obiettivo non può essere vuoto");
      }
      if (goalData.target !== undefined && goalData.target <= 0) {
        throw new Error("L'importo target deve essere maggiore di zero");
      }
      if (goalData.current !== undefined && goalData.current < 0) {
        throw new Error("L'importo corrente non può essere negativo");
      }

      return await updateGoalInDB(goalData);
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'obiettivo:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiornamento dell'obiettivo");
    }
  }

  static async delete(goalId: number): Promise<Goal[]> {
    try {
      return await deleteGoalFromDB(goalId);
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

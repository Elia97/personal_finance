import {
  findAccountsByUserId,
  findAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getTotalBalanceByUserId,
} from "@/repositories/account-repository";
import type { Prisma, AccountType } from "@/generated/prisma";

// Types for account operations
export interface CreateAccountData {
  name: string;
  type: string;
  currency?: string;
  initialBalance?: number;
  accountNumber?: string;
}

export interface UpdateAccountData {
  name?: string;
  type?: string;
  balance?: number;
  accountNumber?: string;
}

// Account Service Class
export class AccountService {
  /**
   * Get all accounts for a user
   */
  static async getAccountsByUserId(userId: string) {
    try {
      return await findAccountsByUserId(userId);
    } catch (error) {
      console.error("Errore nel caricamento degli account:", error);
      throw new Error("Impossibile caricare gli account");
    }
  }

  /**
   * Get account by ID
   */
  static async getAccountById(accountId: string) {
    try {
      const account = await findAccountById(accountId);
      if (!account) {
        throw new Error("Account non trovato");
      }
      return account;
    } catch (error) {
      console.error("Errore nel caricamento dell'account:", error);
      throw error instanceof Error
        ? error
        : new Error("Impossibile caricare l'account");
    }
  }

  /**
   * Create new account
   */
  static async createAccount(userId: string, data: CreateAccountData) {
    try {
      // Validate input
      if (!data.name?.trim()) {
        throw new Error("Il nome dell'account è obbligatorio");
      }
      if (!data.type?.trim()) {
        throw new Error("Il tipo di account è obbligatorio");
      }

      const accountData: Omit<Prisma.BankAccountCreateInput, "user"> = {
        name: data.name.trim(),
        type: data.type.toUpperCase() as AccountType,
        currency: data.currency || "EUR",
        balance: data.initialBalance || 0,
        accountNumber: data.accountNumber?.trim() || null,
      };

      return await createAccount(userId, accountData);
    } catch (error) {
      console.error("Errore nella creazione dell'account:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nella creazione dell'account");
    }
  }

  /**
   * Update account
   */
  static async updateAccount(accountId: string, data: UpdateAccountData) {
    try {
      // Validate input
      if (data.name !== undefined && !data.name.trim()) {
        throw new Error("Il nome dell'account non può essere vuoto");
      }

      const updateData: Prisma.BankAccountUpdateInput = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.type !== undefined)
        updateData.type = data.type.toUpperCase() as AccountType;
      if (data.balance !== undefined) updateData.balance = data.balance;
      if (data.accountNumber !== undefined) {
        updateData.accountNumber = data.accountNumber?.trim() || null;
      }

      return await updateAccount(accountId, updateData);
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'account:", error);
      throw error instanceof Error
        ? error
        : new Error("Errore nell'aggiornamento dell'account");
    }
  }

  /**
   * Delete account
   */
  static async deleteAccount(accountId: string) {
    try {
      return await deleteAccount(accountId);
    } catch (error) {
      console.error("Errore nella cancellazione dell'account:", error);
      throw new Error("Impossibile eliminare l'account");
    }
  }

  /**
   * Get total balance for user
   */
  static async getTotalBalance(userId: string): Promise<number> {
    try {
      return await getTotalBalanceByUserId(userId);
    } catch (error) {
      console.error("Errore nel calcolo del saldo totale:", error);
      throw new Error("Impossibile calcolare il saldo totale");
    }
  }
}

// Utility per gestire gli errori
export const handleAccountServiceError = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Account } from "@/types/app";

interface AccountsContextType {
  accounts: Account[];
  totalBalance: number;
  isLoading: boolean;
  showBalances: boolean;
  isAddAccountOpen: boolean;
  setShowBalances: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddAccountOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrimaryAccount: (accountId: number) => void;
  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (id: number, updates: Partial<Account>) => void;
  deleteAccount: (id: number) => void;
}

const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined,
);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  // Carica i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Qui potresti fare chiamate API
        const { accountsData } = await import("@/lib/accounts");
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error loading accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const setPrimaryAccount = (accountId: number) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => ({
        ...account,
        isPrimary: account.id === accountId,
      })),
    );
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  interface AddAccountFn {
    (account: Omit<Account, "id">): void;
  }

  interface UpdateAccountFn {
    (id: number, updates: Partial<Account>): void;
  }

  interface DeleteAccountFn {
    (id: number): void;
  }

  interface AccountsContextValue {
    accounts: Account[];
    totalBalance: number;
    isLoading: boolean;
    showBalances: boolean;
    isAddAccountOpen: boolean;
    setShowBalances: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAddAccountOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPrimaryAccount: (accountId: number) => void;
    addAccount: AddAccountFn;
    updateAccount: UpdateAccountFn;
    deleteAccount: DeleteAccountFn;
  }

  const value: AccountsContextValue = {
    accounts,
    totalBalance,
    isLoading,
    showBalances,
    isAddAccountOpen,
    setShowBalances,
    setIsAddAccountOpen,
    setPrimaryAccount,
    addAccount: (account: Omit<Account, "id">) => {
      const newAccount: Account = { ...account, id: Date.now() };
      setAccounts((prev: Account[]) => [...prev, newAccount]);
    },
    updateAccount: (id: number, updates: Partial<Account>) => {
      setAccounts((prev: Account[]) =>
        prev.map((acc: Account) =>
          acc.id === id ? { ...acc, ...updates } : acc,
        ),
      );
    },
    deleteAccount: (id: number) => {
      setAccounts((prev: Account[]) =>
        prev.filter((acc: Account) => acc.id !== id),
      );
    },
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
}

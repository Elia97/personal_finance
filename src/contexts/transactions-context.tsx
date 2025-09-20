"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Transaction, Account } from "@/types/app";

interface TransactionsContextType {
  transactions: Partial<Transaction>[];
  accounts: Partial<Account>[];
  isLoading: boolean;
  selectedAccount: string;
  searchTerm: string;
  filterType: string;
  totalIncome: number;
  totalExpenses: number;
  filteredTransactions: Partial<Transaction>[];
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAccount: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Partial<Transaction>[]>([]);
  const [accounts, setAccounts] = useState<Partial<Account>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // Carica i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { transactionsData, accountsData } = await import(
          "@/lib/transactions"
        );
        setAccounts(accountsData);
        const accountId = Number(
          selectedAccount,
        ) as keyof typeof transactionsData;
        setTransactions(transactionsData[accountId] || []);
      } catch (error) {
        console.error("Errore nel caricamento delle transazioni:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedAccount]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction?.description ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction?.category ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction?.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income" && typeof t.amount === "number")
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && typeof t.amount === "number")
    .reduce((sum, t) => sum + Math.abs(t.amount ?? 0), 0);

  interface AddTransactionFn {
    (transaction: Omit<Transaction, "id">): void;
  }

  interface UpdateTransactionFn {
    (id: number, updates: Partial<Transaction>): void;
  }

  interface DeleteTransactionFn {
    (id: number): void;
  }

  interface TransactionsContextValue {
    transactions: Partial<Transaction>[];
    accounts: Partial<Account>[];
    isLoading: boolean;
    isAddTransactionOpen: boolean;
    selectedAccount: string;
    searchTerm: string;
    filterType: string;
    totalIncome: number;
    totalExpenses: number;
    filteredTransactions: Partial<Transaction>[];
    setIsAddTransactionOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedAccount: React.Dispatch<React.SetStateAction<string>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setFilterType: React.Dispatch<React.SetStateAction<string>>;
    addTransaction: AddTransactionFn;
    updateTransaction: UpdateTransactionFn;
    deleteTransaction: DeleteTransactionFn;
  }

  const value: TransactionsContextValue = {
    transactions,
    accounts,
    isLoading,
    isAddTransactionOpen,
    selectedAccount,
    searchTerm,
    filterType,
    totalIncome,
    totalExpenses,
    filteredTransactions,
    setIsAddTransactionOpen,
    setSelectedAccount,
    setSearchTerm,
    setFilterType,
    addTransaction: (transaction: Omit<Transaction, "id">) => {
      const newTransaction = {
        ...transaction,
        id: Date.now(),
      };
      setTransactions((prev) => [...prev, newTransaction]);
    },
    updateTransaction: (id: number, updates: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    deleteTransaction: (id: number) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return context;
}

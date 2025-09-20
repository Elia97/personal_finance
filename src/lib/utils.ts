import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Building2,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  locale: string = "it-IT",
  currency: string = "EUR",
  useGrouping: boolean = true,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    useGrouping,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converte una data in formato stringa per input HTML date
 * Gestisce i casi di hydration mismatch restituendo stringa vuota lato server
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";

  // Lato server, restituisce stringa vuota per evitare hydration mismatch
  if (typeof window === "undefined") return "";

  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

/**
 * Formatta una data per la visualizzazione usando il locale dell'utente
 */
export function formatDateLocalized(
  date: string | Date | null | undefined,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {},
): string {
  if (!date) return "";

  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    }).format(dateObj);
  } catch {
    return "";
  }
}

export const getAccountIcon = (type: string) => {
  switch (type) {
    case "checking":
      return Wallet;
    case "savings":
      return PiggyBank;
    case "credit":
      return CreditCard;
    case "investment":
      return TrendingUp;
    case "business":
      return Building2;
    default:
      return Wallet;
  }
};

export const getAccountTypeLabel = (type: string) => {
  switch (type) {
    case "checking":
      return "Conto Corrente";
    case "savings":
      return "Conto Risparmio";
    case "credit":
      return "Carta di Credito";
    case "investment":
      return "Investimenti";
    case "business":
      return "Business";
    default:
      return "Altro";
  }
};

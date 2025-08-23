import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  locale: string = "it-IT",
  currency: string = "EUR",
  useGrouping: boolean = true
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    useGrouping,
    minimumFractionDigits: 2,
  }).format(amount);
}

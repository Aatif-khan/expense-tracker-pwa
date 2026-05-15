import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CurrencyCode } from "@/lib/settingsStore";
import { formatCurrencyWithCode } from "@/lib/currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Legacy helper — used by components that already have the currency code.
 * Prefer `formatCurrencyWithCode` when you control the call site.
 */
export function formatCurrency(amount: number, currency: CurrencyCode = "INR") {
  return formatCurrencyWithCode(amount, currency);
}

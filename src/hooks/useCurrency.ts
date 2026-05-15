"use client";

import { useSettingsStore } from "@/lib/settingsStore";
import { formatCurrencyWithCode } from "@/lib/currency";

/** Returns a formatCurrency function bound to the user's preferred currency. */
export function useCurrency() {
  const currency = useSettingsStore((s) => s.currency);
  return {
    currency,
    format: (amount: number) => formatCurrencyWithCode(amount, currency),
  };
}

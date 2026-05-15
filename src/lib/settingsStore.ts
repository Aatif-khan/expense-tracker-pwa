import { create } from "zustand";
import { db } from "@/lib/db";
import { ThemeMode, CurrencyCode, AppPreferences, DEFAULT_PREFERENCES } from "./types";

export interface SettingsState {
  // Theme
  theme: ThemeMode;
  // Currency
  currency: CurrencyCode;
  // Initial Balances
  initialCashBalance: number;
  initialBankBalance: number;
  // App Preferences
  preferences: AppPreferences;
  // Hydration flag
  hydrated: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => Promise<void>;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  setInitialCashBalance: (amount: number) => Promise<void>;
  setInitialBankBalance: (amount: number) => Promise<void>;
  setPreference: <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => Promise<void>;
  hydrate: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

async function persist(key: string, value: unknown) {
  await db.settings.put({ key, value: JSON.stringify(value) });
}

async function load<T>(key: string, fallback: T): Promise<T> {
  const record = await db.settings.get(key);
  if (!record) return fallback;
  try {
    return JSON.parse(record.value) as T;
  } catch {
    return fallback;
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  theme: "system",
  currency: "INR",
  initialCashBalance: 0,
  initialBankBalance: 0,
  preferences: DEFAULT_PREFERENCES,
  hydrated: false,

  hydrate: async () => {
    const [theme, currency, initialCashBalance, initialBankBalance, preferences] =
      await Promise.all([
        load<ThemeMode>("theme", "system"),
        load<CurrencyCode>("currency", "INR"),
        load<number>("initialCashBalance", 0),
        load<number>("initialBankBalance", 0),
        load<AppPreferences>("preferences", DEFAULT_PREFERENCES),
      ]);
    set({ theme, currency, initialCashBalance, initialBankBalance, preferences, hydrated: true });
  },

  setTheme: async (theme) => {
    set({ theme });
    await persist("theme", theme);
  },

  setCurrency: async (currency) => {
    set({ currency });
    await persist("currency", currency);
  },

  setInitialCashBalance: async (amount) => {
    set({ initialCashBalance: amount });
    await persist("initialCashBalance", amount);
  },

  setInitialBankBalance: async (amount) => {
    set({ initialBankBalance: amount });
    await persist("initialBankBalance", amount);
  },

  setPreference: async (key, value) => {
    const current = get().preferences;
    const next = { ...current, [key]: value };
    set({ preferences: next });
    await persist("preferences", next);
  },

  resetSettings: async () => {
    await db.settings.clear();
    set({
      theme: "system",
      currency: "INR",
      initialCashBalance: 0,
      initialBankBalance: 0,
      preferences: DEFAULT_PREFERENCES,
    });
  },
}));

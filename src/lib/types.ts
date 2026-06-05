export type ThemeMode = "light" | "dark" | "system";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export interface AppPreferences {
  animationsEnabled: boolean;
  compactMode: boolean;
  insightsEnabled: boolean;
  notificationsEnabled: boolean;
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  animationsEnabled: true,
  compactMode: false,
  insightsEnabled: true,
  notificationsEnabled: true,
  hasCompletedOnboarding: false,
};

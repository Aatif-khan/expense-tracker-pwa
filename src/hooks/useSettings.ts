"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/lib/settingsStore";

/**
 * Hydrates settings from IndexedDB on mount and keeps next-themes
 * in sync with the persisted theme preference.
 */
export function useSettings() {
  const store = useSettingsStore();
  const { setTheme: setNextTheme } = useTheme();

  // Hydrate from DB once
  useEffect(() => {
    if (!store.hydrated) {
      store.hydrate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme → next-themes whenever it changes
  useEffect(() => {
    if (store.hydrated) {
      setNextTheme(store.theme);
    }
  }, [store.theme, store.hydrated, setNextTheme]);

  const handleSetTheme = async (theme: typeof store.theme) => {
    await store.setTheme(theme);
    setNextTheme(theme);
  };

  return {
    ...store,
    setTheme: handleSetTheme,
  };
}

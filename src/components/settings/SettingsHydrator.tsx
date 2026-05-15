"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/settingsStore";

/**
 * Mounts once at the root layout to hydrate settings from IndexedDB.
 * Applies global preference classes (compact mode, animations) to the document root.
 */
export function SettingsHydrator() {
  const { hydrated, hydrate, preferences } = useSettingsStore();

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;

    // Apply Compact Mode
    if (preferences.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Apply Animations Preference
    if (!preferences.animationsEnabled) {
      root.classList.add("no-animations");
    } else {
      root.classList.remove("no-animations");
    }
  }, [hydrated, preferences.compactMode, preferences.animationsEnabled]);

  return null;
}

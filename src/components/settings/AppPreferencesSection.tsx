"use client";

import { SettingsSection, SettingsRow } from "./SettingsSection";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppPreferences } from "@/lib/settingsStore";
import type { ToastMessage } from "@/app/settings/page";
import type { useSettings } from "@/hooks/useSettings";

interface AppPreferencesSectionProps {
  settings: ReturnType<typeof useSettings>;
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function AppPreferencesSection({ settings, showToast }: AppPreferencesSectionProps) {
  const handleToggle = async <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    await settings.setPreference(key, value);
    const label = key === "animationsEnabled" ? "Animations"
      : key === "compactMode" ? "Compact mode"
      : "Insights";
    showToast(`${label} ${value ? "enabled" : "disabled"}`, "info");
  };

  return (
    <SettingsSection
      title="App Preferences"
      description="Personalise your experience"
      icon={<SlidersHorizontal className="h-4 w-4" />}
    >
      <SettingsRow label="Animations" hint="Smooth transitions and micro-animations">
        <Toggle
          id="pref-animations"
          checked={settings.preferences.animationsEnabled}
          onChange={(v) => handleToggle("animationsEnabled", v)}
        />
      </SettingsRow>
      <SettingsRow label="Compact Mode" hint="Reduce spacing for more content">
        <Toggle
          id="pref-compact"
          checked={settings.preferences.compactMode}
          onChange={(v) => handleToggle("compactMode", v)}
        />
      </SettingsRow>
      <SettingsRow label="Smart Insights" hint="Show spending insights on the dashboard">
        <Toggle
          id="pref-insights"
          checked={settings.preferences.insightsEnabled}
          onChange={(v) => handleToggle("insightsEnabled", v)}
        />
      </SettingsRow>
    </SettingsSection>
  );
}

"use client";

import { SettingsSection, SettingsRow } from "./SettingsSection";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeMode } from "@/lib/types";
import type { ToastMessage } from "@/app/settings/page";
import type { useSettings } from "@/hooks/useSettings";

interface ThemeSectionProps {
  settings: ReturnType<typeof useSettings>;
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

const THEMES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSection({ settings, showToast }: ThemeSectionProps) {
  const handleTheme = async (theme: ThemeMode) => {
    await settings.setTheme(theme);
    showToast(`Theme set to ${theme}`, "success");
  };

  return (
    <SettingsSection
      title="Appearance"
      description="Choose your preferred look"
      icon={<Palette className="h-4 w-4" />}
    >
      <SettingsRow label="Theme" hint="Applies immediately without flicker">
        <div className="flex gap-1.5">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              id={`theme-${value}`}
              onClick={() => handleTheme(value)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200",
                settings.theme === value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                  : "bg-muted/50 border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </SettingsRow>
    </SettingsSection>
  );
}

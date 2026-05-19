"use client";

import { SettingsSection, SettingsRow } from "./SettingsSection";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/lib/currency";
import { CurrencyCode } from "@/lib/types";
import type { ToastMessage } from "@/app/settings/page";
import type { useSettings } from "@/hooks/useSettings";

interface CurrencySectionProps {
  settings: ReturnType<typeof useSettings>;
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

export function CurrencySection({ settings, showToast }: CurrencySectionProps) {
  const handleCurrency = async (code: CurrencyCode) => {
    await settings.setCurrency(code);
    const info = CURRENCIES.find((c) => c.code === code);
    showToast(`Currency set to ${info?.label ?? code}`, "success");
  };

  return (
    <SettingsSection
      title="Currency"
      description="Used for all monetary values across the app"
      icon={<Coins className="h-4 w-4" />}
    >
      {CURRENCIES.map((c) => (
        <SettingsRow key={c.code} label={c.label} hint={`Format: ${c.symbol}1,000.00`}>
          <button
            id={`currency-${c.code}`}
            onClick={() => handleCurrency(c.code)}
            className={cn(
              "h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-200",
              settings.currency === c.code
                ? "border-primary bg-primary text-primary-foreground scale-110 shadow-sm"
                : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
            )}
          >
            {c.symbol}
          </button>
        </SettingsRow>
      ))}
    </SettingsSection>
  );
}

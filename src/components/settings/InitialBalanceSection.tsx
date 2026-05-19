"use client";

import { useState } from "react";
import { SettingsSection, SettingsRow } from "./SettingsSection";
import { Landmark, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastMessage } from "@/app/settings/page";
import type { useSettings } from "@/hooks/useSettings";

interface InitialBalanceSectionProps {
  settings: ReturnType<typeof useSettings>;
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

function BalanceInput({
  id,
  label,
  hint,
  value,
  onSave,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onSave: (v: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Sync when external value changes (e.g. after reset)
  // This follows the recommended pattern for syncing props to state
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(String(value));
  }

  const handleSave = async () => {
    // If the value hasn't changed, don't trigger save
    if (parseFloat(draft) === value) return;

    const parsed = parseFloat(draft);
    if (isNaN(parsed) || parsed < 0) {
      setError("Enter a valid non-negative number");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(parsed);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      setError("Failed to save");
      setSaving(false);
    }
  };

  return (
    <SettingsRow label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id={id}
            type="number"
            min={0}
            step="0.01"
            value={draft}
            onChange={(e) => { 
              setDraft(e.target.value); 
              setError(""); 
              setSaved(false); 
            }}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className={cn(
              "w-28 h-9 rounded-lg border px-3 text-sm bg-background text-right font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
              error ? "border-red-500" : "border-border"
            )}
            aria-label={label}
          />
        </div>
        <div className="h-8 w-8 flex items-center justify-center">
          {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {saved && !saving && <Check className="h-4 w-4 text-emerald-500" />}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 text-right">{error}</p>}
    </SettingsRow>
  );
}

export function InitialBalanceSection({ settings, showToast }: InitialBalanceSectionProps) {
  return (
    <SettingsSection
      title="Initial Balances"
      description="Starting balance added to dashboard totals"
      icon={<Landmark className="h-4 w-4" />}
    >
      <BalanceInput
        id="initial-cash-balance"
        label="Cash Balance"
        hint="Opening cash on hand"
        value={settings.initialCashBalance}
        onSave={async (v) => {
          await settings.setInitialCashBalance(v);
          showToast("Cash balance updated", "success");
        }}
      />
      <BalanceInput
        id="initial-bank-balance"
        label="Bank Balance"
        hint="Opening bank account balance"
        value={settings.initialBankBalance}
        onSave={async (v) => {
          await settings.setInitialBankBalance(v);
          showToast("Bank balance updated", "success");
        }}
      />
    </SettingsSection>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { ThemeSection } from "@/components/settings/ThemeSection";
import { CurrencySection } from "@/components/settings/CurrencySection";
import { InitialBalanceSection } from "@/components/settings/InitialBalanceSection";
import { AppPreferencesSection } from "@/components/settings/AppPreferencesSection";
import { BackupSection } from "@/components/settings/BackupSection";
import { PWASection } from "@/components/settings/PWASection";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { Toast } from "@/components/settings/Toast";
import { Settings } from "lucide-react";

export type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

export default function SettingsPage() {
  const settings = useSettings();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);

  const showToast = (message: string, type: ToastMessage["type"] = "success") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  if (!settings.hydrated) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto animate-pulse">
        <div className="h-8 w-40 bg-muted rounded mb-8" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 w-full bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 pt-0 max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center justify-between py-4 mb-4 -mx-4 px-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your preferences</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
          <Settings className="text-primary h-5 w-5" />
        </div>
      </header>

      <div className="space-y-5">
        <ThemeSection settings={settings} showToast={showToast} />
        <CurrencySection settings={settings} showToast={showToast} />
        <InitialBalanceSection settings={settings} showToast={showToast} />
        <AppPreferencesSection settings={settings} showToast={showToast} />
        <BackupSection showToast={showToast} />
        <PWASection />
        <DangerZoneSection settings={settings} showToast={showToast} />
      </div>

      {/* Toast Stack */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
}

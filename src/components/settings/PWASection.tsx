"use client";

import { useEffect, useState } from "react";
import { SettingsSection, SettingsRow } from "./SettingsSection";
import { Smartphone, Wifi, WifiOff, Tag, CheckCircle2, ChevronRight } from "lucide-react";
import { usePwaStore } from "@/lib/pwaStore";

const APP_VERSION = "1.0.0";

export function PWASection() {
  const [isOnline, setIsOnline] = useState(true);
  const { isStandalone, setIsOpen } = usePwaStore();

  useEffect(() => {
    // Sync initial state once on mount to avoid hydration warnings
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine);

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const triggerInstallModal = () => {
    setIsOpen(true);
  };

  return (
    <SettingsSection
      title="PWA & Offline"
      description="App installation and connectivity"
      icon={<Smartphone className="h-4 w-4" />}
    >
      <SettingsRow label="App Version" hint="Current build version">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          <span className="font-mono font-medium">v{APP_VERSION}</span>
        </div>
      </SettingsRow>

      <SettingsRow label="Offline Support" hint="All data stored locally — works without internet">
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isOnline ? "text-emerald-600" : "text-amber-600"}`}>
          {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </SettingsRow>

      {isStandalone ? (
        /* If already installed as a standalone PWA, show success update message */
        <div className="px-4 py-3 border-t border-border/40 bg-emerald-500/5 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
              Installed & Up to Date
            </p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-500/90 leading-normal">
              You are currently running the standalone app on your device. Offline data synchronisation and local storage are fully active.
            </p>
          </div>
        </div>
      ) : (
        /* If not installed, show the install trigger button */
        <SettingsRow label="Install App" hint="Add to your home screen for a premium offline experience">
          <button
            id="btn-install-pwa"
            onClick={triggerInstallModal}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            Install
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </SettingsRow>
      )}
    </SettingsSection>
  );
}

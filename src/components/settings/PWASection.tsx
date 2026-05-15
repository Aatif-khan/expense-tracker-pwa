"use client";

import { useEffect, useState } from "react";
import { SettingsSection, SettingsRow } from "./SettingsSection";
import { Smartphone, Wifi, WifiOff, Tag } from "lucide-react";

const APP_VERSION = "1.0.0";

export function PWASection() {
  const [isOnline, setIsOnline] = useState(true);
  const [installable, setInstallable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setInstallable(true); };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallable(false);
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

      {installable && (
        <SettingsRow label="Install App" hint="Add to your home screen for the best experience">
          <button
            id="btn-install-pwa"
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
        </SettingsRow>
      )}

      {!installable && (
        <div className="px-4 py-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            💡 To install: use your browser&apos;s &ldquo;Add to Home Screen&rdquo; or &ldquo;Install App&rdquo; option in the address bar menu.
          </p>
        </div>
      )}
    </SettingsSection>
  );
}

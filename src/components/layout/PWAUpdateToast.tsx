"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAUpdateToast() {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleControllerChange = () => {
      // Refresh the page once the new service worker takes over
      window.location.reload();
    };

    // 1. Hook into service worker lifecycle
    navigator.serviceWorker.ready.then((registration) => {
      // Check if there is already a service worker waiting to activate
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShow(true);
      }

      // Listen for updates (when a new service worker starts installing)
      const onUpdateFound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          // Once the installing worker is fully installed and active in the background
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // This is an update to an existing installation
              setWaitingWorker(registration.waiting || installingWorker);
              setShow(true);
            }
          }
        });
      };

      registration.addEventListener("updatefound", onUpdateFound);
    });

    // 2. Listen for controller changes to trigger immediate reload
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Send message to waiting service worker to skip waiting and activate
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[360px] z-50 bg-background/95 backdrop-blur-md border border-border/80 shadow-2xl p-4 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h4 className="text-sm font-semibold text-foreground leading-snug">
            Update Available
          </h4>
          <p className="text-xs text-muted-foreground leading-normal">
            A new version of Expenses is ready. Reload to apply the updates.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground p-0.5 rounded-lg hover:bg-muted transition-colors shrink-0"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleUpdate}
          size="sm"
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-600/90 text-white font-semibold text-xs py-2 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload & Update
        </Button>
      </div>
    </div>
  );
}

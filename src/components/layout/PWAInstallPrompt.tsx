"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePwaStore } from "@/lib/pwaStore";
import { Download, Sparkles, Info } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const { 
    isOpen, 
    setIsOpen, 
    deferredPrompt, 
    setDeferredPrompt, 
    isIOS: isIOSDevice, 
    setIsIOS: setIsIOSDevice, 
    setIsStandalone 
  } = usePwaStore();

  useEffect(() => {
    // 1. Detect if the app is already running in standalone mode (already installed)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandalone);

    if (isStandalone) {
      return; // Already installed, do not show prompt
    }

    // 2. Check if the prompt has already been dismissed
    const isDismissed = localStorage.getItem("pwa-install-prompt-dismissed");
    if (isDismissed) {
      return; // Already dismissed, do not show prompt
    }

    // 3. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    if (isIos) {
      // For iOS devices, since beforeinstallprompt is not supported, we show the instructions
      // Wait a short delay after mount before showing
      const timer = setTimeout(() => {
        setIsIOSDevice(true);
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    // 4. Listen for browser installation prompt (Android, Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [setIsStandalone, setIsIOSDevice, setDeferredPrompt, setIsOpen]);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    
    // Show the browser prompt synchronously (prevents Chrome browser blocking from microtask lag)
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: "accepted" | "dismissed" }) => {
      if (choiceResult.outcome === "accepted") {
        // Remember user choice
        localStorage.setItem("pwa-install-prompt-dismissed", "true");
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    }).catch((err: unknown) => {
      console.error("PWA install choice error:", err);
    });
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-prompt-dismissed", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // If they close via backdrop or X, we dismiss and save preference so it only shows once
        handleDismiss();
      }
    }}>
      <DialogContent className="max-w-[360px] p-6 rounded-2xl border bg-background/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          {/* App Icon Circle */}
          <div className="relative flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl shadow-inner border border-primary/20">
            <span className="text-3xl" role="img" aria-label="Wallet icon">💵</span>
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border border-background">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Install Expenses App
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm px-1">
              Add Expenses to your Home Screen for faster access, offline personal finance tracking, and a native experience!
            </DialogDescription>
          </div>
        </DialogHeader>

        {isIOSDevice ? (
          /* iOS-specific installation guide */
          <div className="my-4 py-3.5 px-4 bg-muted/50 border rounded-xl space-y-3.5 text-xs text-foreground/90 font-medium">
            <p className="font-semibold text-center text-primary flex items-center justify-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> iPhone/iPad Installation Guide
            </p>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li className="leading-relaxed">
                Tap the 
                <span className="inline-flex items-center justify-center bg-background p-1.5 rounded-md border text-foreground align-middle mx-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span> 
                **Share** button in the Safari toolbar.
              </li>
              <li className="leading-relaxed">
                Scroll down the list and tap 
                <span className="inline-flex items-center justify-center bg-background p-1.5 rounded-md border text-foreground align-middle mx-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </span> 
                **Add to Home Screen**.
              </li>
              <li className="leading-relaxed">
                Tap **Add** in the top-right corner.
              </li>
            </ol>
          </div>
        ) : !deferredPrompt ? (
          /* Android / Desktop Chrome manual installation guide */
          <div className="my-4 py-3.5 px-4 bg-muted/50 border rounded-xl space-y-3.5 text-xs text-foreground/90 font-medium">
            <p className="font-semibold text-center text-primary flex items-center justify-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> Browser Installation Guide
            </p>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li className="leading-relaxed">
                Tap the **Menu** button (usually three dots <span className="font-bold">⋮</span> in the corner of your browser).
              </li>
              <li className="leading-relaxed">
                Select **Install app** or **Add to Home Screen**.
              </li>
              <li className="leading-relaxed">
                Confirm by tapping **Install** or **Add**.
              </li>
            </ol>
          </div>
        ) : (
          /* Standard features highlight */
          <div className="my-4 py-3 px-4 bg-muted/40 border border-border/60 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-emerald-500 font-semibold">✓</span>
              <span>Works offline (no network required)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-emerald-500 font-semibold">✓</span>
              <span>Fast launch from Home Screen (no tabs)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-emerald-500 font-semibold">✓</span>
              <span>Secure, localized data storage</span>
            </div>
          </div>
        )}

        <DialogFooter className="-mx-6 -mb-6 mt-6 p-6 rounded-b-2xl flex flex-col-reverse gap-2 sm:flex-col-reverse sm:justify-start">
          {isIOSDevice || !deferredPrompt ? (
            <button 
              onClick={handleDismiss}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full rounded-full py-2.5 shadow-lg shadow-primary/20 font-semibold text-center justify-center"
              )}
            >
              Got It
            </button>
          ) : (
            <>
              <button 
                onClick={handleInstallClick}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full rounded-full py-2.5 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-semibold"
                )}
              >
                <Download className="w-4 h-4" /> Install Now
              </button>
              <button 
                onClick={handleDismiss}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full rounded-full py-2.5 text-muted-foreground hover:text-foreground font-medium justify-center"
                )}
              >
                Maybe Later
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

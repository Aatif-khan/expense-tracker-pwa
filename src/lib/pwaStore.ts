import { create } from "zustand";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  isIOS: boolean;
  isOpen: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsStandalone: (standalone: boolean) => void;
  setIsIOS: (isIOS: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  deferredPrompt: null,
  isStandalone: false,
  isIOS: false,
  isOpen: false,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsStandalone: (standalone) => set({ isStandalone: standalone }),
  setIsIOS: (isIOS) => set({ isIOS }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

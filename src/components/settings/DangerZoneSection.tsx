"use client";

import { useState } from "react";
import { SettingsSection } from "./SettingsSection";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { resetAllData } from "@/lib/backup";
import { cn } from "@/lib/utils";
import type { ToastMessage } from "@/app/settings/page";
import type { useSettings } from "@/hooks/useSettings";

interface DangerZoneSectionProps {
  settings: ReturnType<typeof useSettings>;
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

function ConfirmResetModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-sm bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          {/* Icon */}
          <div className="h-14 w-14 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-lg font-bold text-center mb-1">Reset All Data?</h3>
          <p className="text-sm text-muted-foreground text-center mb-5">
            This will permanently delete{" "}
            <strong className="text-foreground">all transactions</strong>,{" "}
            <strong className="text-foreground">settings</strong>, and{" "}
            <strong className="text-foreground">reports</strong>. This action{" "}
            <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>

          <ul className="text-xs text-muted-foreground space-y-1 mb-6 bg-muted/40 rounded-xl p-3">
            <li className="flex items-center gap-2"><span className="text-red-500">✕</span> All transaction history</li>
            <li className="flex items-center gap-2"><span className="text-red-500">✕</span> Currency &amp; theme preferences</li>
            <li className="flex items-center gap-2"><span className="text-red-500">✕</span> Initial balances</li>
            <li className="flex items-center gap-2"><span className="text-red-500">✕</span> App preferences</li>
          </ul>

          <div className="flex gap-3">
            <button
              id="btn-cancel-reset"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-reset"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Resetting…</>
              ) : (
                <><Trash2 className="h-4 w-4" /> Reset All</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DangerZoneSection({ settings, showToast }: DangerZoneSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetAllData();
      await settings.resetSettings();
      setModalOpen(false);
      showToast("All data has been reset.", "info");
      // Brief delay then reload to flush Zustand and Dexie live-queries
      setTimeout(() => window.location.reload(), 800);
    } catch {
      showToast("Reset failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions — proceed with caution"
        icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        className="border-red-200/60 dark:border-red-900/40"
      >
        <div className="px-4 py-4 flex items-center justify-between gap-4 border-b border-border/40">
          <div>
            <p className="text-sm font-medium text-foreground">Generate Demo Data</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Wipes current data and populates app for screenshots
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                const { generateDemoData } = await import("@/lib/demoData");
                await generateDemoData();
                showToast("Demo data generated!", "success");
                setTimeout(() => window.location.reload(), 1000);
              } catch {
                showToast("Failed to generate demo data", "error");
              }
            }}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
              "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400",
              "hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-colors",
              "border border-indigo-200/60 dark:border-indigo-800/40"
            )}
          >
            Generate
          </button>
        </div>

        <div className="px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Reset All Data</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete transactions, settings &amp; reports
            </p>
          </div>
          <button
            id="btn-reset-data"
            onClick={() => setModalOpen(true)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
              "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
              "hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors",
              "border border-red-200/60 dark:border-red-800/40"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </SettingsSection>

      <ConfirmResetModal
        open={modalOpen}
        onClose={() => !loading && setModalOpen(false)}
        onConfirm={handleReset}
        loading={loading}
      />
    </>
  );
}

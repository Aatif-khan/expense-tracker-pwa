"use client";

import { useRef, useState } from "react";
import { SettingsSection, SettingsRow } from "./SettingsSection";
import { DatabaseBackup, Upload, Download, Loader2 } from "lucide-react";
import { exportBackup, importBackup } from "@/lib/backup";
import type { ToastMessage } from "@/app/settings/page";

interface BackupSectionProps {
  showToast: (msg: string, type?: ToastMessage["type"]) => void;
}

export function BackupSection({ showToast }: BackupSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportBackup();
      showToast("Backup exported successfully!", "success");
    } catch {
      showToast("Failed to export backup.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    setImporting(true);
    try {
      await importBackup(file);
      showToast("Backup restored successfully! Refreshing…", "success");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Import failed.", "error");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <SettingsSection
      title="Backup & Restore"
      description="Export or import all your app data"
      icon={<DatabaseBackup className="h-4 w-4" />}
    >
      <SettingsRow label="Export Data" hint="Download a full JSON backup of all data">
        <button
          id="btn-export-backup"
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-60"
        >
          {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          Export
        </button>
      </SettingsRow>

      <SettingsRow label="Import Data" hint="Restore from a previous backup file">
        <button
          id="btn-import-backup"
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/70 text-foreground text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-60"
        >
          {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
        />
      </SettingsRow>

      <div className="px-4 py-2.5 bg-amber-50/60 dark:bg-amber-950/20 border-t border-border/40">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          ⚠️ Importing a backup will <strong>replace</strong> all existing data. This action cannot be undone.
        </p>
      </div>
    </SettingsSection>
  );
}

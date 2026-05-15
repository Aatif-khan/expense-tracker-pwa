import { db, Transaction, SettingRecord } from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppBackup {
  version: number;
  exportedAt: string;
  transactions: Transaction[];
  settings: SettingRecord[];
}

const BACKUP_VERSION = 1;

// ─── Export ───────────────────────────────────────────────────────────────────

export async function exportBackup(): Promise<void> {
  const [transactions, settings] = await Promise.all([
    db.transactions.toArray(),
    db.settings.toArray(),
  ]);

  const backup: AppBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    transactions,
    settings,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `expense-tracker-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Validate ─────────────────────────────────────────────────────────────────

export function validateBackup(data: unknown): data is AppBackup {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== "number") return false;
  if (typeof obj.exportedAt !== "string") return false;
  if (!Array.isArray(obj.transactions)) return false;
  if (!Array.isArray(obj.settings)) return false;
  return true;
}

// ─── Import (replace strategy) ────────────────────────────────────────────────

export async function importBackup(file: File): Promise<void> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON file. Please select a valid backup file.");
  }

  if (!validateBackup(parsed)) {
    throw new Error(
      "Invalid backup structure. Please select a file exported by this app."
    );
  }

  // Clear existing data and replace
  await db.transaction("rw", db.transactions, db.settings, async () => {
    await db.transactions.clear();
    await db.settings.clear();

    // Re-insert without IDs to let Dexie auto-increment
    const txs = parsed.transactions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id: _id, ...rest }) => ({
        ...rest,
        transactionDate: new Date(rest.transactionDate),
        createdAt: new Date(rest.createdAt),
        updatedAt: new Date(rest.updatedAt),
      })
    );

    await db.transactions.bulkAdd(txs as Transaction[]);
    await db.settings.bulkPut(parsed.settings);
  });
}

// ─── Full Reset ───────────────────────────────────────────────────────────────

export async function resetAllData(): Promise<void> {
  await db.transaction("rw", db.transactions, db.settings, async () => {
    await db.transactions.clear();
    await db.settings.clear();
  });
}

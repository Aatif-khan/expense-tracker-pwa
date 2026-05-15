import Dexie, { Table } from "dexie";

export interface Transaction {
  id?: number;
  amount: number;
  category: string;
  description: string;
  transactionType: "INCOME" | "EXPENSE";
  accountType: "CASH" | "BANK";
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingRecord {
  key: string;
  value: string; // JSON-serialised
}

export class ExpenseTrackerDB extends Dexie {
  transactions!: Table<Transaction, number>;
  settings!: Table<SettingRecord, string>;

  constructor() {
    super("ExpenseTrackerDB");
    this.version(2).stores({
      transactions:
        "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
    });
    this.version(3)
      .stores({
        transactions:
          "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
        settings: "key",
      })
      .upgrade(() => {
        // no-op migration — new table added
      });
  }
}

export const db = new ExpenseTrackerDB();

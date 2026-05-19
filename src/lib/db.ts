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

export interface Budget {
  id?: number;
  category: string;
  monthlyLimit: number;
  month: number; // 0-11
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseTrackerDB extends Dexie {
  transactions!: Table<Transaction, number>;
  settings!: Table<SettingRecord, string>;
  budgets!: Table<Budget, number>;

  constructor() {
    super("ExpenseTrackerDB");
    
    this.version(2).stores({
      transactions: "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
    });

    this.version(3).stores({
      transactions: "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
      settings: "key",
    });

    this.version(4).stores({
      transactions: "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
      settings: "key",
      budgets: "++id, category, [month+year]",
    }).upgrade(() => {
      // Version 4 adds budgets table
    });
  }
}

export const db = new ExpenseTrackerDB();

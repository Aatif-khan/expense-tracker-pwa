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

  // Recurring properties
  isRecurring?: boolean;
  recurringType?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  recurringStartDate?: Date;
  recurringEndDate?: Date;
  nextOccurrenceDate?: Date;
  lastGeneratedDate?: Date;
  
  // For generated transactions to link back to their parent rule
  recurringParentId?: number;
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
    });

    this.version(5).stores({
      transactions: "++id, amount, category, transactionType, accountType, transactionDate, createdAt, isRecurring, recurringParentId",
      settings: "key",
      budgets: "++id, category, [month+year]",
    }).upgrade(() => {
      // Version 5 adds recurring fields
    });
  }
}

export const db = new ExpenseTrackerDB();

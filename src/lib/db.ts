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

export class ExpenseTrackerDB extends Dexie {
  transactions!: Table<Transaction, number>;

  constructor() {
    super("ExpenseTrackerDB");
    this.version(2).stores({
      transactions: "++id, amount, category, transactionType, accountType, transactionDate, createdAt",
    });
  }
}

export const db = new ExpenseTrackerDB();

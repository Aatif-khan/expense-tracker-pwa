import Dexie, { Table } from "dexie";

export interface Transaction {
  id?: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  note?: string;
}

export class ExpenseTrackerDB extends Dexie {
  transactions!: Table<Transaction, number>;

  constructor() {
    super("ExpenseTrackerDB");
    this.version(1).stores({
      transactions: "++id, amount, type, category, date",
    });
  }
}

export const db = new ExpenseTrackerDB();

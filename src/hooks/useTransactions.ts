import { useLiveQuery } from "dexie-react-hooks";
import { db, Transaction } from "@/lib/db";
import { TransactionFormValues } from "@/lib/constants";

export function useTransactions() {
  const transactions = useLiveQuery(
    () => db.transactions.orderBy("transactionDate").reverse().toArray(),
    []
  );

  const addTransaction = async (data: TransactionFormValues) => {
    let nextOccurrenceDate: Date | undefined = undefined;
    if (data.isRecurring && data.recurringType) {
      const { calculateNextOccurrence } = await import("@/lib/recurrence");
      nextOccurrenceDate = calculateNextOccurrence(data.transactionDate, data.recurringType);
    }

    const transaction: Transaction = {
      amount: data.amount,
      category: data.category,
      description: data.description || "",
      transactionType: data.transactionType,
      accountType: data.accountType,
      transactionDate: data.transactionDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.isRecurring && {
        isRecurring: true,
        recurringType: data.recurringType,
        recurringStartDate: data.transactionDate,
        recurringEndDate: data.recurringEndDate,
        nextOccurrenceDate,
      })
    };
    return await db.transactions.add(transaction);
  };

  const updateTransaction = async (id: number, data: TransactionFormValues) => {
    return await db.transactions.update(id, {
      ...data,
      description: data.description || "",
      updatedAt: new Date(),
    });
  };

  const deleteTransaction = async (id: number) => {
    return await db.transactions.delete(id);
  };

  const getTransaction = async (id: number) => {
    return await db.transactions.get(id);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    isLoading: transactions === undefined,
  };
}

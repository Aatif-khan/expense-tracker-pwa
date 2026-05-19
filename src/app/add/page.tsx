"use client";

import { useRouter } from "next/navigation";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFormValues } from "@/lib/constants";

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const handleSubmit = async (data: TransactionFormValues) => {
    await addTransaction(data);
    if (data.isRecurring) {
      router.push("/recurring");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-bold">Add Transaction</h1>
        <p className="text-muted-foreground text-sm">Enter the details below</p>
      </header>

      <TransactionForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}

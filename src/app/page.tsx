"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Wallet } from "lucide-react";

export default function Home() {
  const { transactions } = useTransactions();

  const totalIncome = transactions?.filter(t => t.transactionType === "INCOME").reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.transactionType === "EXPENSE").reduce((acc, t) => acc + t.amount, 0) || 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold">Hello!</h1>
          <p className="text-muted-foreground text-sm">Welcome back to your tracker</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Wallet className="text-primary h-5 w-5" />
        </div>
      </header>

      <Card className="bg-slate-900 text-white dark:bg-slate-800 border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">${balance.toFixed(2)}</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowDownIcon className="h-3 w-3" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Income</div>
                <div className="text-sm font-semibold">${totalIncome.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowUpIcon className="h-3 w-3" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Expense</div>
                <div className="text-sm font-semibold">${totalExpense.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>
        
        <TransactionList />
      </div>
    </div>
  );
}

"use client";

import { TransactionList } from "@/components/transactions/TransactionList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center gap-3 py-4 mb-2 -mx-4 px-4 border-b border-border/40">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">All Transactions</h1>
        </div>
      </header>

      <TransactionList />
    </div>
  );
}

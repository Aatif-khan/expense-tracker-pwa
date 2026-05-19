"use client";

import { format } from "date-fns";
import { Transaction } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, CreditCard, Wallet } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const { format: formatCurrency } = useCurrency();
  const isIncome = transaction.transactionType === "INCOME";

  return (
    <Card 
      className="mb-3 cursor-pointer hover:bg-muted/50 transition-colors border-none shadow-sm"
      onClick={() => onClick?.(transaction)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-full flex items-center justify-center",
            isIncome ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20" : "bg-red-100 text-red-600 dark:bg-red-500/20"
          )}>
            {isIncome ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />}
          </div>
          <div>
            <h4 className="font-semibold">{transaction.category}</h4>
            <div className="flex items-center text-xs text-muted-foreground gap-2 mt-1">
              <span>{format(transaction.transactionDate, "MMM d, yyyy")}</span>
              <span className="flex items-center gap-1">
                {transaction.accountType === "BANK" ? <CreditCard size={12} /> : <Wallet size={12} />}
                {transaction.accountType}
              </span>
            </div>
            {transaction.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px] sm:max-w-[200px]">
                {transaction.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className={cn(
            "font-bold",
            isIncome ? "text-emerald-500" : "text-foreground"
          )}>
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

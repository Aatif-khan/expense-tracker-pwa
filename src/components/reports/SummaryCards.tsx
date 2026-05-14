"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReportSummary } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, PiggyBank, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps { summary: ReportSummary }

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: "Income",       value: summary.totalIncome,       icon: ArrowUpIcon,   color: "emerald", prefix: "+" },
    { label: "Expenses",     value: summary.totalExpenses,     icon: ArrowDownIcon, color: "red",     prefix: "-" },
    { label: "Net Savings",  value: summary.netSavings,        icon: PiggyBank,     color: summary.netSavings >= 0 ? "emerald" : "red", prefix: summary.netSavings >= 0 ? "+" : "" },
    { label: "Transactions", value: summary.transactionCount,  icon: Receipt,       color: "indigo",  isCount: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const bg = {
          emerald: "bg-emerald-50/50 dark:bg-emerald-950/20",
          red:     "bg-red-50/50 dark:bg-red-950/20",
          indigo:  "bg-indigo-50/50 dark:bg-indigo-950/20",
        }[c.color] ?? "bg-muted/30";
        const iconBg = {
          emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600",
          red:     "bg-red-100 dark:bg-red-500/20 text-red-600",
          indigo:  "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600",
        }[c.color] ?? "bg-muted text-muted-foreground";
        const textColor = {
          emerald: "text-emerald-600 dark:text-emerald-400",
          red:     "text-red-600 dark:text-red-400",
          indigo:  "text-indigo-600 dark:text-indigo-400",
        }[c.color] ?? "text-foreground";

        return (
          <Card
            key={c.label}
            className={cn("border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300", bg)}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                <div className={cn("p-1.5 rounded-full", iconBg)}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              <p className={cn("text-lg font-bold leading-tight", textColor)}>
                {(c as any).isCount ? c.value : `${c.prefix}${formatCurrency(Math.abs(c.value as number))}`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

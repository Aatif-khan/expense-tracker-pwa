"use client";

import { AccountStat } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Landmark } from "lucide-react";

interface AccountAnalyticsProps { stats: AccountStat }

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function AccountAnalytics({ stats }: AccountAnalyticsProps) {
  const totalSpend = stats.cashExpense + stats.bankExpense;

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Account Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Cash */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">Cash</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 font-medium">+{formatCurrency(stats.cashIncome)}</div>
              <div className="text-xs text-red-500 font-medium">-{formatCurrency(stats.cashExpense)}</div>
            </div>
          </div>
          <ProgressBar value={stats.cashExpense} total={totalSpend} color="bg-amber-400" />
          <p className="text-[10px] text-muted-foreground mt-1">
            {totalSpend > 0 ? `${Math.round((stats.cashExpense / totalSpend) * 100)}% of total spending` : "No spending"}
          </p>
        </div>

        {/* Bank */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                <Landmark className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">Bank</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 font-medium">+{formatCurrency(stats.bankIncome)}</div>
              <div className="text-xs text-red-500 font-medium">-{formatCurrency(stats.bankExpense)}</div>
            </div>
          </div>
          <ProgressBar value={stats.bankExpense} total={totalSpend} color="bg-blue-500" />
          <p className="text-[10px] text-muted-foreground mt-1">
            {totalSpend > 0 ? `${Math.round((stats.bankExpense / totalSpend) * 100)}% of total spending` : "No spending"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

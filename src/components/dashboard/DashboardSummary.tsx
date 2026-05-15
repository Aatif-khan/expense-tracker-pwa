import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, PiggyBank, Landmark, Wallet } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface DashboardSummaryProps {
  balances: {
    currentCashBalance: number;
    currentBankBalance: number;
    grandTotal: number;
  };
  monthly: {
    currentMonthIncome: number;
    currentMonthExpenses: number;
    currentMonthSavings: number;
  };
}

export function DashboardSummary({ balances, monthly }: DashboardSummaryProps) {
  const { format } = useCurrency();
  return (
    <div className="space-y-4">
      {/* Grand Total Card */}
      <Card className="bg-slate-900 text-white dark:bg-slate-800 border-none shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-slate-300 mb-1">Grand Total Balance</p>
          <div className="text-4xl font-bold mb-6">{format(balances.grandTotal)}</div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <Wallet className="h-3.5 w-3.5" />
                <span className="text-xs">Cash</span>
              </div>
              <div className="text-lg font-semibold">{format(balances.currentCashBalance)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <Landmark className="h-3.5 w-3.5" />
                <span className="text-xs">Bank</span>
              </div>
              <div className="text-lg font-semibold">{format(balances.currentBankBalance)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '50ms' }}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-medium text-muted-foreground">This Month</p>
              <div className="bg-emerald-100 dark:bg-emerald-500/20 p-1.5 rounded-full text-emerald-600">
                <ArrowUpIcon className="h-3 w-3" />
              </div>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-500">+{format(monthly.currentMonthIncome)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Income</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-red-50/50 dark:bg-red-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-medium text-muted-foreground">This Month</p>
              <div className="bg-red-100 dark:bg-red-500/20 p-1.5 rounded-full text-red-600">
                <ArrowDownIcon className="h-3 w-3" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-500">-{format(monthly.currentMonthExpenses)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Savings */}
      <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '150ms' }}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-500/20 p-2.5 rounded-xl text-blue-600">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Net Savings</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
          <div className={cn(
            "text-lg font-bold",
            monthly.currentMonthSavings >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {monthly.currentMonthSavings >= 0 ? "+" : ""}{format(monthly.currentMonthSavings)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

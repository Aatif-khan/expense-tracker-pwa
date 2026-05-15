import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/lib/db";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useSettingsStore } from "@/lib/settingsStore";

interface DashboardInsightsProps {
  insights: {
    highestSpendingCategory: string;
    maxCategoryAmount: number;
    totalTransactionsThisMonth: number;
    spendingComparison: number;
    highestExpenseTransaction: Transaction | null;
  };
}

export function DashboardInsights({ insights }: DashboardInsightsProps) {
  const { format } = useCurrency();
  const insightsEnabled = useSettingsStore((s) => s.preferences.insightsEnabled);
  const isSpendingUp = insights.spendingComparison > 0;

  if (!insightsEnabled) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground px-1">Insights</h3>

      <div className="grid grid-cols-1 gap-3">
        {/* Spending Comparison */}
        <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-full ${isSpendingUp ? 'bg-red-100 text-red-600 dark:bg-red-500/20' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20'}`}>
              {isSpendingUp ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium">Spending Trend</p>
              <p className="text-xs text-muted-foreground">
                {Math.abs(insights.spendingComparison).toFixed(0)}% {isSpendingUp ? 'more' : 'less'} than last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '225ms' }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20">
              <div className="font-bold text-lg leading-none h-5 w-5 flex items-center justify-center">#</div>
            </div>
            <div>
              <p className="text-sm font-medium">Monthly Activity</p>
              <p className="text-xs text-muted-foreground">
                {insights.totalTransactionsThisMonth} transaction{insights.totalTransactionsThisMonth === 1 ? '' : 's'} this month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Highest Category */}
        {insights.highestSpendingCategory && (
          <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '250ms' }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Top Spending Category</p>
                <p className="text-xs text-muted-foreground">
                  {insights.highestSpendingCategory} ({format(insights.maxCategoryAmount)})
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Largest Single Expense */}
        {insights.highestExpenseTransaction && (
          <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium">Largest Single Expense</p>
                <p className="text-xs text-muted-foreground truncate">
                  {insights.highestExpenseTransaction.category} - {format(insights.highestExpenseTransaction.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

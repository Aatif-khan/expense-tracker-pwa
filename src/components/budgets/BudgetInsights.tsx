"use client";

import { useBudgets } from "@/hooks/useBudgets";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  PiggyBank
} from "lucide-react";
import { BudgetProgress } from "./BudgetProgress";

interface BudgetInsightsProps {
  insights: NonNullable<ReturnType<typeof useBudgets>["insights"]>;
}

export function BudgetInsights({ insights }: BudgetInsightsProps) {
  const { format: formatCurrency } = useCurrency();

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="border-none shadow-sm bg-primary/5 dark:bg-primary/10">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Total Monthly Budget</span>
            </div>
            <span className="text-xs font-bold text-primary">
              {insights.totalPercentage.toFixed(0)}% Used
            </span>
          </div>
          
          <div className="flex justify-between items-baseline">
            <p className="text-2xl font-bold">{formatCurrency(insights.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Limit: {formatCurrency(insights.totalLimit)}</p>
          </div>

          <BudgetProgress 
            percentage={insights.totalPercentage} 
            status={insights.totalPercentage > 100 ? "exceeded" : insights.totalPercentage > 85 ? "warning" : "safe"} 
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {/* Overspent Insight */}
        {insights.overspent && (
          <Card className="border-none shadow-sm bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Highest Overspending</p>
                <p className="text-sm font-semibold">
                  {insights.overspent.category} — Over by {formatCurrency(Math.abs(insights.overspent.remaining))}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Best Saving Insight */}
        {insights.bestSaving && (
          <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Saving</p>
                <p className="text-sm font-semibold">
                  {insights.bestSaving.category} — {formatCurrency(insights.bestSaving.remaining)} left
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Close to Limit Alert */}
        {insights.closeToLimit.length > 0 && (
          <Card className="border-none shadow-sm bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Approaching Limit</p>
                <p className="text-sm font-semibold">
                  {insights.closeToLimit.length} categories are near their limit
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

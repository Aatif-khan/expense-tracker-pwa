"use client";

import { useBudgets } from "@/hooks/useBudgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { BudgetProgress } from "@/components/budgets/BudgetProgress";
import { AlertTriangle, ArrowRight, PiggyBank } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardBudgetWidget() {
  const now = new Date();
  const { budgets, insights, isLoading } = useBudgets(now.getMonth(), now.getFullYear());
  const { format: formatCurrency } = useCurrency();

  if (isLoading || budgets.length === 0) return null;
  if (!insights) return null;

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-primary" />
          Budget Tracker
        </CardTitle>
        <Link href="/budgets">
          <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold tracking-wider text-primary gap-1 px-2">
            Details <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Overall Spending</span>
            <span className="text-sm font-bold">
              {formatCurrency(insights.totalSpent)} / {formatCurrency(insights.totalLimit)}
            </span>
          </div>
          <BudgetProgress 
            percentage={insights.totalPercentage} 
            status={insights.totalPercentage > 100 ? "exceeded" : insights.totalPercentage > 85 ? "warning" : "safe"} 
          />
        </div>

        {/* Top Overspending or Near Limit */}
        {(insights.overspent || insights.closeToLimit.length > 0) && (
          <div className="pt-2 border-t border-border/40">
            {insights.overspent ? (
              <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{insights.overspent.category} is over budget!</span>
              </div>
            ) : insights.closeToLimit.length > 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{insights.closeToLimit[0].category} is near limit</span>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

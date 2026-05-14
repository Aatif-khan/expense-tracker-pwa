"use client";

import { useReports } from "@/hooks/useReports";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { SummaryCards } from "@/components/reports/SummaryCards";
import { CategoryPieChart } from "@/components/reports/CategoryPieChart";
import { IncomeExpenseBarChart } from "@/components/reports/IncomeExpenseBarChart";
import { SpendingTrendChart } from "@/components/reports/SpendingTrendChart";
import { CategoryTable } from "@/components/reports/CategoryTable";
import { AccountAnalytics } from "@/components/reports/AccountAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, Download, PlusCircle, Target, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { exportToCSV as doExport } from "@/lib/analytics";
import { formatCurrency as fmtC } from "@/lib/utils";


export default function StatsPage() {
  const reports = useReports();

  // Loading skeleton
  if (reports.isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto animate-pulse pb-24">
        <div className="h-8 w-40 bg-muted rounded mt-4" />
        <div className="h-10 w-full bg-muted rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
        </div>
        <div className="h-56 bg-muted rounded-xl" />
        <div className="h-56 bg-muted rounded-xl" />
      </div>
    );
  }

  // Fully empty DB
  if (reports.allEmpty) {
    return (
      <div className="p-4 max-w-lg mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BarChart2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Data Yet</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-[260px]">
          Add some transactions to start seeing analytics and reports here.
        </p>
        <Link href="/add">
          <Button className="gap-2"><PlusCircle className="h-4 w-4" />Add Transaction</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pt-0 space-y-5 max-w-lg mx-auto pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center justify-between py-4 -mx-4 px-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm">Analytics & Insights</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs h-8"
          onClick={() => doExport(reports.filtered, `report-${reports.period}.csv`)}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </header>

      {/* Period Filters */}
      <ReportFilters
        period={reports.period}
        setPeriod={reports.setPeriod}
        customRange={reports.customRange}
        setCustomRange={reports.setCustomRange}
      />

      {/* Empty state for period */}
      {reports.isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed p-6">
          <BarChart2 className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium mb-1">No transactions in this period</p>
          <p className="text-muted-foreground text-sm">Try changing the date range or add new transactions.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <SummaryCards summary={reports.summary} />

          {/* Insights Strip */}
          {(reports.topCategory || reports.mostUsedCategory) && (
            <div className="grid grid-cols-1 gap-3">
              {reports.topCategory && (
                <Card className="border-none shadow-sm bg-orange-50/50 dark:bg-orange-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20">
                      <TrendingDown className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Highest Spending Category</p>
                      <p className="text-sm font-semibold">
                        {reports.topCategory.category} — {fmtC(reports.topCategory.expenses)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {reports.mostUsedCategory && (
                <Card className="border-none shadow-sm bg-indigo-50/50 dark:bg-indigo-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Most Used Category</p>
                      <p className="text-sm font-semibold">
                        {reports.mostUsedCategory.category} — {reports.mostUsedCategory.count} txn{reports.mostUsedCategory.count > 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {reports.lowestCategory && (
                <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lowest Spending Category</p>
                      <p className="text-sm font-semibold">
                        {reports.lowestCategory.category} — {fmtC(reports.lowestCategory.expenses)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Charts */}
          <CategoryPieChart data={reports.pieData} />
          <IncomeExpenseBarChart data={reports.barData} />
          <SpendingTrendChart data={reports.trendData} />

          {/* Account Analytics */}
          <AccountAnalytics stats={reports.accountStats} />

          {/* Category Table */}
          <CategoryTable stats={reports.categoryStats} />

          {/* Export All */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => doExport(reports.filtered, `transactions-${reports.period}.csv`)}
          >
            <Download className="h-4 w-4" />
            Export Filtered Transactions to CSV
          </Button>
        </>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useTransactions } from "./useTransactions";
import {
  ReportPeriod, DateRange,
  getDateRangeForPeriod, filterTransactionsByRange,
  computeSummary, computeCategoryStats, computePieData,
  computeBarData, computeTrendData, computeAccountStats,
} from "@/lib/analytics";
import { startOfMonth, endOfMonth } from "date-fns";

export function useReports() {
  const { transactions, isLoading } = useTransactions();

  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const dateRange = useMemo(
    () => getDateRangeForPeriod(period, customRange),
    [period, customRange]
  );

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return filterTransactionsByRange(transactions, dateRange);
  }, [transactions, dateRange]);

  const summary      = useMemo(() => computeSummary(filtered), [filtered]);
  const categoryStats = useMemo(() => computeCategoryStats(filtered), [filtered]);
  const pieData      = useMemo(() => computePieData(filtered), [filtered]);
  const barData      = useMemo(() => computeBarData(filtered, period, dateRange), [filtered, period, dateRange]);
  const trendData    = useMemo(() => computeTrendData(filtered, period, dateRange), [filtered, period, dateRange]);
  const accountStats = useMemo(() => computeAccountStats(filtered), [filtered]);

  const topCategory = categoryStats[0] ?? null;
  const lowestCategory = categoryStats.length > 1 ? categoryStats[categoryStats.length - 1] : null;
  const mostUsedCategory = [...categoryStats].sort((a, b) => b.count - a.count)[0] ?? null;

  return {
    isLoading,
    isEmpty: filtered.length === 0,
    allEmpty: !transactions || transactions.length === 0,
    period, setPeriod,
    customRange, setCustomRange,
    dateRange,
    filtered,
    summary,
    categoryStats,
    pieData,
    barData,
    trendData,
    accountStats,
    topCategory,
    lowestCategory,
    mostUsedCategory,
  };
}

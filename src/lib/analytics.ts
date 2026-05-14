import { Transaction } from "@/lib/db";
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  isWithinInterval,
} from "date-fns";

export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export function getDateRangeForPeriod(period: ReportPeriod, customRange?: DateRange): DateRange {
  const now = new Date();
  switch (period) {
    case "daily":   return { from: startOfDay(now), to: endOfDay(now) };
    case "weekly":  return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) };
    case "monthly": return { from: startOfMonth(now), to: endOfMonth(now) };
    case "yearly":  return { from: startOfYear(now), to: endOfYear(now) };
    case "custom":  return customRange ?? { from: startOfMonth(now), to: endOfMonth(now) };
  }
}

export function filterTransactionsByRange(transactions: Transaction[], range: DateRange): Transaction[] {
  return transactions.filter((tx) =>
    isWithinInterval(new Date(tx.transactionDate), { start: range.from, end: range.to })
  );
}

// ─── Summary Stats ───────────────────────────────────────────────────────────

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  transactionCount: number;
}

export function computeSummary(transactions: Transaction[]): ReportSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const tx of transactions) {
    if (tx.transactionType === "INCOME") totalIncome += tx.amount;
    else totalExpenses += tx.amount;
  }
  return { totalIncome, totalExpenses, netSavings: totalIncome - totalExpenses, transactionCount: transactions.length };
}

// ─── Category Analytics ───────────────────────────────────────────────────────

export interface CategoryStat {
  category: string;
  income: number;
  expenses: number;
  net: number;
  count: number;
  percentage: number; // % of total expenses
}

export function computeCategoryStats(transactions: Transaction[]): CategoryStat[] {
  const map: Record<string, { income: number; expenses: number; count: number }> = {};
  let totalExpenses = 0;

  for (const tx of transactions) {
    if (!map[tx.category]) map[tx.category] = { income: 0, expenses: 0, count: 0 };
    map[tx.category].count++;
    if (tx.transactionType === "INCOME") map[tx.category].income += tx.amount;
    else { map[tx.category].expenses += tx.amount; totalExpenses += tx.amount; }
  }

  return Object.entries(map).map(([category, stat]) => ({
    category,
    income: stat.income,
    expenses: stat.expenses,
    net: stat.income - stat.expenses,
    count: stat.count,
    percentage: totalExpenses > 0 ? (stat.expenses / totalExpenses) * 100 : 0,
  })).sort((a, b) => b.expenses - a.expenses);
}

// ─── Pie Chart Data ───────────────────────────────────────────────────────────

export interface PieSlice { name: string; value: number; color: string }

const CHART_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

export function computePieData(transactions: Transaction[]): PieSlice[] {
  const expenses = transactions.filter((t) => t.transactionType === "EXPENSE");
  const map: Record<string, number> = {};
  for (const tx of expenses) map[tx.category] = (map[tx.category] || 0) + tx.amount;
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
}

// ─── Bar Chart Data (Income vs Expense) ──────────────────────────────────────

export interface BarPoint { label: string; income: number; expense: number }

export function computeBarData(transactions: Transaction[], period: ReportPeriod, range: DateRange): BarPoint[] {
  const groupKey = (date: Date): string => {
    if (period === "daily" || period === "custom") return format(date, "dd MMM");
    if (period === "weekly") return `W${format(date, "w")}`;
    if (period === "yearly") return format(date, "MMM");
    return format(date, "dd MMM");
  };

  const map: Record<string, BarPoint> = {};

  // Pre-populate buckets
  if (period === "yearly") {
    eachMonthOfInterval({ start: range.from, end: range.to }).forEach((d) => {
      const k = format(d, "MMM"); map[k] = { label: k, income: 0, expense: 0 };
    });
  } else if (period === "weekly" || period === "monthly") {
    eachDayOfInterval({ start: range.from, end: range.to }).forEach((d) => {
      const k = format(d, "dd MMM"); map[k] = { label: k, income: 0, expense: 0 };
    });
  } else {
    eachDayOfInterval({ start: range.from, end: range.to }).slice(0, 31).forEach((d) => {
      const k = format(d, "dd MMM"); map[k] = { label: k, income: 0, expense: 0 };
    });
  }

  for (const tx of transactions) {
    const k = groupKey(new Date(tx.transactionDate));
    if (!map[k]) map[k] = { label: k, income: 0, expense: 0 };
    if (tx.transactionType === "INCOME") map[k].income += tx.amount;
    else map[k].expense += tx.amount;
  }

  return Object.values(map);
}

// ─── Spending Trend (Line Chart) ─────────────────────────────────────────────

export interface TrendPoint { label: string; amount: number }

export function computeTrendData(transactions: Transaction[], period: ReportPeriod, range: DateRange): TrendPoint[] {
  const expenses = transactions.filter((t) => t.transactionType === "EXPENSE");
  const map: Record<string, number> = {};

  const fmt = period === "yearly" ? "MMM" : "dd MMM";

  if (period === "yearly") {
    eachMonthOfInterval({ start: range.from, end: range.to }).forEach((d) => { map[format(d, fmt)] = 0; });
  } else {
    eachDayOfInterval({ start: range.from, end: range.to }).slice(0, 60).forEach((d) => { map[format(d, fmt)] = 0; });
  }

  for (const tx of expenses) {
    const k = format(new Date(tx.transactionDate), fmt);
    if (k in map) map[k] = (map[k] || 0) + tx.amount;
  }

  return Object.entries(map).map(([label, amount]) => ({ label, amount }));
}

// ─── Account Analytics ────────────────────────────────────────────────────────

export interface AccountStat { cashIncome: number; cashExpense: number; bankIncome: number; bankExpense: number }

export function computeAccountStats(transactions: Transaction[]): AccountStat {
  const stat: AccountStat = { cashIncome: 0, cashExpense: 0, bankIncome: 0, bankExpense: 0 };
  for (const tx of transactions) {
    if (tx.accountType === "CASH") {
      if (tx.transactionType === "INCOME") stat.cashIncome += tx.amount;
      else stat.cashExpense += tx.amount;
    } else {
      if (tx.transactionType === "INCOME") stat.bankIncome += tx.amount;
      else stat.bankExpense += tx.amount;
    }
  }
  return stat;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCSV(transactions: Transaction[], filename = "report.csv") {
  const headers = ["Date", "Type", "Category", "Account", "Amount", "Description"];
  const rows = transactions.map((tx) => [
    format(new Date(tx.transactionDate), "yyyy-MM-dd"),
    tx.transactionType,
    tx.category,
    tx.accountType,
    tx.amount.toString(),
    tx.description.replace(/,/g, ";"),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

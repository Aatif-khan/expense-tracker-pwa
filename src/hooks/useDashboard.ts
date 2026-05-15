import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { Transaction } from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { useSettingsStore } from "@/lib/settingsStore";

export function useDashboard() {
  const { transactions, isLoading } = useTransactions();
  const initialCashBalance = useSettingsStore((s) => s.initialCashBalance);
  const initialBankBalance = useSettingsStore((s) => s.initialBankBalance);

  return useMemo(() => {
    if (!transactions) return {
      isLoading: true,
      isEmpty: true,
      balances: { currentCashBalance: 0, currentBankBalance: 0, grandTotal: 0 },
      monthly: { currentMonthIncome: 0, currentMonthExpenses: 0, currentMonthSavings: 0 },
      insights: { highestSpendingCategory: "", maxCategoryAmount: 0, totalTransactionsThisMonth: 0, spendingComparison: 0, highestExpenseTransaction: null },
      recentTransactions: []
    };

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    let cashIncome = 0;
    let cashExpense = 0;
    let bankIncome = 0;
    let bankExpense = 0;

    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;
    let previousMonthExpenses = 0;
    let totalTransactionsThisMonth = 0;

    let highestExpenseTransaction: Transaction | null = null;
    const categorySpending: Record<string, number> = {};

    transactions.forEach((tx) => {
      // Balance Calculations (All Time)
      if (tx.accountType === "CASH") {
        if (tx.transactionType === "INCOME") cashIncome += tx.amount;
        else cashExpense += tx.amount;
      } else if (tx.accountType === "BANK") {
        if (tx.transactionType === "INCOME") bankIncome += tx.amount;
        else bankExpense += tx.amount;
      }

      // Time-based Calculations
      const txDate = new Date(tx.transactionDate);
      const isCurrentMonth = isWithinInterval(txDate, { start: currentMonthStart, end: currentMonthEnd });
      const isPreviousMonth = isWithinInterval(txDate, { start: previousMonthStart, end: previousMonthEnd });

      if (isCurrentMonth) {
        totalTransactionsThisMonth++;

        if (tx.transactionType === "INCOME") {
          currentMonthIncome += tx.amount;
        } else {
          currentMonthExpenses += tx.amount;

          // Track category spending
          categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;

          // Track highest expense
          if (!highestExpenseTransaction || tx.amount > highestExpenseTransaction.amount) {
            highestExpenseTransaction = tx;
          }
        }
      } else if (isPreviousMonth) {
        if (tx.transactionType === "EXPENSE") {
          previousMonthExpenses += tx.amount;
        }
      }
    });

    // Add initial balances from settings
    const currentCashBalance = initialCashBalance + cashIncome - cashExpense;
    const currentBankBalance = initialBankBalance + bankIncome - bankExpense;
    const grandTotal = currentCashBalance + currentBankBalance;
    const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

    // Calculate highest spending category
    let highestSpendingCategory = "";
    let maxCategoryAmount = 0;
    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > maxCategoryAmount) {
        maxCategoryAmount = amount;
        highestSpendingCategory = category;
      }
    });

    // Calculate spending comparison percentage
    let spendingComparison = 0;
    if (previousMonthExpenses > 0) {
      spendingComparison = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;
    } else if (currentMonthExpenses > 0) {
      spendingComparison = 100;
    }

    return {
      isLoading: false,
      isEmpty: transactions.length === 0,
      balances: {
        currentCashBalance,
        currentBankBalance,
        grandTotal,
      },
      monthly: {
        currentMonthIncome,
        currentMonthExpenses,
        currentMonthSavings,
      },
      insights: {
        highestSpendingCategory,
        maxCategoryAmount,
        totalTransactionsThisMonth,
        spendingComparison,
        highestExpenseTransaction,
      },
      recentTransactions: transactions.slice(0, 5),
    };
  }, [transactions, isLoading, initialCashBalance, initialBankBalance]);
}

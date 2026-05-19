"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, Budget } from "@/lib/db";
import { useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

export interface BudgetWithStats extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "exceeded";
}

export function useBudgets(month: number, year: number) {
  // 1. Fetch all budgets for the selected month/year
  const budgets = useLiveQuery(
    () => db.budgets.where("[month+year]").equals([month, year]).toArray(),
    [month, year]
  );

  // 2. Fetch all expense transactions for the selected month/year
  const transactions = useLiveQuery(
    () => {
      const start = startOfMonth(new Date(year, month));
      const end = endOfMonth(new Date(year, month));
      return db.transactions
        .where("transactionDate")
        .between(start, end, true, true)
        .filter(tx => tx.transactionType === "EXPENSE")
        .toArray();
    },
    [month, year]
  );

  // 3. Compute stats
  const budgetStats = useMemo(() => {
    if (!budgets || !transactions) return [];

    return budgets.map(budget => {
      const categorySpent = transactions
        .filter(tx => tx.category === budget.category)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const remaining = budget.monthlyLimit - categorySpent;
      const percentage = (categorySpent / budget.monthlyLimit) * 100;

      let status: BudgetWithStats["status"] = "safe";
      if (percentage > 100) status = "exceeded";
      else if (percentage >= 70) status = "warning";

      return {
        ...budget,
        spent: categorySpent,
        remaining,
        percentage,
        status,
      };
    });
  }, [budgets, transactions]);

  // 4. Global insights
  const insights = useMemo(() => {
    if (budgetStats.length === 0) return null;

    const totalLimit = budgetStats.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = budgetStats.reduce((sum, b) => sum + b.spent, 0);
    const totalPercentage = (totalSpent / totalLimit) * 100;

    const overspent = [...budgetStats]
      .filter(b => b.spent > b.monthlyLimit)
      .sort((a, b) => (b.spent - b.monthlyLimit) - (a.spent - a.monthlyLimit))[0];

    const bestSaving = [...budgetStats]
      .filter(b => b.spent < b.monthlyLimit)
      .sort((a, b) => (b.monthlyLimit - b.spent) - (a.monthlyLimit - a.spent))[0];

    const closeToLimit = budgetStats.filter(b => b.percentage >= 85 && b.percentage <= 100);

    return {
      totalLimit,
      totalSpent,
      totalPercentage,
      overspent,
      bestSaving,
      closeToLimit,
    };
  }, [budgetStats]);

  // CRUD Actions
  const addBudget = async (data: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
    // Check if budget already exists for this category/month/year
    const existing = await db.budgets.where("[month+year]").equals([month, year]).filter(b => b.category === data.category).first();
    if (existing) {
      throw new Error("Budget already exists for this category in this month");
    }

    return await db.budgets.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateBudget = async (id: number, data: Partial<Budget>) => {
    return await db.budgets.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteBudget = async (id: number) => {
    return await db.budgets.delete(id);
  };

  return {
    budgets: budgetStats,
    insights,
    isLoading: budgets === undefined || transactions === undefined,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

import { db, Transaction } from "./db";
import { useSettingsStore } from "./settingsStore";
import { subDays, subMonths, startOfMonth, addDays } from "date-fns";

const CATEGORIES = {
  INCOME: ["Salary", "Freelance", "Investments", "Gifts", "Other Income"],
  EXPENSE: ["Housing", "Food & Dining", "Transportation", "Shopping", "Entertainment", "Healthcare", "Bills & Utilities", "Education", "Travel", "Other Expense"]
};

const getRandomAmount = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateDemoData = async () => {
  // Clear everything
  await db.transactions.clear();
  await db.budgets.clear();
  
  // Set initial balances to look good
  const setInitialBank = useSettingsStore.getState().setInitialBankBalance;
  const setInitialCash = useSettingsStore.getState().setInitialCashBalance;
  await setInitialBank(12500);
  await setInitialCash(850);

  const now = new Date();
  const transactions: Transaction[] = [];
  const budgets = [];

  // Generate Budgets for current month
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const mockBudgets = [
    { category: "Housing", limit: 2500 },
    { category: "Food & Dining", limit: 800 },
    { category: "Transportation", limit: 400 },
    { category: "Entertainment", limit: 300 },
    { category: "Shopping", limit: 500 }
  ];

  for (const b of mockBudgets) {
    budgets.push({
      category: b.category,
      monthlyLimit: b.limit,
      month: currentMonth,
      year: currentYear,
      createdAt: now,
      updatedAt: now,
    });
  }

  await db.budgets.bulkAdd(budgets);

  // Generate Transactions for last 90 days
  for (let i = 0; i < 90; i++) {
    const txDate = subDays(now, i);
    
    // Monthly Salary
    if (txDate.getDate() === 1) {
      transactions.push({
        amount: 5200,
        category: "Salary",
        description: "Monthly Tech Corp Salary",
        transactionType: "INCOME" as const,
        accountType: "BANK" as const,
        transactionDate: txDate,
        createdAt: txDate,
        updatedAt: txDate,
      });
    }

    // Rent
    if (txDate.getDate() === 5) {
      transactions.push({
        amount: 2200,
        category: "Housing",
        description: "Downtown Apartment Rent",
        transactionType: "EXPENSE" as const,
        accountType: "BANK" as const,
        transactionDate: txDate,
        createdAt: txDate,
        updatedAt: txDate,
      });
    }

    // Random daily expenses (2-4 per day)
    const numExpenses = getRandomAmount(1, 4);
    for (let j = 0; j < numExpenses; j++) {
      const isBank = Math.random() > 0.3;
      const category = getRandomItem(CATEGORIES.EXPENSE);
      let amount = getRandomAmount(10, 150);
      
      if (category === "Shopping") amount = getRandomAmount(50, 400);
      if (category === "Food & Dining") amount = getRandomAmount(15, 80);

      transactions.push({
        amount,
        category,
        description: `Demo ${category} Expense`,
        transactionType: "EXPENSE" as const,
        accountType: isBank ? "BANK" : "CASH",
        transactionDate: txDate,
        createdAt: txDate,
        updatedAt: txDate,
      });
    }
  }

  // Add an active recurring transaction
  const recurringStart = startOfMonth(now);
  transactions.push({
    amount: 14.99,
    category: "Entertainment",
    description: "Netflix Subscription",
    transactionType: "EXPENSE" as const,
    accountType: "BANK" as const,
    transactionDate: recurringStart,
    createdAt: now,
    updatedAt: now,
    isRecurring: true,
    recurringType: "MONTHLY" as const,
    recurringStartDate: recurringStart,
    nextOccurrenceDate: addDays(recurringStart, 30),
  });

  await db.transactions.bulkAdd(transactions);
};

import { z } from "zod";

export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Entertainment",
  "Fuel",
  "Health",
  "Investment",
  "Other",
] as const;

export const ACCOUNT_TYPES = ["CASH", "BANK"] as const;
export const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  transactionType: z.enum(TRANSACTION_TYPES),
  accountType: z.enum(ACCOUNT_TYPES),
  transactionDate: z.date({
    message: "A date of transaction is required.",
  }),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

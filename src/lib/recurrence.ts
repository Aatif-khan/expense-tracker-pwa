import { addDays, addWeeks, addMonths, addYears, isBefore, isSameDay, startOfDay } from "date-fns";
import { db, Transaction } from "./db";

export type RecurringType = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export function calculateNextOccurrence(currentDate: Date, type: RecurringType): Date {
  const date = startOfDay(currentDate);
  switch (type) {
    case "DAILY":
      return addDays(date, 1);
    case "WEEKLY":
      return addWeeks(date, 1);
    case "MONTHLY":
      return addMonths(date, 1);
    case "YEARLY":
      return addYears(date, 1);
    default:
      return date;
  }
}

export async function processRecurringTransactions() {
  const today = startOfDay(new Date());

  await db.transaction('rw', db.transactions, async () => {
    // 1. Fetch all active recurring templates
    const templates = await db.transactions
      .filter(t => !!t.isRecurring && !!t.nextOccurrenceDate)
      .toArray();

    const newTransactions: Transaction[] = [];

    for (const template of templates) {
      if (!template.id || !template.nextOccurrenceDate) continue;

      let nextDate = startOfDay(template.nextOccurrenceDate);
      let occurrencesGenerated = 0;

      // 2. Generate all missing occurrences up to today
      while ((isBefore(nextDate, today) || isSameDay(nextDate, today)) && occurrencesGenerated < 365) {
        // If there's an end date and we've passed it, stop generating
        if (template.recurringEndDate && isBefore(startOfDay(template.recurringEndDate), nextDate)) {
          break;
        }

        // Create the generated transaction
        const generatedTransaction: Transaction = {
          amount: template.amount,
          category: template.category,
          description: template.description,
          transactionType: template.transactionType,
          accountType: template.accountType,
          transactionDate: nextDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          recurringParentId: template.id,
        };

        newTransactions.push(generatedTransaction);

        // Advance to the next occurrence
        nextDate = calculateNextOccurrence(nextDate, template.recurringType as RecurringType);
        occurrencesGenerated++;
      }

      // 3. Update the template's nextOccurrenceDate and lastGeneratedDate
      if (occurrencesGenerated > 0) {
        await db.transactions.update(template.id, {
          nextOccurrenceDate: nextDate,
          lastGeneratedDate: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 4. Bulk add all generated transactions
    if (newTransactions.length > 0) {
      await db.transactions.bulkAdd(newTransactions);
    }
  });
}

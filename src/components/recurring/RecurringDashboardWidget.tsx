"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { format, isBefore, startOfDay, addMonths } from "date-fns";
import { db } from "@/lib/db";
import { useCurrency } from "@/hooks/useCurrency";
import { getCurrencySymbol } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepeatIcon } from "lucide-react";

export function RecurringDashboardWidget() {
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  
  const recurringTemplates = useLiveQuery(
    () => db.transactions.filter(t => !!t.isRecurring && !!t.nextOccurrenceDate).toArray(),
    []
  );

  if (!recurringTemplates || recurringTemplates.length === 0) return null;

  // Calculate next due
  const sortedByDate = [...recurringTemplates].sort((a, b) => {
    if (!a.nextOccurrenceDate || !b.nextOccurrenceDate) return 0;
    return a.nextOccurrenceDate.getTime() - b.nextOccurrenceDate.getTime();
  });
  
  const nextDue = sortedByDate[0];

  // Calculate monthly recurring total (roughly)
  let monthlyTotal = 0;
  recurringTemplates.forEach(t => {
    if (t.transactionType === "EXPENSE") {
      if (t.recurringType === "MONTHLY") monthlyTotal += t.amount;
      if (t.recurringType === "WEEKLY") monthlyTotal += t.amount * 4.33;
      if (t.recurringType === "DAILY") monthlyTotal += t.amount * 30;
      if (t.recurringType === "YEARLY") monthlyTotal += t.amount / 12;
    }
  });

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
          <RepeatIcon className="w-4 h-4 mr-2" />
          Recurring Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{symbol}{monthlyTotal.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">/ month average</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold truncate">{nextDue.category}</p>
          <p className="text-xs text-muted-foreground truncate">
            {nextDue.nextOccurrenceDate ? format(nextDue.nextOccurrenceDate, "MMM d") : ""} • {symbol}{nextDue.amount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

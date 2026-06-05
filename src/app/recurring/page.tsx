"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { format, isBefore, startOfDay } from "date-fns";
import { db, Transaction } from "@/lib/db";
import { getCurrencySymbol } from "@/lib/currency";
import { useCurrency } from "@/hooks/useCurrency";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Pause, Play, Edit, PlusCircle, RepeatIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionFormValues } from "@/lib/constants";

export default function RecurringPage() {
  const router = useRouter();
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const recurringTemplates = useLiveQuery(
    () => db.transactions.filter(t => !!t.isRecurring).toArray(),
    []
  );

  const togglePause = async (id: number, currentNextDate?: Date) => {
    // A simple pause mechanism is removing nextOccurrenceDate
    if (currentNextDate) {
      await db.transactions.update(id, { nextOccurrenceDate: undefined, updatedAt: new Date() });
    } else {
      // Resume logic: Needs to recalculate next date from today or lastGeneratedDate
      // For simplicity, resume sets nextOccurrenceDate to tomorrow if none exists
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await db.transactions.update(id, { nextOccurrenceDate: tomorrow, updatedAt: new Date() });
    }
  };

  const deleteTemplate = async (id: number) => {
    if (confirm("Delete this recurring rule? Existing transactions will remain.")) {
      await db.transactions.update(id, { isRecurring: false, nextOccurrenceDate: undefined, updatedAt: new Date() });
    }
  };

  const handleUpdate = async (data: TransactionFormValues) => {
    if (selectedTx?.id) {
      let nextOccurrenceDate = selectedTx.nextOccurrenceDate;
      // If frequency changed or it was paused, we might need to recalculate, but to keep it simple, we just save the form data
      if (data.isRecurring && data.recurringType && !nextOccurrenceDate) {
        const { calculateNextOccurrence } = await import("@/lib/recurrence");
        nextOccurrenceDate = calculateNextOccurrence(data.transactionDate || selectedTx.transactionDate, data.recurringType);
      }
      
      await db.transactions.update(selectedTx.id, {
        ...data,
        description: data.description || "",
        nextOccurrenceDate,
        updatedAt: new Date(),
      });
      setSelectedTx(null);
    }
  };

  if (!recurringTemplates) return <div className="p-4">Loading...</div>;

  const active = recurringTemplates.filter(t => t.nextOccurrenceDate);
  const paused = recurringTemplates.filter(t => !t.nextOccurrenceDate && (!t.recurringEndDate || isBefore(startOfDay(new Date()), startOfDay(t.recurringEndDate))));
  const completed = recurringTemplates.filter(t => !t.nextOccurrenceDate && t.recurringEndDate && isBefore(startOfDay(t.recurringEndDate), startOfDay(new Date())));

  if (recurringTemplates.length === 0) {
    return (
      <div className="p-4 space-y-6 flex flex-col items-center justify-center h-[80vh] text-center">
        <RepeatIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-bold">No Recurring Entries</h1>
        <p className="text-muted-foreground">Automate your salary, rent, and subscriptions.</p>
        <Link href="/add" passHref>
          <Button className="mt-4">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Recurring Transaction
          </Button>
        </Link>
      </div>
    );
  }

  const renderList = (items: Transaction[], emptyMessage: string) => {
    if (items.length === 0) return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    
    return items.map(t => (
      <Card key={t.id} className="mb-4">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg">{t.category} {t.description && <span className="text-sm font-normal text-muted-foreground">- {t.description}</span>}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{t.recurringType}</Badge>
              {t.nextOccurrenceDate ? (
                <span className="text-xs text-muted-foreground">Next: {format(t.nextOccurrenceDate, "MMM d, yyyy")}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Paused/Completed</span>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <span className={`font-semibold ${t.transactionType === "INCOME" ? "text-emerald-500" : "text-red-500"}`}>
              {t.transactionType === "INCOME" ? "+" : "-"}{symbol}{t.amount.toFixed(2)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTx(t)}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => t.id && togglePause(t.id, t.nextOccurrenceDate)}>
            {t.nextOccurrenceDate ? <><Pause className="w-4 h-4 mr-1" /> Pause</> : <><Play className="w-4 h-4 mr-1" /> Resume</>}
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => t.id && deleteTemplate(t.id)}>
            <Trash className="w-4 h-4 mr-1" /> Delete
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recurring</h1>
          <p className="text-muted-foreground text-sm">Manage automated entries</p>
        </div>
        <Link href="/add" passHref>
          <Button size="icon">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </Link>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-3">Active</h2>
        {renderList(active, "No active recurring transactions.")}
      </section>

      {paused.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Paused</h2>
          {renderList(paused, "")}
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Completed</h2>
          {renderList(completed, "")}
        </section>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle>Edit Recurring Rule</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {selectedTx && (
              <TransactionForm 
                initialData={selectedTx as Transaction} 
                onSubmit={handleUpdate} 
                onCancel={() => setSelectedTx(null)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

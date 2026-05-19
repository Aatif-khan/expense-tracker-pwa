"use client";

import { useBudgets, BudgetWithStats } from "@/hooks/useBudgets";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetForm, BudgetFormValues } from "@/components/budgets/BudgetForm";
import { BudgetInsights } from "@/components/budgets/BudgetInsights";
import { BudgetCharts } from "@/components/budgets/BudgetCharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight, 
  Wallet,
  Calendar,
  LayoutGrid
} from "lucide-react";
import { useState, useMemo } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { 
  Toast, 
  ToastProvider, 
  ToastViewport,
  ToastTitle,
  ToastDescription 
} from "@/components/ui/toaster";

export default function BudgetsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const budgetsHook = useBudgets(month, year);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastState, setToastState] = useState<{ title: string; description: string; variant?: "default" | "destructive" } | null>(null);
  
  const filteredBudgets = budgetsHook.budgets.filter(b => 
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derive filtered insights
  const filteredInsights = useMemo(() => {
    if (filteredBudgets.length === 0) return null;
    
    const totalLimit = filteredBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    const overspent = [...filteredBudgets]
      .filter(b => b.spent > b.monthlyLimit)
      .sort((a, b) => (b.spent - b.monthlyLimit) - (a.spent - a.monthlyLimit))[0];

    const bestSaving = [...filteredBudgets]
      .filter(b => b.spent < b.monthlyLimit)
      .sort((a, b) => (b.monthlyLimit - b.spent) - (a.monthlyLimit - a.spent))[0];

    const closeToLimit = filteredBudgets.filter(b => b.percentage >= 85 && b.percentage <= 100);

    return {
      totalLimit,
      totalSpent,
      totalPercentage,
      overspent,
      bestSaving,
      closeToLimit,
    };
  }, [filteredBudgets]);

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setToastState({ title, description, variant });
    setTimeout(() => setToastState(null), 3000);
  };

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleAddBudget = async (data: BudgetFormValues) => {
    try {
      await budgetsHook.addBudget({
        ...data,
        month,
        year
      });
      setIsAddOpen(false);
      showToast("Success", "Budget created successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create budget";
      showToast("Error", message, "destructive");
    }
  };

  const handleEditBudget = async (data: BudgetFormValues) => {
    if (!editingBudget?.id) return;
    try {
      await budgetsHook.updateBudget(editingBudget.id, data);
      setEditingBudget(null);
      showToast("Success", "Budget updated successfully");
    } catch {
      showToast("Error", "Failed to update budget", "destructive");
    }
  };

  const handleDeleteBudget = async (id: number) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetsHook.deleteBudget(id);
        showToast("Success", "Budget deleted successfully");
      } catch {
        showToast("Error", "Failed to delete budget", "destructive");
      }
    }
  };

  if (budgetsHook.isLoading) {
    return (
      <div className="p-4 space-y-6 max-w-lg mx-auto animate-pulse pb-24">
        <div className="h-8 w-40 bg-muted rounded mt-4" />
        <div className="h-12 w-full bg-muted rounded-xl" />
        <div className="h-48 w-full bg-muted rounded-xl" />
        <div className="grid grid-cols-1 gap-3">
          {[1,2].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="p-4 pt-0 space-y-6 max-w-lg mx-auto pb-24">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center justify-between py-4 -mx-4 px-4 border-b border-border/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Budgets</h1>
            <p className="text-muted-foreground text-sm">Monthly category limits</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2 rounded-full h-9 px-4 shadow-md transition-all active:scale-95">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Budget</span>
          </Button>
        </header>

        {/* Month Selector */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-border/40">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="rounded-full hover:bg-background shadow-sm">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
              <Calendar className="h-4 w-4 text-primary" />
              {format(currentDate, "MMMM yyyy")}
            </div>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-full hover:bg-background shadow-sm">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Filter by category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/20 border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {budgetsHook.budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/10 rounded-3xl border border-dashed border-border/60 p-8 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">No Budgets Set</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-[280px] leading-relaxed">
              Plan your spending for {format(currentDate, "MMMM")} by setting category limits.
            </p>
            <Button onClick={() => setIsAddOpen(true)} className="gap-2 px-8 h-12 rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
              <PlusCircle className="h-5 w-5" />
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Warning Banner */}
            {filteredInsights?.overspent && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-red-500 rounded-full text-white">
                  <PlusCircle className="h-4 w-4 rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Budget Exceeded</h4>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80">You have overspent in {filteredInsights.overspent.category}. Check details below.</p>
                </div>
              </div>
            )}

            {/* Summary Insights */}
            {filteredInsights && <BudgetInsights insights={filteredInsights} />}

            {/* Visual Charts */}
            <BudgetCharts budgets={filteredBudgets} />

            {/* Budget List */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category Budgets</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {filteredBudgets.length > 0 ? (
                  filteredBudgets.map((budget) => (
                    <BudgetCard 
                      key={budget.id} 
                      budget={budget} 
                      onEdit={setEditingBudget} 
                      onDelete={handleDeleteBudget}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No categories match &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Budget Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Set Category Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              onSubmit={handleAddBudget} 
              onCancel={() => setIsAddOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Edit Budget Dialog */}
        <Dialog open={!!editingBudget} onOpenChange={(open) => !open && setEditingBudget(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Edit Budget: {editingBudget?.category}</DialogTitle>
            </DialogHeader>
            {editingBudget && (
              <BudgetForm 
                initialData={{ category: editingBudget.category, monthlyLimit: editingBudget.monthlyLimit }}
                isEditing
                onSubmit={handleEditBudget} 
                onCancel={() => setEditingBudget(null)} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Toast Notification */}
        {toastState && (
          <Toast variant={toastState.variant}>
            <div className="grid gap-1">
              <ToastTitle>{toastState.title}</ToastTitle>
              <ToastDescription>{toastState.description}</ToastDescription>
            </div>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

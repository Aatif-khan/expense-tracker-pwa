"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardBudgetWidget } from "@/components/dashboard/DashboardBudgetWidget";
import { RecurringDashboardWidget } from "@/components/recurring/RecurringDashboardWidget";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Transaction } from "@/lib/db";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const dashboard = useDashboard();
  
  // State for quick edit from dashboard
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleUpdate = async (data: any) => {
    if (selectedTx?.id) {
      await dashboard.updateTransaction(selectedTx.id, data);
      setSelectedTx(null);
    }
  };

  if (dashboard.isLoading) {
    return (
      <div className="p-4 pt-8 space-y-6 max-w-lg mx-auto min-h-[80vh]">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-48 bg-muted/60 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
        </div>
        <div className="h-48 w-full bg-muted/80 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 w-full bg-muted/60 rounded-xl animate-pulse"></div>
          <div className="h-24 w-full bg-muted/60 rounded-xl animate-pulse"></div>
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-muted/40 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-0 space-y-6 max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center justify-between py-4 mb-2 -mx-4 px-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">Here&apos;s your financial summary</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
          <Wallet className="text-primary h-5 w-5" />
        </div>
      </header>

      {dashboard.isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Wallet className="h-12 w-12 text-primary opacity-80" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Welcome to Expenses</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-[260px] leading-relaxed">
            Your offline-first financial companion. Add your first transaction to unlock insights, budgets, and more.
          </p>
          <Link href="/add" passHref>
            <Button size="lg" className="gap-2 rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-95">
              <PlusCircle className="h-5 w-5" />
              Add First Transaction
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <DashboardSummary balances={dashboard.balances} monthly={dashboard.monthly} />
          
          <DashboardInsights insights={dashboard.insights} />
          
          <DashboardBudgetWidget />
          <RecurringDashboardWidget />

          <div className="pt-2">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
              <Link href="/transactions" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {dashboard.recentTransactions.map((tx, index) => (
                <div 
                  key={tx.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${350 + index * 50}ms` }}
                >
                  <TransactionItem transaction={tx} onClick={setSelectedTx} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Edit Dialog from Dashboard */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {selectedTx && (
              <TransactionForm 
                initialData={selectedTx} 
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

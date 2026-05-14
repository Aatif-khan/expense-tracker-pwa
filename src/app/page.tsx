"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
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

  if (dashboard.isLoading) {
    return <div className="p-4 space-y-6 max-w-lg mx-auto animate-pulse flex flex-col items-center justify-center min-h-[50vh]">
      <div className="h-8 w-32 bg-muted rounded mb-8"></div>
      <div className="h-48 w-full bg-muted rounded-xl"></div>
      <div className="h-24 w-full bg-muted rounded-xl"></div>
    </div>;
  }

  return (
    <div className="p-4 pt-0 space-y-6 max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl flex items-center justify-between py-4 mb-2 -mx-4 px-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">Here's your financial summary</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
          <Wallet className="text-primary h-5 w-5" />
        </div>
      </header>

      {dashboard.isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed p-6">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Expense Tracker!</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-[250px]">
            You don't have any transactions yet. Add your first income or expense to get started.
          </p>
          <Link href="/add">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <DashboardSummary balances={dashboard.balances} monthly={dashboard.monthly} />
          
          <DashboardInsights insights={dashboard.insights} />

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
                onSubmit={() => setSelectedTx(null)} 
                onCancel={() => setSelectedTx(null)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

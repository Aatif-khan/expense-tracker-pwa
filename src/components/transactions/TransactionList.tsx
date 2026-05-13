"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionItem } from "./TransactionItem";
import { TransactionFilters, FilterState } from "./TransactionFilters";
import { Transaction } from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TransactionForm } from "./TransactionForm";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TransactionFormValues } from "@/lib/constants";

export function TransactionList() {
  const { transactions, isLoading, updateTransaction, deleteTransaction } = useTransactions();
  const [filters, setFilters] = useState<FilterState>({ type: "", account: "", category: "" });
  
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground animate-pulse">Loading transactions...</div>;
  }

  const filteredTransactions = transactions?.filter(tx => {
    if (filters.type && tx.transactionType !== filters.type) return false;
    if (filters.account && tx.accountType !== filters.account) return false;
    if (filters.category && tx.category !== filters.category) return false;
    
    if (filters.dateRange?.from) {
      const txDate = new Date(tx.transactionDate);
      txDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(filters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (txDate < fromDate) return false;
    }
    
    if (filters.dateRange?.to) {
      const txDate = new Date(tx.transactionDate);
      txDate.setHours(0, 0, 0, 0);
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(0, 0, 0, 0);
      
      if (txDate > toDate) return false;
    }
    
    return true;
  });

  const handleItemClick = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: TransactionFormValues) => {
    if (selectedTx?.id) {
      await updateTransaction(selectedTx.id, data);
      setIsEditOpen(false);
    }
  };

  const handleDelete = async () => {
    if (selectedTx?.id) {
      await deleteTransaction(selectedTx.id);
      setIsDeleteOpen(false);
      setIsEditOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <TransactionFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="space-y-1">
        {filteredTransactions?.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredTransactions?.map((tx, index) => (
            <div 
              key={tx.id} 
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TransactionItem transaction={tx} onClick={handleItemClick} />
            </div>
          ))
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Transaction</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 -mt-2 -mr-2"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-6 pt-4 max-h-[80vh] overflow-y-auto">
            {selectedTx && (
              <TransactionForm 
                initialData={{
                  amount: selectedTx.amount,
                  category: selectedTx.category,
                  description: selectedTx.description,
                  transactionType: selectedTx.transactionType,
                  accountType: selectedTx.accountType,
                  transactionDate: selectedTx.transactionDate,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your transaction record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

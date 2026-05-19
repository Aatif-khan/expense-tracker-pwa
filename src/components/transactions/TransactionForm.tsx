"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TransactionFormValues, transactionSchema, CATEGORIES, ACCOUNT_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { getCurrencySymbol } from "@/lib/currency";
import { RECURRING_TYPES } from "@/lib/constants";

interface TransactionFormProps {
  initialData?: TransactionFormValues;
  onSubmit: (data: TransactionFormValues) => void;
  onCancel?: () => void;
}

export function TransactionForm({ initialData, onSubmit, onCancel }: TransactionFormProps) {
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: initialData || {
      amount: 0,
      category: "",
      description: "",
      transactionType: "EXPENSE",
      accountType: "CASH",
      transactionDate: new Date(),
      isRecurring: false,
    },
  });

  const transactionType = watch("transactionType");
  const isRecurring = watch("isRecurring");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex bg-muted p-1 rounded-lg">
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
            transactionType === "EXPENSE" ? "bg-background text-red-500 shadow-sm" : "text-muted-foreground"
          )}
          onClick={() => setValue("transactionType", "EXPENSE")}
        >
          Expense
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
            transactionType === "INCOME" ? "bg-background text-emerald-500 shadow-sm" : "text-muted-foreground"
          )}
          onClick={() => setValue("transactionType", "INCOME")}
        >
          Income
        </button>
      </div>

      <div className="space-y-2">
        <Label>Amount ({symbol})</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="text-2xl h-14"
          {...register("amount")}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account</Label>
          <Controller
            control={control}
            name="accountType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((acc) => (
                    <SelectItem key={acc} value={acc}>
                      {acc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Controller
            control={control}
            name="transactionDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.transactionDate && (
            <p className="text-sm text-red-500">{errors.transactionDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description (Optional)</Label>
        <Input placeholder="Note about this transaction..." {...register("description")} />
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Recurring Transaction</Label>
            <p className="text-xs text-muted-foreground">Automatically log this transaction</p>
          </div>
          <Controller
            control={control}
            name="isRecurring"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {isRecurring && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Controller
                control={control}
                name="recurringType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || "MONTHLY"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECURRING_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Controller
                control={control}
                name="recurringEndDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>No end date</span>}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {initialData ? "Update" : "Save"} Transaction
        </Button>
      </div>
    </form>
  );
}

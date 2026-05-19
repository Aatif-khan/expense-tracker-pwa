"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/hooks/useCurrency";
import { getCurrencySymbol } from "@/lib/currency";

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  monthlyLimit: z.coerce.number().positive("Limit must be greater than zero"),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  initialData?: BudgetFormValues;
  onSubmit: (data: BudgetFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function BudgetForm({ initialData, onSubmit, onCancel, isEditing }: BudgetFormProps) {
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: initialData || {
      category: "",
      monthlyLimit: 0,
    },
  });

  const selectedCategory = watch("category");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          disabled={isEditing} 
          onValueChange={(v) => v && setValue("category", v)} 
          value={selectedCategory}
        >
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
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Monthly Limit ({symbol})</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="text-2xl h-14"
          {...register("monthlyLimit")}
        />
        {errors.monthlyLimit && <p className="text-sm text-red-500">{errors.monthlyLimit.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isEditing ? "Update" : "Create"} Budget
        </Button>
      </div>
    </form>
  );
}

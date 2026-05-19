"use client";

import { BudgetWithStats } from "@/hooks/useBudgets";
import { Card, CardContent } from "@/components/ui/card";
import { BudgetProgress } from "./BudgetProgress";
import { useCurrency } from "@/hooks/useCurrency";
import { MoreVertical, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: BudgetWithStats;
  onEdit: (budget: BudgetWithStats) => void;
  onDelete: (id: number) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { format: formatCurrency } = useCurrency();

  const statusStyles = {
    safe: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    warning: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
    exceeded: "text-red-600 bg-red-50 dark:bg-red-500/10",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base">{budget.category}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={cn("text-[10px] uppercase font-bold", statusStyles[budget.status])}>
                {budget.status}
              </Badge>
              {budget.status === "exceeded" && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(budget)} className="gap-2">
                <Edit2 className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => budget.id && onDelete(budget.id)} className="gap-2 text-red-500 focus:text-red-500">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <p className="text-2xl font-bold">{formatCurrency(budget.spent)}</p>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(budget.monthlyLimit)}
            </p>
          </div>
          <BudgetProgress percentage={budget.percentage} status={budget.status} />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">Remaining</span>
          <span className={cn(
            "font-semibold",
            budget.remaining < 0 ? "text-red-500" : "text-emerald-600"
          )}>
            {budget.remaining < 0 ? "-" : ""}{formatCurrency(Math.abs(budget.remaining))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

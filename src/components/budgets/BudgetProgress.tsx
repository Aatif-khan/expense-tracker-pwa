"use client";

import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  percentage: number;
  status: "safe" | "warning" | "exceeded";
  className?: string;
  showLabel?: boolean;
}

export function BudgetProgress({ percentage, status, className, showLabel = false }: BudgetProgressProps) {
  const displayPct = Math.min(percentage, 100);
  
  const colors = {
    safe: "bg-emerald-500",
    warning: "bg-amber-500",
    exceeded: "bg-red-500",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 rounded-full", colors[status])}
          style={{ width: `${displayPct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>{percentage.toFixed(0)}% Used</span>
          <span>{status === "exceeded" ? "Limit Exceeded" : status === "warning" ? "Approaching Limit" : "On Track"}</span>
        </div>
      )}
    </div>
  );
}

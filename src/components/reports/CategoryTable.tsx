"use client";

import { CategoryStat } from "@/lib/analytics";
import { useCurrency } from "@/hooks/useCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryTableProps { stats: CategoryStat[] }

export function CategoryTable({ stats }: CategoryTableProps) {
  const { format: formatCurrency } = useCurrency();
  if (stats.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Category Breakdown</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          No categories to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Category</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-2.5">Income</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-2.5">Expense</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row, i) => (
                <tr key={row.category} className={cn("border-b border-border/30", i % 2 === 1 && "bg-muted/10")}>
                  <td className="px-4 py-2.5 font-medium">{row.category}</td>
                  <td className="px-3 py-2.5 text-right text-emerald-600 font-medium text-xs">
                    {row.income > 0 ? `+${formatCurrency(row.income)}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right text-red-500 font-medium text-xs">
                    {row.expenses > 0 ? `-${formatCurrency(row.expenses)}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                    {row.percentage > 0 ? `${row.percentage.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IncomeExpenseBarChartProps { data: BarPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3 text-sm space-y-1">
        <p className="font-semibold text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function IncomeExpenseBarChart({ data }: IncomeExpenseBarChartProps) {
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);
  const visibleData = data.filter((d) => d.income > 0 || d.expense > 0).slice(-12);

  if (!hasData) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Income vs Expenses</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          No data for selected period
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={visibleData} barGap={4} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-40" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs">{v}</span>} />
            <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

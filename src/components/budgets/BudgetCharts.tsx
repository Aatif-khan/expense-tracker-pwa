"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { BudgetWithStats } from "@/hooks/useBudgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { getCurrencySymbol } from "@/lib/currency";

interface BudgetChartsProps {
  budgets: BudgetWithStats[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
  }>;
  label?: string;
  formatCurrency: (v: number) => string;
}

const CustomTooltip = ({ active, payload, label, formatCurrency }: CustomTooltipProps) => {
  if (active && payload && payload.length >= 2) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3 text-sm space-y-1">
        <p className="font-semibold text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-primary">Limit: {formatCurrency(Number(payload[0].value))}</p>
        <p className="text-red-500">Spent: {formatCurrency(Number(payload[1].value))}</p>
      </div>
    );
  }
  return null;
};

export function BudgetCharts({ budgets }: BudgetChartsProps) {
  const { format: formatCurrency, currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);

  const chartData = budgets.map(b => ({
    name: b.category,
    limit: b.monthlyLimit,
    spent: b.spent,
  })).sort((a, b) => b.limit - a.limit);

  if (budgets.length === 0) return null;

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="text-border opacity-40" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 10 }} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `${symbol}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 10 }} 
              width={80}
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs uppercase tracking-wider">{v}</span>} />
            <Bar dataKey="limit" name="Limit" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="spent" name="Actual" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

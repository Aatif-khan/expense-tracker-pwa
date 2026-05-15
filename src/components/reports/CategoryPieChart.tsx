"use client";

import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PieSlice } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

interface CategoryPieChartProps { data: PieSlice[] }

const CustomTooltip = ({ active, payload, formatCurrency }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as PieSlice;
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3 text-sm">
        <p className="font-semibold mb-1">{item.name}</p>
        <p className="text-muted-foreground">{formatCurrency(item.value)}</p>
      </div>
    );
  }
  return null;
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { format: formatCurrency } = useCurrency();

  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          No expense data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

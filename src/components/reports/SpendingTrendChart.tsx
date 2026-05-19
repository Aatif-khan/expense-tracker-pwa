"use client";

import React from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { TrendPoint } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { getCurrencySymbol } from "@/lib/currency";

interface SpendingTrendChartProps { data: TrendPoint[] }

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
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3 text-sm">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold text-red-500">
          {typeof value === "number" ? formatCurrency(value) : value}
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const { format: formatCurrency, currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  const hasData = data && data.some((d) => d.amount > 0);
  const visibleData = data ? data.slice(-20) : []; // show max 20 points

  if (!hasData) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          No spending data for selected period
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Spending Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={visibleData}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-40" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${symbol}${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
            />
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Area
              type="monotone"
              dataKey="amount"
              name="Spending"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

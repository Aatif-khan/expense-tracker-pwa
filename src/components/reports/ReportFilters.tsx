"use client";

import { ReportPeriod } from "@/lib/analytics";
import { DateRange } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportFiltersProps {
  period: ReportPeriod;
  setPeriod: (p: ReportPeriod) => void;
  customRange: DateRange;
  setCustomRange: (r: DateRange) => void;
}

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: "Today",   value: "daily"   },
  { label: "Week",    value: "weekly"  },
  { label: "Month",   value: "monthly" },
  { label: "Year",    value: "yearly"  },
  { label: "Custom",  value: "custom"  },
];

export function ReportFilters({ period, setPeriod, customRange, setCustomRange }: ReportFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Period toggle pills */}
      <div className="flex gap-2 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              period === p.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date pickers */}
      {period === "custom" && (
        <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-200">
          {/* From */}
          <Popover>
            <PopoverTrigger render={
              <Button variant="outline" className={cn("justify-start text-left font-normal h-9 text-sm", !customRange.from && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customRange.from ? format(customRange.from, "dd MMM yyyy") : "Start date"}
              </Button>
            } />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customRange.from}
                onSelect={(d) => d && setCustomRange({ ...customRange, from: d })}
              />
            </PopoverContent>
          </Popover>

          <span className="self-center text-muted-foreground text-sm">→</span>

          {/* To */}
          <Popover>
            <PopoverTrigger render={
              <Button variant="outline" className={cn("justify-start text-left font-normal h-9 text-sm", !customRange.to && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customRange.to ? format(customRange.to, "dd MMM yyyy") : "End date"}
              </Button>
            } />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customRange.to}
                onSelect={(d) => d && setCustomRange({ ...customRange, to: d })}
                disabled={(d) => d < customRange.from}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

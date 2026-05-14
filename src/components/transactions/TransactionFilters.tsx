import { CATEGORIES, ACCOUNT_TYPES, TRANSACTION_TYPES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export interface FilterState {
  type: string;
  account: string;
  category: string;
  dateRange?: DateRange;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string | null) => {
    onFilterChange({ ...filters, [key]: !value || value === "ALL" ? "" : value });
  };

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      <Select value={filters.type || null} onValueChange={(val) => handleChange("type", val)}>
        <SelectTrigger className="w-[120px] shrink-0 h-9 bg-background">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {TRANSACTION_TYPES.map(t => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.account || null} onValueChange={(val) => handleChange("account", val)}>
        <SelectTrigger className="w-[130px] shrink-0 h-9 bg-background">
          <SelectValue placeholder="Account" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Accounts</SelectItem>
          {ACCOUNT_TYPES.map(a => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.category || null} onValueChange={(val) => handleChange("category", val)}>
        <SelectTrigger className="w-[140px] shrink-0 h-9 bg-background">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {CATEGORIES.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="sm" className="h-9 shrink-0 bg-background text-xs font-normal">
              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd")} - {format(filters.dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd")
                )
              ) : (
                "Date Range"
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={filters.dateRange?.from}
            selected={filters.dateRange}
            onSelect={(range) => onFilterChange({ ...filters, dateRange: range })}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

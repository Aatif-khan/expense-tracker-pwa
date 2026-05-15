"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, icon, children, className }: SettingsSectionProps) {
  return (
    <section className={cn("rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2.5">
        {icon && (
          <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </section>
  );
}

interface SettingsRowProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsRow({ label, hint, children, className }: SettingsRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-4 py-3.5", className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

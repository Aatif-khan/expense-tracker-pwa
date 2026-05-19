"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Simplified Toast component for the PWA.
 * Provides ToastProvider, ToastViewport, Toast, ToastTitle, and ToastDescription.
 */

function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ToastViewport({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none", className)}>
      {children}
    </div>
  );
}

interface ToastProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

function Toast({
  children,
  variant = "default",
  className,
}: ToastProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all duration-300 mb-2",
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95",
        variant === "default" ? "bg-background border-border text-foreground" : "bg-destructive border-destructive text-destructive-foreground",
        className
      )}
    >
      <div className="grid gap-1">
        {children}
      </div>
    </div>
  );
}

function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
};

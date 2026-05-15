"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

export function Toast({ message, type }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : Info;

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        type === "success" && "bg-emerald-950/90 border-emerald-800 text-emerald-300",
        type === "error"   && "bg-red-950/90 border-red-800 text-red-300",
        type === "info"    && "bg-slate-900/90 border-slate-700 text-slate-300"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

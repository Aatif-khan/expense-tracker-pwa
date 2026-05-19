"use client";

import { useEffect, useRef } from "react";
import { processRecurringTransactions } from "@/lib/recurrence";

export function RecurringProcessor() {
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    
    // Run the recurrence engine once on boot to generate missing transactions
    processRecurringTransactions().catch(err => {
      console.error("Failed to process recurring transactions:", err);
    });
  }, []);

  return null;
}

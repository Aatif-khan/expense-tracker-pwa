"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, PlusCircle, Settings, Target } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/stats", label: "Stats", icon: PieChart },
    { href: "/budgets", label: "Budgets", icon: Target },
    { href: "/add", label: "Add", icon: PlusCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/40 pb-safe shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-primary rounded-b-full animate-in fade-in slide-in-from-top-1"></span>
              )}
              <div className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive ? "text-primary -translate-y-0.5" : "text-muted-foreground hover:text-foreground hover:-translate-y-0.5"
              }`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useSettingsStore } from "@/lib/settingsStore";
import { Button } from "@/components/ui/button";
import { Wallet, PieChart, Repeat, ShieldCheck, ArrowRight } from "lucide-react";

export function WelcomeScreen() {
  const setPreference = useSettingsStore((s) => s.setPreference);

  const handleGetStarted = async () => {
    await setPreference("hasCompletedOnboarding", true);
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Offline-First Privacy",
      desc: "All your financial data is securely stored on your local device. No clouds, no tracking.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: PieChart,
      title: "Smart Analytics",
      desc: "Visualize your spending patterns with beautiful charts and track your monthly budgets.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Repeat,
      title: "Automated Recurring",
      desc: "Set up subscriptions and salaries once. We'll automatically log them when they are due.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12 md:pt-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 shadow-inner">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome to Expenses</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
              Your personal, offline-first finance companion. Take control of your money with zero friction.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${150 + (i * 100)}ms`, animationFillMode: 'both' }}>
                <div className={`p-3 rounded-2xl ${f.bg} ${f.color} shrink-0`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Install Hint */}
          <div className="bg-muted/50 rounded-2xl p-4 text-center border border-border/50 animate-in fade-in duration-700 delay-500 fill-mode-both">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Pro Tip</p>
            <p className="text-sm">Install this app to your home screen using your browser&apos;s <span className="font-semibold text-foreground">&quot;Add to Home Screen&quot;</span> option for the best native experience.</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pb-safe">
        <div className="max-w-md mx-auto">
          <Button 
            size="lg" 
            className="w-full h-14 text-base font-semibold rounded-full shadow-lg shadow-primary/25 transition-transform active:scale-95 group"
            onClick={handleGetStarted}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

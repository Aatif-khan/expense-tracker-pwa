import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import { SettingsHydrator } from "@/components/settings/SettingsHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Expenses | Premium Personal Finance Tracker",
    template: "%s | Expenses",
  },
  description: "A fast, offline-first personal expense tracker. Manage budgets, track spending, and view insights natively on your device.",
  keywords: ["expense tracker", "budget planner", "finance", "offline PWA", "money management"],
  authors: [{ name: "Developer" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Expenses",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://expenses-tracker-pwa.vercel.app/",
    title: "Expenses | Premium Personal Finance Tracker",
    description: "Take control of your money with zero friction. A premium, offline-first personal finance application.",
    siteName: "Expenses App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expenses | Premium Personal Finance Tracker",
    description: "Take control of your money with zero friction. A premium, offline-first personal finance application.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

import { RecurringProcessor } from "@/components/recurring/RecurringProcessor";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";
import { PWAUpdateToast } from "@/components/layout/PWAUpdateToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Hydrate settings from IndexedDB on boot */}
          <SettingsHydrator />
          <RecurringProcessor />
          <OfflineIndicator />
          <PWAInstallPrompt />
          <PWAUpdateToast />
          <main className="flex-1 pb-16">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

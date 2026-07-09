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
    default: "CashLoom | Premium Personal Finance Tracker",
    template: "%s | CashLoom",
  },
  description: "CashLoom is an offline-first personal finance Progressive Web App that helps you track income and expenses, manage budgets, monitor recurring transactions, analyze spending with interactive reports, and keep complete control of your financial data. All data is stored locally on your device using IndexedDB, ensuring privacy, speed, and offline access.",
  keywords: ["expense tracker", "budget planner", "finance", "offline PWA", "money management"],
  authors: [{ name: "Developer" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CashLoom",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cashloom.vercel.app/",
    title: "CashLoom | Premium Personal Finance Tracker",
    description: "CashLoom is an offline-first personal finance Progressive Web App that helps you track income and expenses, manage budgets, monitor recurring transactions, analyze spending with interactive reports, and keep complete control of your financial data.",
    siteName: "CashLoom App",
  },
  twitter: {
    card: "summary_large_image",
    title: "CashLoom | Premium Personal Finance Tracker",
    description: "CashLoom is an offline-first personal finance Progressive Web App that helps you track income and expenses, manage budgets, monitor recurring transactions, analyze spending with interactive reports, and keep complete control of your financial data.",
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

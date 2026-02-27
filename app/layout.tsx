import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";
import { SyncProvider } from "@/lib/sync-context";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hanka - AI Agent Skills Management System",
  description: "A GitHub-backed library for your LLM skill files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} dark`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <NextTopLoader showSpinner={false} shadow={false} />
        <TooltipProvider>
          <SyncProvider>{children}</SyncProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

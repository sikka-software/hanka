import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased">
        <NextTopLoader showSpinner={false} shadow={false} />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

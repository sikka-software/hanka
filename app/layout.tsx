import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

const fraunces = Fraunces({ 
  subsets: ["latin"], 
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
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
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} dark`}>
      <body className="antialiased font-sans">
        <NextTopLoader showSpinner={false} shadow={false} />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

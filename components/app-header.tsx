"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
};

export default function AppHeader({ children, className, actions }: Props) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b px-4",
        className,
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2" />
      {children && <div className="flex-1">{children}</div>}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { HankaUser } from "@/lib/auth";

type Props = {
  user: HankaUser | null;
};

export function AuthButton({ user }: Props) {
  if (user) {
    return (
      <Button
        variant="outline"
        className="rounded-sm border-white/10 hover:border-white text-white/60 hover:text-white"
      >
        <Link href="/dashboard">DASHBOARD</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="rounded-sm border-white/10 hover:border-white text-white/60 hover:text-white"
    >
      <Link href="/auth/signin">SIGN IN</Link>
    </Button>
  );
}

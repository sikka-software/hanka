"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppHeader from "@/components/app-header";

type Props = {
  user: { login: string; name?: string | null };
  repo: string | null;
};

export default function SettingsClient({ user, repo }: Props) {
  const router = useRouter();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const handleChangeRepo = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/onboarding");
  };

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
  };

  return (
    <>
      <AppHeader>
        <h1 className="text-lg font-semibold">Settings</h1>
      </AppHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Account</h2>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={`https://github.com/${user.login}.png`}
                  alt={user.login}
                />
                <AvatarFallback>
                  {user.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name || user.login}</p>
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  className="text-sm text-muted-foreground"
                >
                  @{user.login}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Connected Repository</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {repo ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{repo}</p>
                    <a
                      href={`https://github.com/${user.login}/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      View on GitHub
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleChangeRepo}
                  >
                    Change repo
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No repository connected.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Danger Zone</h2>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setShowSignOutDialog(true)}
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again
              to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

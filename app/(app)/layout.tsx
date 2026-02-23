import { redirect } from "next/navigation";
import { getUserFromCookies, getRepoFromCookies } from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookies();
  const repo = await getRepoFromCookies();

  if (!user) {
    redirect("/auth/signin");
  }

  if (!repo) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="flex flex-col">{children}</SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

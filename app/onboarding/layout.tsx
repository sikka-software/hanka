import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookies();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <>
      {children}
      <Toaster />

      <script
        dangerouslySetInnerHTML={{
          __html: `window.HANKA_USERNAME = ${JSON.stringify(user.login)}`,
        }}
      />
    </>
  );
}

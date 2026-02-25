import { Button } from "@/components/ui/button";
import HankaLogo from "@/components/hanka-logo";
import { GitHub } from "@/components/icons/github";
import { getUserFromCookies } from "@/lib/auth";
import { AuthButton } from "@/components/auth-button";
import { LandingContent } from "@/components/landing-content";
import { Badge } from "@/components/ui/badge";

async function getGitHubStars(owner: string, repo: string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export default async function LandingPage() {
  const [user, stars] = await Promise.all([
    getUserFromCookies(),
    getGitHubStars("sikka-software", "hanka"),
  ]);

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4 relative">
          <HankaLogo className="h-6" />
          <Badge className="scale-70 absolute inset-e-0 translate-x-12.5 -translate-y-3">BETA</Badge>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/sikka-software/hanka" target="_blank">
            <Button
              variant="outline"
              className="rounded-sm gap-2 border-white/10 hover:border-white hover:bg-white hover:text-black"
            >
              <span className="text-white text-xs">{stars}</span>
              <GitHub className="w-4 h-4" />
            </Button>
          </a>
          <AuthButton user={user} />
        </div>
      </nav>

      <LandingContent user={user} />
    </main>
  );
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[120px_120px]" />
    </div>
  );
}

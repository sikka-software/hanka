import Link from "next/link";
import { Button } from "@/components/ui/button";
import HankaLogo from "@/components/hanka-logo";
import { GitHub } from "@/components/icons/github";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <nav className="flex items-center justify-between px-8 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <HankaLogo className="h-5" />
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">
            beta
          </span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <a href="http://github.com/sikka-software/hanka" target="_blank">
            <Button variant="outline" size={"icon"}>
              <GitHub />
            </Button>
          </a>
          <Button variant="outline">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6">
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl">
          Your AI agent skills, organized.
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl">
          A GitHub-backed library for your LLM skill files. Open source.
          Self-hostable. CLI-first.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/auth/signin">Sign in with GitHub</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-8 pb-24">
        {[
          {
            title: "GitHub-backed",
            desc: "Every skill is a markdown file in your own GitHub repo. You own your data.",
          },
          {
            title: "Private repo support",
            desc: "Keep your skills private. CLI authenticates via GitHub Device Flow.",
          },
          {
            title: "CLI-first",
            desc: "npx hanka-cli add username/skill — pull any skill in seconds.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="border border-neutral-800 rounded-lg p-6 bg-neutral-900"
          >
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-neutral-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center py-8 text-neutral-500 text-sm border-t border-neutral-800">
        <a
          href="https://github.com/sikka-software/hanka"
          className="hover:text-neutral-300"
        >
          Open source · MIT License
        </a>
      </footer>
    </main>
  );
}

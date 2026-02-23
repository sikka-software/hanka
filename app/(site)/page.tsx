"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import HankaLogo from "@/components/hanka-logo";
import { GitHub } from "@/components/icons/github";
import { Terminal, Github, Lock, ArrowRight, Folder, Tag, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return mounted;
}

const features = [
  {
    icon: Github,
    title: "GitHub-backed",
    description: "Every skill is a markdown file in your own GitHub repository. You own your data completely.",
  },
  {
    icon: Lock,
    title: "Private Repos",
    description: "Keep skills private. CLI authenticates via GitHub Device Flow for seamless access.",
  },
  {
    icon: Terminal,
    title: "CLI-first",
    description: "Use Vercel's skills CLI to pull any skill in seconds. Install with one command.",
  },
  {
    icon: Folder,
    title: "Dashboard",
    description: "Manage all your skills through a beautiful web interface. Create, edit, and organize.",
  },
  {
    icon: Clock,
    title: "Version Tracking",
    description: "Track skill versions and update history. Never lose track of changes.",
  },
  {
    icon: Tag,
    title: "Categories & Tags",
    description: "Organize skills with categories and tags. Make them discoverable.",
  },
];

const techStack = [
  "Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Octokit", "CodeMirror"
];

const skillExample = [
  { text: "---", color: "text-white/30" },
  { text: "name: expert-coder", color: "text-white" },
  { text: "description: An expert coding assistant", color: "text-white/60" },
  { text: "license: MIT", color: "text-white/40" },
  { text: "compatibility: openai/anthropic", color: "text-white/40" },
  { text: "metadata:", color: "text-white/40" },
  { text: "  tags: [coding, debugging]", color: "text-white/60" },
  { text: "  category: development", color: "text-white/60" },
  { text: "  version: 1.0.0", color: "text-white/60" },
  { text: "---", color: "text-white/30" },
  { text: "", color: "" },
  { text: "# Expert Coder", color: "text-white/80" },
  { text: "", color: "" },
  { text: "You are an expert programmer...", color: "text-white/50" },
];

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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px]" />
    </div>
  );
}

function Marquee() {
  const mounted = useMounted();
  
  return (
    <div className={`overflow-hidden py-4 border-y border-white/10 transition-all duration-1000 delay-100 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-5xl md:text-6xl font-serif text-white/[0.06] mx-12">
            AI AGENT SKILLS MANAGEMENT SYSTEM
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const mounted = useMounted();

  return (
    <section className="relative min-h-[90vh] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div
                className={`inline-block px-4 py-1.5 rounded-full border border-white/15 text-white/50 text-xs font-mono mb-10 transition-all duration-700 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                OPEN SOURCE · MIT LICENSE
              </div>

              <h1
                className={`text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] font-serif font-bold tracking-tight mb-10 transition-all duration-1000 delay-100 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ fontFamily: "var(--font-syne)" }}
              >
                <span className="text-white block">YOUR AI</span>
                <span className="text-white/30 block ml-0 lg:ml-28">AGENT</span>
                <span className="text-white block">SKILLS.</span>
              </h1>

              <p
                className={`text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 mb-12 leading-relaxed transition-all duration-1000 delay-200 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                A platform for sharing and managing AI agent skills. Store your reusable agent skills in a GitHub repository and share them with the world.
              </p>

              <div
                className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-1000 delay-300 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-none"
                >
                  <Link href="/auth/signin">
                    <span>GET STARTED</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <a
                  href="https://github.com/sikka-software/hanka"
                  target="_blank"
                  className={clsx(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-14 px-8 rounded-none border-white/20 text-white/60 hover:text-white hover:border-white",
                  )}
                >
                  <GitHub className="w-5 h-5 mr-2" />
                  <span>VIEW ON GITHUB</span>
                </a>
              </div>

              <div
                className={`mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-white/30 font-mono transition-all duration-1000 delay-400 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span>VERCEL SKILLS COMPATIBLE</span>
                <span className="hidden md:inline">·</span>
                <span>NPM PACKAGE</span>
                <span className="hidden md:inline">·</span>
                <span>PUBLIC & PRIVATE</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div
                className={`relative transition-all duration-1000 delay-500 ease-out ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
              >
                <div className="absolute -top-16 -left-16 w-40 h-40 border border-white/8 rounded-full" />
                <div className="absolute top-1/3 -right-12 w-32 h-32 border border-white/8" style={{ transform: "rotate(45deg)" }} />
                <div className="absolute -bottom-12 left-1/4 w-20 h-20 bg-white/[0.03] rounded-full" />
                <div className="absolute top-0 right-10 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-20 left-0 w-2 h-2 bg-white/10" />
                
                <div className="relative bg-white/[0.02] border border-white/10 p-8 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <span className="ml-3 text-xs text-white/30 font-mono">terminal</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-white/40"># Install a skill</div>
                    <div className="text-white">$ npx skills add user/repo</div>
                    <div className="text-white/50 mt-3">→ Skill added!</div>
                    <div className="text-white/50">→ Dependencies resolved</div>
                    <div className="my-4 border-t border-white/5 pt-4" />
                    <div className="text-white/40"># List your skills</div>
                    <div className="text-white">$ npx skills list</div>
                    <div className="text-white/50 mt-2">→ expert-coder</div>
                    <div className="text-white/50">→ code-reviewer</div>
                    <div className="text-white/50">→ bug-hunter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  );
}

function Features() {
  const mounted = useMounted();

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-16 transition-all duration-1000 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-xs font-mono text-white/30 mb-4">FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
            Everything you need to<br />manage AI agent skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative p-10 bg-black transition-all duration-700 ease-out ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${400 + index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="w-14 h-14 flex items-center justify-center mb-8 border border-white/15 group-hover:border-white transition-all duration-300 rounded-sm">
                    <Icon className="w-6 h-6 text-white/50 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-serif text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/45 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillFormat() {
  const mounted = useMounted();

  return (
    <section className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 delay-200 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-xs font-mono text-white/30 mb-4">SKILL FORMAT</div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight">
              Simple markdown<br />with YAML frontmatter
            </h2>
            <p className="text-white/45 leading-relaxed mb-8">
              Skills are stored as markdown files. Just define metadata in the frontmatter and write your skill instructions below. That&apos;s it.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">YAML</span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">Markdown</span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">OpenAI</span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">Anthropic</span>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-400 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 border border-white/8 rotate-12" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white/8 rounded-full" />
            
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-xs text-white/30">expert-coder.md</span>
              </div>
              <div className="space-y-1.5">
                {skillExample.map((line, i) => (
                  <div key={i} className={line.color}>{line.text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const mounted = useMounted();

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-xs font-mono text-white/30 mb-8">POWERED BY</div>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <span
                key={tech}
                className="px-5 py-2.5 text-sm font-mono text-white/50 border border-white/10 rounded-sm hover:border-white/30 hover:text-white/70 transition-all duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BigType() {
  const mounted = useMounted();
  
  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-1000 delay-300 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-[14vw] leading-[0.75] font-serif font-bold text-white/[0.03] text-center tracking-tighter">
            SKILLS
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-white/20 text-xs font-mono">VERSION 1.0</div>
            <div className="text-white/20 text-xs font-mono">GITHUB BACKED</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const mounted = useMounted();

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            Get started now
          </h2>
          <p className="text-white/45 text-lg mb-10 leading-relaxed">
            Join developers worldwide who are sharing and managing their AI agent skills with Hanka.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-none"
            >
              <Link href="/auth/signin">
                <span>SIGN IN WITH GITHUB</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center gap-4">
            <HankaLogo className="h-6" />
            <span className="text-white/40 text-sm">OPEN SOURCE · MIT LICENSE</span>
          </div>
          
          <div className="md:text-center">
            <a
              href="https://github.com/sikka-software/hanka"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-3 text-sm font-mono"
            >
              <GitHub className="w-5 h-5" />
              <span>GITHUB</span>
            </a>
          </div>

          <div className="md:text-right">
            <span className="text-white/20 text-xs font-mono">© 2024 HANKA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <HankaLogo className="h-6" />
          <span className="text-xs font-mono text-white/40">BETA</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/sikka-software/hanka" target="_blank">
            <Button
              variant="outline"
              size="icon"
              className="rounded-sm border-white/10 hover:border-white hover:bg-white hover:text-black"
            >
              <GitHub className="w-4 h-4" />
            </Button>
          </a>
          <Button
            variant="outline"
            className="rounded-sm border-white/10 hover:border-white text-white/60 hover:text-white"
          >
            <Link href="/auth/signin">SIGN IN</Link>
          </Button>
        </div>
      </nav>

      <Hero />
      <Features />
      <SkillFormat />
      <TechStack />
      <BigType />
      <CTA />
      <Footer />
    </main>
  );
}

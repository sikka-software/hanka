"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import HankaLogo from "@/components/hanka-logo";
import { GitHub } from "@/components/icons/github";
import { Terminal, Github, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
    description: "Every skill is a markdown file in your own GitHub repo. You own your data.",
  },
  {
    icon: Lock,
    title: "Private repo support",
    description: "Keep your skills private. CLI authenticates via GitHub Device Flow.",
  },
  {
    icon: Terminal,
    title: "CLI-first",
    description: "npx skills add username/repo —skill [skill name] to pull any skill in seconds.",
  },
];

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0908]" />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

function CodeDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.015]">
      <div className="absolute top-[15%] left-[5%] font-mono text-xs leading-relaxed text-amber-500">
        <div>{`const skill = {`}</div>
        <div className="pl-4">{`name: "expert-coder",`}</div>
        <div className="pl-4">{`version: "1.0.0",`}</div>
        <div className="pl-4">{`capabilities: ["code", "debug"]`}</div>
        <div>{`}`}</div>
      </div>
      <div className="absolute top-[40%] right-[8%] font-mono text-xs leading-relaxed text-orange-500/60">
        <div>{`// Load skills`}</div>
        <div>{`const skills = await hanka.fetch()`}</div>
        <div className="pl-4">{`// → 42 skills loaded`}</div>
      </div>
      <div className="absolute bottom-[25%] left-[12%] font-mono text-xs leading-relaxed text-amber-600/50">
        <div>{`npx skills add \\`}</div>
        <div className="pl-4">{`  username/repo \\`}</div>
        <div className="pl-4">{`  --skill expert-writer`}</div>
      </div>
    </div>
  );
}

function Hero() {
  const mounted = useMounted();

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-32">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/80 text-xs font-medium mb-8 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Open source · MIT License</span>
        </div>

        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-8 leading-[1.1] transition-all duration-1000 delay-100 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          <span className="text-amber-100/90">Your AI agent</span>
          <br />
          <span className="text-amber-50">skills, organized.</span>
        </h1>

        <p 
          className={`text-lg md:text-xl text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          A GitHub-backed library for your LLM skill files. 
          <span className="text-neutral-300"> Open source.</span> 
          <span className="text-neutral-300"> Self-hostable.</span> 
          <span className="text-neutral-300"> CLI-first.</span>
        </p>

        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button 
            asChild 
            size="lg" 
            className="h-12 px-8 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-neutral-900 border-0 gap-2 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
          >
            <Link href="/auth/signin">
              <span>Sign in with GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <a 
            href="https://github.com/sikka-software/hanka" 
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <GitHub className="w-4 h-4 mr-2" />
            <span>View on GitHub</span>
          </a>
        </div>

        <div 
          className={`mt-16 inline-flex items-center gap-6 text-xs text-neutral-500 font-mono transition-all duration-1000 delay-500 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            CLI Ready
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            npm install -g hanka
          </span>
        </div>
      </div>

      <CodeDecor />
    </section>
  );
}

function Features() {
  const mounted = useMounted();

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/50 hover:border-amber-500/20 transition-all duration-500 ease-out ${
                  mounted 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  transitionDelay: `${600 + index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/5 group-hover:to-amber-500/5 transition-all duration-500" />
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800/60 flex items-center justify-center mb-5 group-hover:bg-amber-500/10 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
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

function CLIDemo() {
  const mounted = useMounted();

  const codeLines = [
    { text: "# Install the CLI", color: "text-neutral-500" },
    { text: "$ npm install -g hanka", color: "text-amber-400" },
    { text: "", color: "" },
    { text: "# Add a skill from any GitHub repo", color: "text-neutral-500" },
    { text: "$ hanka add sikka-software/hanka --skill expert-coder", color: "text-neutral-200" },
    { text: "", color: "" },
    { text: "✓ Skill added successfully!", color: "text-green-400" },
    { text: "✓ 12 dependencies resolved", color: "text-green-400" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div 
          className={`rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl overflow-hidden transition-all duration-1000 delay-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-4 text-xs text-neutral-500 font-mono">terminal</span>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed">
            {codeLines.map((line, i) => (
              <div 
                key={i} 
                className={`transition-all duration-500 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ 
                  transitionDelay: `${900 + i * 80}ms`,
                }}
              >
                <span className={line.color}>{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-neutral-800/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <HankaLogo className="h-5" />
          <span className="text-sm text-neutral-500">
            Open source · MIT License
          </span>
        </div>
        <a 
          href="https://github.com/sikka-software/hanka" 
          target="_blank"
          className="text-sm text-neutral-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2"
        >
          <GitHub className="w-4 h-4" />
          <span>github.com/sikka-software/hanka</span>
        </a>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-neutral-950/50 border-b border-neutral-800/30">
        <div className="flex items-center gap-3">
          <HankaLogo className="h-5" />
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/sikka-software/hanka" target="_blank">
            <Button variant="ghost" size="icon-xs" className="text-neutral-400 hover:text-amber-400">
              <GitHub className="w-4 h-4" />
            </Button>
          </a>
          <Button variant="outline" size="sm" className="border-neutral-700 hover:border-amber-500/50">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </div>
      </nav>

      <Hero />
      <Features />
      <CLIDemo />
      <Footer />
    </main>
  );
}

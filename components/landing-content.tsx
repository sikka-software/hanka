"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HankaLogo from "@/components/hanka-logo";
import { GitHub } from "@/components/icons/github";
import {
  Terminal,
  Github,
  Lock,
  ArrowRight,
  Folder,
  Tag,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { HankaUser } from "@/lib/auth";
import clsx from "clsx";
import { Marquee } from "@/components/ui/marquee";
import SkillCard from "@/components/skill-card-dummy";
import type { SkillIndex } from "@/lib/skills";

type Props = {
  user: HankaUser | null;
};

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
    description:
      "Every skill is a markdown file in your own GitHub repository. You own your data completely.",
  },
  {
    icon: Lock,
    title: "Private Repos",
    description:
      "Keep skills private. CLI authenticates via GitHub Device Flow for seamless access.",
    soon: true,
  },
  {
    icon: Terminal,
    title: "CLI-first",
    description:
      "Use Vercel's skills CLI to pull any skill in seconds. Install with one command.",
  },
  {
    icon: Folder,
    title: "Dashboard",
    description:
      "Manage all your skills through a beautiful web interface. Create, edit, and organize.",
  },
  {
    icon: Clock,
    title: "Version Tracking",
    description:
      "Track skill versions and update history. Never lose track of changes.",
  },
  {
    icon: Tag,
    title: "Categories & Tags",
    description:
      "Organize skills with categories and tags. Make them discoverable.",
  },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Octokit",
  "CodeMirror",
];

const categories = [
  "AI Agents",
  "Code Review",
  "Data Processing",
  "Automation",
  "DevOps",
  "Security",
  "Testing",
  "Analytics",
];

const tags = [
  "ai",
  "machine-learning",
  "automation",
  "productivity",
  "cli",
  "api",
  "webhook",
  "integration",
  "python",
  "javascript",
  "typescript",
  "bash",
  "docker",
  "kubernetes",
  "security",
  "testing",
  "monitoring",
  "analytics",
  "data",
  "pipeline",
];

const skillNames = [
  "Code Review Assistant",
  "SQL Query Optimizer",
  "API Documentation Generator",
  "Image Background Remover",
  "Text Sentiment Analyzer",
  "JSON Schema Validator",
  "Git Branch Cleaner",
  "Docker Container Manager",
  "Log File Analyzer",
  "PDF Text Extractor",
  "URL Metadata Fetcher",
  "CSV to JSON Converter",
  "Markdown to HTML Converter",
  "Base64 Encoder/Decoder",
  "Hash Generator",
  "Cron Expression Parser",
  "JWT Token Decoder",
  "Environment Variable Validator",
  "SSH Key Generator",
  "SSL Certificate Checker",
  "Webhook Debugger",
  "API Rate Limiter",
  "Request Throttler",
  "Cache Warmer",
  "Sitemap Generator",
  "RSS Feed Reader",
];

const descriptions = [
  "Automatically analyzes code and provides detailed feedback on best practices, potential bugs, and optimization opportunities.",
  "Optimizes slow SQL queries by analyzing execution plans and suggesting index improvements and query refactoring.",
  "Generates beautiful, interactive API documentation from OpenAPI specs with examples and playground.",
  "Uses advanced AI to remove backgrounds from images with a single command line call.",
  "Analyzes text content and returns sentiment scores, emotional patterns, and key phrases.",
  "Validates JSON documents against JSON Schema specifications with detailed error reporting.",
  "Safely removes merged branches from your git repository while preserving important work.",
  "Simplifies docker container management with intuitive commands for starting, stopping, and monitoring.",
  "Parses log files and identifies patterns, errors, and performance bottlenecks.",
  "Extracts text content from PDF documents while preserving formatting and structure.",
  "Fetches metadata from URLs including title, description, images, and Open Graph tags.",
  "Converts CSV files to JSON with customizable field mapping and nested structure support.",
  "Converts Markdown documents to clean HTML with syntax highlighting and custom styling.",
  "Encode and decode Base64 strings with support for binary files and URL-safe variants.",
  "Generate cryptographic hashes using MD5, SHA-1, SHA-256, and other algorithms.",
  "Parse and validate cron expressions with human-readable explanations of schedules.",
  "Decode JWT tokens and inspect claims, expiration, and signature information.",
  "Validates environment variables against schemas and provides type coercion.",
  "Generates secure SSH key pairs with optional passphrase and multiple key types.",
  "Checks SSL certificate validity, expiration, and chain of trust for domains.",
  "Debugs webhook payloads with request/response logging and replay functionality.",
  "Implements token bucket algorithm for API rate limiting with configurable limits.",
  "Throttles API requests to respect rate limits and prevent 429 errors.",
  "Warms up cache by pre-fetching and populating frequently accessed data.",
  "Generates XML sitemaps for SEO with configurable priority and change frequency.",
  "Parses and filters RSS feeds with support for Atom and RSS 2.0 formats.",
];

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateRandomSkill(index: number): SkillIndex {
  const name = skillNames[index % skillNames.length];
  const numTags = 2 + Math.floor(Math.random() * 3);
  const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
  const selectedTags = shuffledTags.slice(0, numTags);

  const created = randomDate(new Date(2024, 0, 1), new Date(2024, 6, 1));
  const updated = randomDate(created, new Date());

  return {
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    filePath: `skills/${name.toLowerCase().replace(/\s+/g, "-")}/SKILL.md`,
    name,
    description: descriptions[index % descriptions.length],
    tags: selectedTags,
    category: categories[index % categories.length],
    version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    public: true,
    created: created.toISOString(),
    updated: updated.toISOString(),
  };
}

const mockSkills: SkillIndex[] = Array.from({ length: 18 }, (_, i) =>
  generateRandomSkill(i),
);

const leftColumn = mockSkills.filter((_, i) => i % 3 === 0);
const centerColumn = mockSkills.filter((_, i) => i % 3 === 1);
const rightColumn = mockSkills.filter((_, i) => i % 3 === 2);

export function MarqueeDemoVertical() {
  return (
    <div className="relative flex bg--400 max-h-screen w-full flex-row items-center justify-center overflow-clip scale30">
      <Marquee vertical className="min-w-100  [--duration:50s]">
        {leftColumn.map((skill, i) => (
          <SkillCard skill={skill} key={i} username="hanka" repoName="skills" />
        ))}
      </Marquee>

      <Marquee reverse={true} vertical className="min-w-100 [--duration:50s]">
        {centerColumn.map((skill, i) => (
          <SkillCard skill={skill} key={i} username="hanka" repoName="skills" />
        ))}
      </Marquee>

      <Marquee vertical className="min-w-100 [--duration:50s]">
        {rightColumn.map((skill, i) => (
          <SkillCard skill={skill} key={i} username="hanka" repoName="skills" />
        ))}
      </Marquee>

      <Marquee vertical reverse className="min-w-100 [--duration:50s]">
        {leftColumn.map((skill, i) => (
          <SkillCard skill={skill} key={i} username="hanka" repoName="skills" />
        ))}
      </Marquee>

      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t"></div>
    </div>
  );
}

function Hero({ user }: Props) {
  const mounted = useMounted();
  const ctaLink = user ? "/dashboard" : "/auth/signin";
  const ctaText = user ? "GO TO DASHBOARD" : "GET STARTED";

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* <div className="absolute -top-[200px] -bottom-[200px] right-0 w-[900px] bg-black">
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l" />
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b" />
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t" />

        <div className="flex h-full pt-48 pb-48">
          <div className="w-[280px] shrink-0">
            <Marquee vertical pauseOnHover className="h-full">
              {leftColumn.map((skill) => (
                <div key={skill.slug} className="py-2">
                  <SkillCard skill={skill} username="hanka" repoName="skills" />
                </div>
              ))}
            </Marquee>
          </div>
          <div className="w-[280px] shrink-0">
            <Marquee vertical reverse pauseOnHover className="h-full">
              {centerColumn.map((skill) => (
                <div key={skill.slug} className="py-2">
                  <SkillCard skill={skill} username="hanka" repoName="skills" />
                </div>
              ))}
            </Marquee>
          </div>
          <div className="w-[280px] shrink-0">
            <Marquee vertical pauseOnHover className="h-full">
              {rightColumn.map((skill) => (
                <div key={skill.slug} className="py-2">
                  <SkillCard skill={skill} username="hanka" repoName="skills" />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div> */}
      <div className="md:block hidden absolute bg--500 scale-70  w-fit opacity-50 inset-s-10 h-screen bg--300">
        <MarqueeDemoVertical />
      </div>
      {/* Hero text */}
      <div className="flex-1 relative bg--400 flex items-center justify-center px-6 py-24">
        <div className="size-150 bg--500 bg-black blur-3xl absolute translae--1/2 -translate-x-80"></div>
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div
                className={`inline-block px-4 py-1.5 rounded-full border border-white/15 text-white/50 text-xs font-mono mb-10 transition-all duration-700 ease-out ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                OPEN SOURCE · MIT LICENSE
              </div>

              <h1
                className={`text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] font-serif font-bold tracking-tight mb-10 transition-all duration-1000 delay-100 ease-out ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ fontFamily: "var(--font-syne)" }}
              >
                <span className="text-white block">YOUR AI</span>
                <span className="text-white/30 block ml-0">AGENT</span>
                <span className="text-white block">SKILLS.</span>
              </h1>

              <p
                className={`text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 mb-12 leading-relaxed transition-all duration-1000 delay-200 ease-out ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                A platform for sharing and managing AI agent skills. Store your
                reusable agent skills in a GitHub repository and share them with
                the world.
              </p>

              <div
                className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-1000 delay-300 ease-out ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-none"
                >
                  <Link href={ctaLink}>
                    <span>{ctaText}</span>
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
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span>VERCEL SKILLS COMPATIBLE</span>
                <span className="hidden md:inline">·</span>
                <span>NPM PACKAGE</span>
                <span className="hidden md:inline">·</span>
                <span>PUBLIC & PRIVATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            Everything you need to
            <br />
            manage AI agent skills
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
                <div className="relative">
                  <div className="w-14 h-14 flex items-center justify-center mb-8 border border-white/15 group-hover:border-white transition-all duration-300 rounded-sm">
                    <Icon className="w-6 h-6 text-white/50 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-serif text-white mb-4 tracking-tight flex items-center gap-2">
                    {feature.title}
                    {feature.soon && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        Soon
                      </Badge>
                    )}
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
    <section className="py-32 px-6 bg-white/1">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 delay-200 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-xs font-mono text-white/30 mb-4">
              SKILL FORMAT
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight">
              Simple markdown
              <br />
              with YAML frontmatter
            </h2>
            <p className="text-white/45 leading-relaxed mb-8">
              Skills are stored as markdown files. Just define metadata in the
              frontmatter and write your skill instructions below. That&apos;s
              it.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">
                YAML
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">
                Markdown
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">
                OpenAI
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-sm">
                Anthropic
              </span>
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
          <div className="text-[14vw] leading-[0.75] font-serif font-bold text-white/3 text-center tracking-tighter">
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

function CTA({ user }: Props) {
  const mounted = useMounted();
  const ctaLink = user ? "/dashboard" : "/auth/signin";
  const ctaText = user ? "GO TO DASHBOARD" : "SIGN IN WITH GITHUB";

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
            Join developers worldwide who are sharing and managing their AI
            agent skills with Hanka.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-none"
            >
              <Link href={ctaLink}>
                <span>{ctaText}</span>
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
            <span className="text-white/40 text-sm">
              OPEN SOURCE · MIT LICENSE
            </span>
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
            <span className="text-white/20 text-xs font-mono">
              © 2024 HANKA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingContent({ user }: Props) {
  return (
    <>
      <Hero user={user} />
      <Features />
      <SkillFormat />
      <CTA user={user} />
      <Footer />
    </>
  );
}

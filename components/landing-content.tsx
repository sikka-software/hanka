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
import type { HankaUser } from "@/lib/auth";
import clsx from "clsx";
import { Marquee } from "@/components/ui/marquee";
import SkillCard from "@/components/skill-card-dummy";
import type { SkillIndex } from "@/lib/skills";
import { motion } from "motion/react";

type Props = {
  user: HankaUser | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { y: { duration: 0.5 }, opacity: { duration: 0.5 }, filter: { duration: 0.5 } },
  },
};

const viewProps = {
  whileInView: "visible",
  viewport: { once: true, margin: "-100px" },
};

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

function generateRandomSkill(index: number): SkillIndex {
  const name = skillNames[index % skillNames.length];
  const numTags = 2 + (index % 3);
  const shuffledTags = [...tags].sort(
    (a, b) => ((a.charCodeAt(0) + index) % 5) - ((b.charCodeAt(0) + index) % 5),
  );
  const selectedTags = shuffledTags.slice(0, numTags);

  const startDate = new Date(2024, 0, 1).getTime();
  const endDate = new Date(2024, 6, 1).getTime();
  const created = new Date(
    startDate + ((index * 86400000) % (endDate - startDate)),
  );
  const updated = new Date(
    created.getTime() + ((index * 43200000) % (Date.now() - created.getTime())),
  );

  return {
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    filePath: `skills/${name.toLowerCase().replace(/\s+/g, "-")}/SKILL.md`,
    name,
    description: descriptions[index % descriptions.length],
    tags: selectedTags,
    category: categories[index % categories.length],
    version: `${(index % 5) + 1}.${(index * 2) % 10}.${(index * 3) % 20}`,
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
    <div className="relative flex bg--400 h-screen w-full flex-row items-center justify-center overflow-clip scale30 min-h-[600px]">
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
  const ctaLink = user ? "/dashboard" : "/auth/signin";
  const ctaText = user ? "GO TO DASHBOARD" : "GET STARTED";

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      <div className="md:block hidden absolute bg--500 scale-70 w-fit opacity-50 inset-s-10 h-screen bg--300 min-h-[600px]">
        <MarqueeDemoVertical />
      </div>
      <div className="flex-1 relative bg--400 flex items-center justify-center px-6 py-24">
        <div className="size-150 bg--500 bg-black blur-3xl absolute lg:translae--1/2 lg:-translate-x-80"></div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                {...viewProps}
                className="space-y-10"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-6xl mt-4 md:text-8xl lg:text-[5rem] leading-[0.9] font-serif font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  <span className="text-white block ">YOUR</span>
                  <span className="text-white block">AGENT SKILLS</span>
                  <span className="text-white/30 block ml-0">LIBRARY.</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                >
                  A platform for sharing and managing AI agent skills. Store your
                  reusable agent skills in a GitHub repository and share them with
                  the world.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-lg"
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
                      "h-14 px-8 rounded-lg border-white/20 text-white/60 hover:text-white hover:border-white",
                    )}
                  >
                    <GitHub className="w-5 h-5 mr-2" />
                    <span>VIEW ON GITHUB</span>
                  </a>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-white/30 font-mono"
                >
                  <span>VERCEL SKILLS COMPATIBLE</span>
                  <span className="hidden md:inline">·</span>
                  <span>GITHUB-CENTERED</span>
                  <span className="hidden md:inline">·</span>
                  <span>PUBLIC & PRIVATE</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          {...viewProps}
          className="mb-16"
        >
          <div className="text-xs font-mono text-white/30 mb-4">FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
            Everything you need to
            <br />
            manage AI agent skills
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          {...viewProps}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative p-10 bg-black"
              >
                <div className="relative">
                  <div className="w-14 h-14 flex items-center justify-center mb-8 border border-white/15 group-hover:border-white transition-all duration-300 rounded-lg">
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function SkillFormat() {
  return (
    <section className="py-32 px-6 bg-white/1">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            {...viewProps}
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
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-lg">
                YAML
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-lg">
                Markdown
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-lg">
                OpenAI
              </span>
              <span className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-lg">
                Anthropic
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          {...viewProps}
        >
          <div className="text-xs font-mono text-white/30 mb-8">POWERED BY</div>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={itemVariants}
                className="px-5 py-2.5 text-sm font-mono text-white/50 border border-white/10 rounded-lg hover:border-white/30 hover:text-white/70 transition-all duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BigType() {
  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          {...viewProps}
        >
          <div className="text-[14vw] leading-[0.75] font-serif font-bold text-white/3 text-center tracking-tighter">
            SKILLS
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-white/20 text-xs font-mono">VERSION 1.0</div>
            <div className="text-white/20 text-xs font-mono">GITHUB BACKED</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA({ user }: Props) {
  const ctaLink = user ? "/dashboard" : "/auth/signin";
  const ctaText = user ? "GO TO DASHBOARD" : "SIGN IN WITH GITHUB";

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          {...viewProps}
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
              className="h-14 px-10 text-base font-semibold bg-white text-black border-0 gap-3 transition-all duration-300 hover:bg-neutral-200 rounded-lg"
            >
              <Link href={ctaLink}>
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="p-6 pb-2 border-t border-white/10 bg--900">
      <div className="max-w-6xl mx-auto bg--900">
        <div className="flex flex-col gap-4 bg--400 sm:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <HankaLogo className="h-6" />
          </div>

          <a href="https://github.com/sikka-software/hanka" target="_blank">
            <Button variant={"outline"}>
              <GitHub className="w-5 h-5" />
              <span>Github</span>
            </Button>
          </a>
        </div>
        <div className="w-fit mx-auto mt-2">
          <span className="text-white/20 text-xs font-mono bg--200">
            © {new Date().getFullYear()} Sikka Software
          </span>
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

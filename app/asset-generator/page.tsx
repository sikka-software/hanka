import SkillCard from "@/components/skill-card";
import type { SkillIndex } from "@/lib/skills";

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

const mockSkills: SkillIndex[] = Array.from({ length: 12 }, (_, i) =>
  generateRandomSkill(i),
);

export default function AssetGeneratorPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSkills.map((skill) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              username="hanka"
              repoName="skills"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

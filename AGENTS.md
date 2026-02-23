# AGENTS.md - Hanka Development Guide

## Overview

Hanka is a Next.js 16 (canary) application for sharing and managing AI agent skills. It uses TypeScript, Tailwind CSS v4, and follows Next.js App Router conventions.

## Project Structure

```
/app              - Next.js App Router pages and API routes
/components       - React components (client and server)
/components/ui    - shadcn/ui components
/lib              - Utility functions and API helpers
/public           - Static assets
```

## Commands

```bash
# Install dependencies
pnpm install

# Development server (port 3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type checking
pnpm tsc --noEmit
```

## Code Style Guidelines

### General Rules

- Use **TypeScript** for all files. Avoid plain JavaScript.
- Enable **strict mode** in TypeScript (`tsconfig.json` has `strict: true`).
- Use **functional components** with hooks. Do not use class components.
- Use the `"use client"` directive for client-side components (use sparingly).
- Keep components small and focused on a single responsibility.

### Imports

- Use the `@/` alias for absolute imports (e.g., `@/components/ui/button`).
- Use named imports instead of default imports where possible.
- Organize imports in this order: external libs, Next.js, UI components, local components/lib, types.
- Use `import type { ... }` for type-only imports.

```typescript
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import type { SkillIndex } from "@/lib/skills";
import { Button } from "./ui/button";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `SkillCard`, `AppHeader`)
- **Functions/variables**: camelCase (e.g., `handleCopy`, `skillList`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `MAX_FILE_SIZE`)
- **Files**: kebab-case for utilities (e.g., `utils.ts`), PascalCase for components (e.g., `SkillCard.tsx`)
- **Types/Interfaces**: PascalCase (e.g., `SkillIndex`, `Props`)

### Types and Props

- Define prop types explicitly using interfaces or type aliases.
- Use `type Props = { ... }` for component props.
- Avoid `any` - use `unknown` when type is truly unknown.

```typescript
type Props = {
  skill: SkillIndex;
  username: string;
  repoName: string;
};

export default function SkillCard({ skill, username, repoName }: Props) {}
```

### Formatting

- Use **double quotes** for strings in JSX and imports.
- Use **single quotes** for strings in TypeScript code.
- Use **2 spaces** for indentation.
- Use semicolons in TypeScript.
- Use trailing commas in objects and arrays.

### Tailwind CSS

- Use Tailwind v4 syntax with `@theme` for custom values.
- Use `cn()` utility from `@/lib/utils` to merge class names.
- Use semantic color names from Tailwind's neutral palette.

```typescript
import { cn } from "@/lib/utils";

<Card className={cn("bg-neutral-900 border-neutral-800", isActive && "border-primary")} />
```

### Error Handling

- Use try/catch blocks for async operations.
- Return appropriate HTTP status codes in API routes (200, 201, 401, 404, 500).
- Return error responses as JSON: `{ error: "message" }`.

```typescript
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
```

- Use empty catch blocks only when ignoring errors is intentional:
```typescript
try { await operation(); } catch {}
```

### API Routes

- Use Next.js App Router conventions (`app/api/*/route.ts`).
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`.
- Use `NextRequest` and `NextResponse` from `next/server`.

### Git Conventions

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Keep commits atomic and focused.

## Dependencies

- **Next.js 16** (canary) - App Router framework
- **React 19** - UI library
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library (Radix UI based)
- **Octokit** - GitHub API client
- **date-fns** - Date utilities

## Testing

Currently, **no tests are configured** in this project. If adding tests:
- Use Vitest for unit tests
- Use React Testing Library for component tests
- Place test files alongside: `component.tsx` and `component.test.tsx`

Run tests with: `pnpm test` (once configured)

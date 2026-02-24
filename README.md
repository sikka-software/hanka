<p align="center">
  <a href="https://usehanka.com#gh-light-mode-only" target="_blank">
    <img src="public/hanka-logo-light-mode.svg?sanitize=true#gh-light-mode-only" width="400">
  </a>
  <a href="https://usehanka.com#gh-dark-mode-only" target="_blank">
    <img src="public/hanka-logo-dark-mode.svg?sanitize=true#gh-dark-mode-only" width="400">
  </a>
</p>

# Hanka

A platform for sharing and managing AI agent skills. Store your reusable agent skills in a GitHub repository and share them with the world.

## What is Hanka?

Hanka lets you create, manage, and share AI agent skills that can be installed by any AI agent or developer. Skills are stored in a GitHub repository.

## Features

- **GitHub-backed**: Every skill is a markdown file in your own GitHub repository. You own your data.
- **Private repos** (SOON): Keep your skills private. CLI authenticates via GitHub Device Flow.
- **CLI-first**: Use Vercel's skills CLI to pull any skill in seconds.
- **Dashboard**: Manage your skills through a beautiful web interface.
- **Version tracking**: Track skill versions and update history.
- **Categories & Tags**: Organize skills with categories and tags.
- **Public profiles**: Share your public skills with a public profile page.

## Tech Stack

- **Next.js 16** (App Router, canary)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix UI based)
- **Octokit** (GitHub API)
- **CodeMirror** (Skill editor)

## Project Structure

```
/app              - Next.js App Router pages and API routes
/components       - React components (client and server)
/components/ui    - shadcn/ui components
/lib              - Utility functions and API helpers
/public           - Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/sikka-software/hanka.git
cd hanka

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Run development server
pnpm dev
```

### Environment Variables

Create a `.env` file with the following:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
AUTH_SECRET=your_auth_secret
```

### Building

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

## Using Skills

### For Public Repos

```bash
npx skills add username/reponame --skill skillname
# or add all skills from the repo
npx skills add username/reponame
```

### For Private Repos

First, clone the repository locally:

```bash
git clone git@github.com:username/private-reponame.git ~/temp-skills
```

Then add skills from the local clone:

```bash
cd your-project
npx skills add ~/temp-skills --skill "Your Skill Name"
# or add all skills
npx skills add ~/temp-skills
```

## Skill Format

Skills are stored as markdown files with YAML frontmatter:

```markdown
---
name: expert-coder
description: An expert coding assistant
license: MIT
compatibility: openai/anthropic
metadata:
  tags: [coding, debugging, refactoring]
  category: development
  version: 1.0.0
  public: true
  created: 2024-01-01
  updated: 2024-01-15
---

# Expert Coder

You are an expert programmer...
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Learn More

<!-- - [Documentation](https://docs.usehanka.com) -->

- [GitHub](https://github.com/sikka-software/hanka)

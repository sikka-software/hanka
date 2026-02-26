# Contributing to Hanka

Thank you for your interest in contributing to Hanka!

## Development Setup

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


## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run lint and type checks
5. Commit using conventional commits (`feat:`, `fix:`, `chore:`, etc.)
6. Push to your fork and open a PR
7. Describe your changes clearly in the PR description

## Reporting Bugs

Use GitHub Issues to report bugs. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Open a GitHub Issue with:
- Clear description of the feature
- Use case / why it's needed
- Any implementation ideas (optional)

## Code of Conduct

Be respectful and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

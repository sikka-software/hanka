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

## Code Style

We follow the guidelines in [AGENTS.md](./AGENTS.md). Please ensure your code passes:

```bash
# Lint
pnpm lint

# Type check
pnpm tsc --noEmit
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

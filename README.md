<p align="center">
  <a href="https://usehanka.com#gh-light-mode-only" target="_blank">
    <img src="public/hanka-logo-light-mode.svg?sanitize=true#gh-light-mode-only">
  </a>
  <a href="https://usehanka.com#gh-dark-mode-only" target="_blank">
    <img src="public/hanka-logo-dark-mode.svg?sanitize=true#gh-dark-mode-only">
  </a>
</p>

# Hanka

A platform for sharing and managing AI agent skills. Store your reusable agent skills in a GitHub repository and share them with the world.

## What is Hanka?

Hanka lets you create, manage, and share AI agent skills that can be installed by any AI agent or developer. Skills are stored in a GitHub repository and can be either public or private.

## Installing Skills

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

## Quick Start

1. Go to [usehanka.com](https://usehanka.com) and sign in with GitHub
2. Create a new skill repository or select an existing one
3. Add your skills via the dashboard
4. Share your skills with `npx skills add`

## Learn More

- [Documentation](https://docs.usehanka.com)
- [GitHub](https://github.com/usehanka/hanka)

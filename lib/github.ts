import { Octokit } from '@octokit/rest'
import type { SkillIndex } from './skills'

export async function listUserRepos(token: string) {
  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: 'updated',
    type: 'all',
  })
  return data.map(r => ({
    name: r.name,
    private: r.private,
    description: r.description ?? '',
    updatedAt: r.updated_at,
  }))
}

export async function createRepo(token: string, repoName: string, isPrivate: boolean = true): Promise<void> {
  const octokit = new Octokit({ auth: token })
  await octokit.rest.repos.createForAuthenticatedUser({
    name: repoName,
    private: isPrivate,
    description: 'My AI agent skills library - via https://usehanka.com',
    auto_init: true,
  })
  const { data: user } = await octokit.rest.users.getAuthenticated()
  const owner = user.login

  const readmeContent = `# ${repoName}

This is your personal AI agent skills library powered by [Hanka](https://usehanka.com).

## What is this?

Store and share reusable AI agent skills that can be installed by any AI agent or developer.

## Installing Skills

### For Public Repos

\`\`\`bash
npx skills add ${owner}/${repoName} --skill skillname
# or add all skills from the repo
npx skills add ${owner}/${repoName}
\`\`\`

### For Private Repos

First, clone the repository locally:

\`\`\`bash
git clone git@github.com:${owner}/${repoName}.git ~/temp-skills
\`\`\`

Then add skills from the local clone:

\`\`\`bash
cd your-project
npx skills add ~/temp-skills --skill "Your Skill Name"
# or add all skills
npx skills add ~/temp-skills
\`\`\`

## Adding Skills

1. Go to [usehanka.com](https://usehanka.com) and sign in
2. Select this repository as your skill library
3. Create your first skill using the dashboard

## Structure

- \`index.json\` - Lists all available skills in this repository
- \`.hanka/config.json\` - Configuration for your skill library
- \`*.md\` - Skill definition files in Markdown format

## Making Skills Public

By default, skills are private. To share a skill publicly, edit the skill and toggle "Public" on. Public repos can be discovered and installed by anyone.

## Learn More

- [Hanka Documentation](https://docs.usehanka.com)
- [CLI Reference](https://docs.usehanka.com/cli)
- [GitHub](https://github.com/usehanka/hanka)
`

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: 'README.md',
    message: 'docs: add Hanka README',
    content: Buffer.from(readmeContent).toString('base64'),
  })
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: '.hanka/config.json',
    message: 'chore: initialize Hanka config',
    content: Buffer.from(JSON.stringify({ version: '1', publicProfile: false }, null, 2)).toString('base64'),
  })
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: 'index.json',
    message: 'chore: initialize skill index',
    content: Buffer.from(JSON.stringify([], null, 2)).toString('base64'),
  })
}

export async function repoExists(token: string, owner: string, repo: string): Promise<boolean> {
  const octokit = new Octokit({ auth: token })
  try {
    await octokit.rest.repos.get({ owner, repo })
    return true
  } catch {
    return false
  }
}

export async function getIndex(token: string, owner: string, repo: string): Promise<SkillIndex[]> {
  const octokit = new Octokit({ auth: token })
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: 'index.json' })
    if ('content' in data) {
      return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
    }
  } catch {
  }
  return []
}

async function commitIndex(
  token: string,
  owner: string,
  repo: string,
  index: SkillIndex[]
): Promise<void> {
  const octokit = new Octokit({ auth: token })
  const content = Buffer.from(JSON.stringify(index, null, 2)).toString('base64')
  let sha: string | undefined

  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: 'index.json' })
    if ('sha' in data) sha = data.sha
  } catch {}

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'index.json',
    message: 'chore: update skill index',
    content,
    ...(sha ? { sha } : {}),
  })
}

export async function getSkillFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const octokit = new Octokit({ auth: token })
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: filePath })
    if ('content' in data) {
      return {
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
        sha: data.sha,
      }
    }
  } catch {}
  return null
}

export async function createSkillFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  rawMarkdown: string,
  meta: SkillIndex
): Promise<void> {
  const octokit = new Octokit({ auth: token })
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `feat: add skill "${meta.name}"`,
    content: Buffer.from(rawMarkdown).toString('base64'),
  })
  const index = await getIndex(token, owner, repo)
  const updated = [...index.filter(s => s.slug !== meta.slug), meta]
  await commitIndex(token, owner, repo, updated)
}

export async function updateSkillFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  rawMarkdown: string,
  sha: string,
  meta: SkillIndex
): Promise<void> {
  const octokit = new Octokit({ auth: token })
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `feat: update skill "${meta.name}"`,
    content: Buffer.from(rawMarkdown).toString('base64'),
    sha,
  })
  const index = await getIndex(token, owner, repo)
  const updated = [...index.filter(s => s.slug !== meta.slug), meta]
  await commitIndex(token, owner, repo, updated)
}

export async function deleteSkillFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  sha: string,
  slug: string
): Promise<void> {
  const octokit = new Octokit({ auth: token })
  await octokit.rest.repos.deleteFile({
    owner,
    repo,
    path: filePath,
    message: `chore: delete skill "${slug}"`,
    sha,
  })
  const index = await getIndex(token, owner, repo)
  await commitIndex(token, owner, repo, index.filter(s => s.slug !== slug))
}

export async function getCommitHistory(
  token: string,
  owner: string,
  repo: string,
  filePath: string
) {
  const octokit = new Octokit({ auth: token })
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      path: filePath,
      per_page: 5,
    })
    return data.map(c => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message,
      date: c.commit.author?.date ?? null,
      author: c.commit.author?.name ?? null,
    }))
  } catch {
    return []
  }
}

export async function getPublicIndex(owner: string, repo: string): Promise<SkillIndex[]> {
  const octokit = new Octokit()
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: 'index.json' })
    if ('content' in data) {
      const all: SkillIndex[] = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
      return all.filter(s => s.public)
    }
  } catch {}
  return []
}

export async function getPublicSkillFile(
  owner: string,
  repo: string,
  filePath: string
): Promise<string | null> {
  const octokit = new Octokit()
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: filePath })
    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8')
    }
  } catch {}
  return null
}

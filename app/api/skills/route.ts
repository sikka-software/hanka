import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, createSkillFile, getSkillFolderContents } from '@/lib/github'
import {
  generateSlug,
  generateFilePath,
  buildSkillIndex,
  serializeSkill,
  todayISO,
  type SkillFile,
} from '@/lib/skills'
import { Octokit } from '@octokit/rest'

export async function GET() {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const index = await getIndex(token, user.login, repo)
  return NextResponse.json(index)
}

async function* saveSkillWithProgress(
  token: string,
  user: string,
  repo: string,
  frontmatter: Record<string, unknown>,
  body: string,
  files: SkillFile[] | undefined,
  slug: string
): AsyncGenerator<{ type: 'progress' | 'done' | 'error'; current?: number; total?: number; filePath?: string; slug?: string; message?: string }> {
  const now = todayISO()
  const fm = {
    ...frontmatter,
    metadata: {
      ...(frontmatter.metadata as Record<string, unknown>),
      created: (frontmatter.metadata as Record<string, unknown>)?.created ?? now,
      updated: now,
    },
  }
  
  const filePath = generateFilePath(slug)
  const octokit = new Octokit({ auth: token })

  if (files && Array.isArray(files) && files.length > 0) {
    const userFiles = files.filter(f => f.path !== 'SKILL.md')
    const total = userFiles.length + 1 // +1 for SKILL.md (index update not counted)
    
    yield { type: 'progress', current: 1, total, filePath: 'SKILL.md' }
    
    const rawMarkdown = serializeSkill(fm as Parameters<typeof serializeSkill>[0], body)
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: user,
      repo,
      path: filePath,
      message: `feat: add skill "${(fm as { name?: string }).name}"`,
      content: Buffer.from(rawMarkdown).toString('base64'),
    })
    
    for (let i = 0; i < userFiles.length; i++) {
      const file = userFiles[i]
      yield { type: 'progress', current: i + 2, total, filePath: file.path }
      
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: user,
        repo,
        path: `skills/${slug}/${file.path}`,
        message: `feat: add file "${file.path}" to skill "${(fm as { name?: string }).name}"`,
        content: Buffer.from(file.content).toString('base64'),
      })
    }
    
    const folderContents = await getSkillFolderContents(token, user, repo, slug)
    const fileCount = folderContents.filter(f => f.type === 'file' && !f.path.endsWith('license.txt')).length
    const meta = buildSkillIndex(fm as Parameters<typeof buildSkillIndex>[0], slug, filePath, fileCount)
    
    // Update index
    const { data } = await octokit.rest.repos.getContent({
      owner: user,
      repo,
      path: '.hanka/index.json',
    })
    let sha: string | undefined
    if ('sha' in data) sha = data.sha
    
    const index = JSON.parse(Buffer.from((data as { content?: string }).content || '[]', 'base64').toString('utf-8'))
    const updated = [...index.filter((s: { slug: string }) => s.slug !== meta.slug), meta]
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: user,
      repo,
      path: '.hanka/index.json',
      message: 'chore: update skill index',
      content: Buffer.from(JSON.stringify(updated, null, 2)).toString('base64'),
      ...(sha ? { sha } : {}),
    })
  } else {
    yield { type: 'progress', current: 1, total: 1, filePath: 'SKILL.md' }
    
    const rawMarkdown = serializeSkill(fm as Parameters<typeof serializeSkill>[0], body)
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: user,
      repo,
      path: filePath,
      message: `feat: add skill "${(fm as { name?: string }).name}"`,
      content: Buffer.from(rawMarkdown).toString('base64'),
    })
    
    const meta = buildSkillIndex(fm as Parameters<typeof buildSkillIndex>[0], slug, filePath, 1)
    
    // Update index
    const { data } = await octokit.rest.repos.getContent({
      owner: user,
      repo,
      path: '.hanka/index.json',
    })
    let sha: string | undefined
    if ('sha' in data) sha = data.sha
    
    const index = JSON.parse(Buffer.from((data as { content?: string }).content || '[]', 'base64').toString('utf-8'))
    const updated = [...index.filter((s: { slug: string }) => s.slug !== meta.slug), meta]
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: user,
      repo,
      path: '.hanka/index.json',
      message: 'chore: update skill index',
      content: Buffer.from(JSON.stringify(updated, null, 2)).toString('base64'),
      ...(sha ? { sha } : {}),
    })
  }

  yield { type: 'done', slug }
}

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { frontmatter, body, files } = await request.json()
  const slug = generateSlug(frontmatter.name)

  const index = await getIndex(token, user.login, repo)
  if (index.some(s => s.slug === slug)) {
    return NextResponse.json({ error: `A skill named "${frontmatter.name}" already exists` }, { status: 409 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      try {
        for await (const event of saveSkillWithProgress(token, user.login, repo, frontmatter, body, files, slug)) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))
        }
      } catch (error) {
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Unknown error' }) + '\n'))
      }
      
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

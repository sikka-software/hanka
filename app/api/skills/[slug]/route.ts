import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, getSkillFile, updateSkillFile, deleteSkillFile } from '@/lib/github'
import {
  buildSkillIndex,
  serializeSkill,
  generateFilePath,
  generateSlug,
  todayISO,
} from '@/lib/skills'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const index = await getIndex(token, user.login, repo)
  const meta = index.find(s => s.slug === slug)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const file = await getSkillFile(token, user.login, repo, meta.filePath)
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...meta,
    body: file.content.split('---').slice(2).join('---').trim(),
    sha: file.sha,
    rawMarkdown: file.content,
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: originalSlug } = await params
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { frontmatter, body, sha } = await request.json()
  const updated = {
    ...frontmatter,
    metadata: {
      ...frontmatter.metadata,
      updated: todayISO(),
    },
  }
  const slug = generateSlug(updated.name)
  const filePath = generateFilePath(slug)
  const rawMarkdown = serializeSkill(updated, body)
  const meta = buildSkillIndex(updated, slug, filePath)

  await updateSkillFile(token, user.login, repo, filePath, rawMarkdown, sha, meta)
  return NextResponse.json({ slug })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const index = await getIndex(token, user.login, repo)
  const meta = index.find(s => s.slug === slug)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const file = await getSkillFile(token, user.login, repo, meta.filePath)
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deleteSkillFile(token, user.login, repo, meta.filePath, file.sha, slug)
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, createSkillFile } from '@/lib/github'
import {
  generateSlug,
  generateFilePath,
  buildSkillIndex,
  serializeSkill,
  todayISO,
} from '@/lib/skills'

export async function GET() {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const index = await getIndex(token, user.login, repo)
  return NextResponse.json(index)
}

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { frontmatter, body } = await request.json()
  const now = todayISO()
  const fm = {
    ...frontmatter,
    hanka: {
      ...frontmatter.hanka,
      created: frontmatter.hanka?.created ?? now,
      updated: now,
    },
  }
  const slug = generateSlug(fm.name)
  const filePath = generateFilePath(slug)
  const rawMarkdown = serializeSkill(fm, body)
  const meta = buildSkillIndex(fm, slug, filePath)

  await createSkillFile(token, user.login, repo, filePath, rawMarkdown, meta)
  return NextResponse.json({ slug }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, createSkillFile, createMultiFileSkill } from '@/lib/github'
import {
  generateSlug,
  generateFilePath,
  buildSkillIndex,
  serializeSkill,
  todayISO,
  type SkillFile,
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

  const { frontmatter, body, files } = await request.json()
  const now = todayISO()
  const fm = {
    ...frontmatter,
    metadata: {
      ...frontmatter.metadata,
      created: frontmatter.metadata?.created ?? now,
      updated: now,
    },
  }
  const slug = generateSlug(fm.name)
  const filePath = generateFilePath(slug)
  const meta = buildSkillIndex(fm, slug, filePath)

  if (files && Array.isArray(files) && files.length > 0) {
    const skillFiles: SkillFile[] = files.map((f: { path: string; content: string }) => ({
      path: f.path,
      content: f.content,
    }))
    await createMultiFileSkill(token, user.login, repo, slug, skillFiles, meta)
  } else {
    const rawMarkdown = serializeSkill(fm, body)
    await createSkillFile(token, user.login, repo, filePath, rawMarkdown, meta)
  }
  
  return NextResponse.json({ slug }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getPublicIndex, getPublicSkillFile } from '@/lib/github'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params
  const repo = new URL(request.url).searchParams.get('repo') ?? 'my-agent-skills'

  const index = await getPublicIndex(username, repo)
  const meta = index.find(s => s.slug === slug)
  if (!meta) return NextResponse.json({ error: 'Not found or not public' }, { status: 404 })

  const content = await getPublicSkillFile(username, repo, meta.filePath)
  if (!content) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  return NextResponse.json({ ...meta, rawMarkdown: content })
}

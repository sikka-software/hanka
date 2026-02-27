import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, getSkillFile, updateSkillFile, deleteSkillFile, getSkillFolderContents, updateMultiFileSkill } from '@/lib/github'
import {
  buildSkillIndex,
  serializeSkill,
  generateFilePath,
  generateSlug,
  todayISO,
  type SkillFile,
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

  const folderContents = await getSkillFolderContents(token, user.login, repo, slug)
  
  if (folderContents.length > 0) {
    const files: SkillFile[] = folderContents
      .filter(f => f.type === 'file')
      .map(f => ({
        path: f.path,
        content: f.content,
      }))
    const skillMdFile = folderContents.find(f => f.path === 'SKILL.md')
    return NextResponse.json({
      ...meta,
      body: skillMdFile ? skillMdFile.content.split('---').slice(2).join('---').trim() : '',
      sha: folderContents[0]?.sha ?? '',
      rawMarkdown: skillMdFile?.content ?? '',
      files,
      fileShas: folderContents.filter(f => f.type === 'file').map(f => ({ path: f.path, sha: f.sha })),
    })
  }

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
  const paramsSlug = (await params).slug
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { frontmatter, body, sha, files, fileShas } = await request.json()
  const updated = {
    ...frontmatter,
    metadata: {
      ...frontmatter.metadata,
      updated: todayISO(),
    },
  }
  const slug = generateSlug(updated.name)
  const filePath = generateFilePath(slug)
  const meta = buildSkillIndex(updated, slug, filePath)

  if (files && Array.isArray(files) && files.length > 0) {
    const skillFiles: SkillFile[] = files.map((f: { path: string; content: string }) => ({
      path: f.path,
      content: f.content,
    }))
    const existingFiles = fileShas ? fileShas.map((f: { path: string; sha: string }) => ({
      path: f.path,
      sha: f.sha,
    })) : []
    await updateMultiFileSkill(token, user.login, repo, slug, skillFiles, meta, existingFiles)
  } else {
    const rawMarkdown = serializeSkill(updated, body)
    await updateSkillFile(token, user.login, repo, filePath, rawMarkdown, sha, meta)
  }
  
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

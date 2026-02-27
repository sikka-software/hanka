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

  let fileCount: number | undefined
  if (files && Array.isArray(files) && files.length > 0) {
    const folderContents = await getSkillFolderContents(token, user.login, repo, slug)
    fileCount = folderContents.filter(f => f.type === 'file' && !f.path.endsWith('license.txt')).length
  }
  const meta = buildSkillIndex(updated, slug, filePath, fileCount)

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
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()
  if (!token || !user || !repo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      try {
        const index = await getIndex(token, user.login, repo)
        const meta = index.find(s => s.slug === slug)
        if (!meta) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: 'Skill not found' }) + '\n'))
          controller.close()
          return
        }

        // Check if it's a multi-file skill (folder exists)
        const folderContents = await getSkillFolderContents(token, user.login, repo, slug)
        
        if (folderContents.length > 0) {
          // Multi-file skill - delete entire folder
          await deleteSkillFile(token, user.login, repo, meta.filePath, '', slug, (current, total, filePath) => {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'progress', current, total, filePath }) + '\n'))
          })
        } else {
          // Single file skill - try to delete the file directly
          const file = await getSkillFile(token, user.login, repo, meta.filePath)
          if (!file) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: 'Skill file not found' }) + '\n'))
            controller.close()
            return
          }
          await deleteSkillFile(token, user.login, repo, meta.filePath, file.sha, slug, (current, total, filePath) => {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'progress', current, total, filePath }) + '\n'))
          })
        }
        
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'))
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

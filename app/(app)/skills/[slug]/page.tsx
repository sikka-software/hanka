import { redirect } from 'next/navigation'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, getSkillFile, getCommitHistory, getSkillFolderContents } from '@/lib/github'
import { parseSkillFile, type SkillFile } from '@/lib/skills'
import SkillDetailClient from './skill-detail-client'

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()

  if (!token || !user || !repo) redirect('/auth/signin')

  const index = await getIndex(token, user.login, repo)
  const meta = index.find(s => s.slug === slug)
  if (!meta) redirect('/dashboard')

  const folderContents = await getSkillFolderContents(token, user.login, repo, slug)
  
  let files: SkillFile[] = []
  let body = ''
  let rawMarkdown = ''
  
  if (folderContents.length > 0) {
    files = folderContents
      .filter(f => f.type === 'file')
      .map(f => ({ path: f.path, content: f.content }))
    const skillMdFile = folderContents.find(f => f.path === 'SKILL.md')
    if (skillMdFile) {
      const parsed = parseSkillFile(skillMdFile.content)
      body = parsed.body
      rawMarkdown = skillMdFile.content
    }
  } else {
    const file = await getSkillFile(token, user.login, repo, meta.filePath)
    if (!file) redirect('/dashboard')
    const parsed = parseSkillFile(file.content)
    body = parsed.body
    rawMarkdown = file.content
  }

  const commits = await getCommitHistory(token, user.login, repo, meta.filePath)

  return (
    <SkillDetailClient
      skill={meta}
      frontmatter={{ ...meta, metadata: { tags: meta.tags, category: meta.category, version: meta.version, public: meta.public, created: meta.created, updated: meta.updated } }}
      body={body}
      rawMarkdown={rawMarkdown}
      commits={commits}
      username={user.login}
      repoName={repo}
      files={files}
    />
  )
}

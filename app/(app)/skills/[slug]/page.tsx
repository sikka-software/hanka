import { redirect } from 'next/navigation'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, getSkillFile, getCommitHistory } from '@/lib/github'
import { parseSkillFile } from '@/lib/skills'
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

  const file = await getSkillFile(token, user.login, repo, meta.filePath)
  if (!file) redirect('/dashboard')

  const { frontmatter, body } = parseSkillFile(file.content)
  const commits = await getCommitHistory(token, user.login, repo, meta.filePath)

  return (
    <SkillDetailClient
      skill={meta}
      frontmatter={frontmatter}
      body={body}
      rawMarkdown={file.content}
      commits={commits}
      username={user.login}
    />
  )
}

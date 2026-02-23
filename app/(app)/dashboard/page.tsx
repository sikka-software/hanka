import { redirect } from 'next/navigation'
import { getTokenFromCookies, getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import { getIndex, repoExists } from '@/lib/github'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()

  if (!token || !user || !repo) redirect('/auth/signin')

  const exists = await repoExists(token, user.login, repo)
  if (!exists) {
    redirect('/api/clear-repo')
  }

  const skills = await getIndex(token, user.login, repo)

  return <DashboardClient skills={skills} username={user.login} repoName={repo} />
}

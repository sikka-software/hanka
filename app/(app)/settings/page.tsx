import { redirect } from 'next/navigation'
import { getUserFromCookies, getRepoFromCookies } from '@/lib/auth'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const user = await getUserFromCookies()
  const repo = await getRepoFromCookies()

  if (!user) redirect('/auth/signin')

  return <SettingsClient user={user} repo={repo} />
}

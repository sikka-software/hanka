import { NextResponse } from 'next/server'
import { getTokenFromCookies } from '@/lib/auth'
import { listUserRepos } from '@/lib/github'

export async function GET() {
  const token = await getTokenFromCookies()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const repos = await listUserRepos(token)
  return NextResponse.json(repos)
}

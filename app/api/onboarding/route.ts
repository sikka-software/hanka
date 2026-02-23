import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, getUserFromCookies, COOKIE_OPTS } from '@/lib/auth'
import { createRepo } from '@/lib/github'

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  if (!token || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { repoName, isPrivate = true } = await request.json()
  if (!repoName) return NextResponse.json({ error: 'repoName required' }, { status: 400 })

  await createRepo(token, repoName, isPrivate)

  const response = NextResponse.json({ ok: true })
  response.cookies.set('hanka_repo', repoName, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

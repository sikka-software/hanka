import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, COOKIE_OPTS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { repoName } = await request.json()
  if (!repoName) return NextResponse.json({ error: 'repoName required' }, { status: 400 })

  const response = NextResponse.json({ ok: true })
  response.cookies.set('hanka_repo', repoName, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

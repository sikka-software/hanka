import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_OPTS } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/signin?error=no_code', request.url))
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json()

  if (tokenData.error || !tokenData.access_token) {
    return NextResponse.redirect(new URL('/auth/signin?error=token_exchange', request.url))
  }

  const access_token: string = tokenData.access_token

  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const { id, login, name } = await userRes.json()

  const userPayload = Buffer.from(JSON.stringify({ id, login, name })).toString('base64')

  const existingRepo = request.cookies.get('hanka_repo')?.value
  const redirectTo = existingRepo ? '/dashboard' : '/onboarding'

  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  response.cookies.set('hanka_token', access_token, COOKIE_OPTS)
  response.cookies.set('hanka_user', userPayload, COOKIE_OPTS)
  return response
}

import { NextResponse } from 'next/server'

export async function POST() {
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000'
  const response = NextResponse.redirect(new URL('/', appUrl))
  response.cookies.delete('hanka_token')
  response.cookies.delete('hanka_user')
  response.cookies.delete('hanka_repo')
  return response
}

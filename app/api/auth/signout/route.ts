import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin
  const response = NextResponse.redirect(new URL("/", origin))
  response.cookies.delete('hanka_token')
  response.cookies.delete('hanka_user')
  response.cookies.delete('hanka_repo')
  return response
}

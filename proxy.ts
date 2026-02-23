import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard', '/skills', '/settings', '/onboarding']

export function proxy(request: NextRequest) {
  const token = request.cookies.get('hanka_token')?.value
  const isProtected = PROTECTED_PREFIXES.some(p => request.nextUrl.pathname.startsWith(p))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/skills/:path*', '/settings/:path*', '/onboarding/:path*'],
}

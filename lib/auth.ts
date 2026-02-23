import { cookies } from 'next/headers'
import { Octokit } from '@octokit/rest'

export type HankaUser = {
  login: string
  id: number
  name: string
}

export const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('hanka_token')?.value ?? null
}

export async function getUserFromCookies(): Promise<HankaUser | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('hanka_user')?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

export async function getRepoFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('hanka_repo')?.value ?? null
}

export function createOctokit(token: string): Octokit {
  return new Octokit({ auth: token })
}

export async function requireAuth() {
  const token = await getTokenFromCookies()
  const user = await getUserFromCookies()
  if (!token || !user) {
    throw new Error('UNAUTHORIZED')
  }
  return { token, user, octokit: createOctokit(token) }
}

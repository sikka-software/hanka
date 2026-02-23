import { NextRequest, NextResponse } from 'next/server'
import { getPublicIndex } from '@/lib/github'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const repo = new URL(request.url).searchParams.get('repo') ?? 'my-agent-skills'
  const index = await getPublicIndex(username, repo)
  return NextResponse.json(index)
}

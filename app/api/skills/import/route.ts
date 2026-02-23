import { NextRequest, NextResponse } from "next/server";
import { getPublicSkillFile } from "@/lib/github";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const urlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/[^/]+\/(.+)$/;
  const match = url.match(urlPattern);

  if (!match) {
    return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 });
  }

  const [, owner, repo, path] = match;
  const cleanPath = path.replace(/\/$/, "");

  const content = await getPublicSkillFile(owner, repo, `${cleanPath}/SKILL.md`);

  if (!content) {
    return NextResponse.json({ error: "SKILL.md not found in this repository path" }, { status: 404 });
  }

  return NextResponse.json({ content });
}

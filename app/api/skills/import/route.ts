import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

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

  const octokit = new Octokit();
  
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: cleanPath,
    });

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Path must be a folder" }, { status: 400 });
    }

    const files: { path: string; content: string }[] = [];
    
    for (const item of data) {
      if (item.type === 'file') {
        const fileData = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: item.path,
        });
        if ('content' in fileData.data) {
          files.push({
            path: item.name,
            content: Buffer.from(fileData.data.content, 'base64').toString('utf-8'),
          });
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files found in this repository path" }, { status: 404 });
    }

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: "Failed to import skill files" }, { status: 500 });
  }
}

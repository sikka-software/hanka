import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getTokenFromCookies } from "@/lib/auth";

async function fetchDirectory(
  octokit: Octokit,
  owner: string,
  repo: string,
  dirPath: string,
  basePath: string
): Promise<{ path: string; content: string }[]> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dirPath,
    });

    if (!Array.isArray(data)) return [];

    const files: { path: string; content: string }[] = [];

    for (const item of data) {
      if (item.type === 'file') {
        const fileData = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: item.path,
        });
        if ('content' in fileData.data) {
          const relativePath = item.path.replace(`${basePath}/`, '');
          files.push({
            path: relativePath,
            content: Buffer.from(fileData.data.content, 'base64').toString('utf-8'),
          });
        }
      } else if (item.type === 'dir') {
        const subFiles = await fetchDirectory(octokit, owner, repo, item.path, basePath);
        files.push(...subFiles);
      }
    }
    return files;
  } catch {
    return [];
  }
}

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

  const token = await getTokenFromCookies();
  const octokit = new Octokit({ auth: token });
  
  try {
    const files = await fetchDirectory(octokit, owner, repo, cleanPath, cleanPath);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files found in this repository path. Make sure the repository is public or you have access." }, { status: 404 });
    }

    return NextResponse.json({ files });
  } catch (error) {
    if (error instanceof Error && error.message.includes("403")) {
      return NextResponse.json({ error: "GitHub API rate limit exceeded. Try again later or use a GitHub token." }, { status: 429 });
    }
    return NextResponse.json({ error: "Failed to import skill files. Make sure the repository is public." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getTokenFromCookies } from "@/lib/auth";

async function* fetchFilesWithProgress(
  octokit: Octokit,
  owner: string,
  repo: string,
  dirPath: string,
  basePath: string
): AsyncGenerator<{ type: 'progress' | 'file' | 'done'; current?: number; total?: number; filePath?: string; content?: string; path?: string }> {
  const fileTree: { path: string; type: string }[] = [];
  
  async function fetchDir(currentPath: string) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: currentPath,
      });

      if (!Array.isArray(data)) return;

      for (const item of data) {
        if (item.type === 'file') {
          fileTree.push({
            path: item.path.replace(`${basePath}/`, ''),
            type: 'file',
          });
        } else if (item.type === 'dir') {
          await fetchDir(item.path);
        }
      }
    } catch {
      // Skip directories that fail
    }
  }
  
  await fetchDir(dirPath);
  
  const files = fileTree.filter(f => f.type === 'file');
  const total = files.length;
  let current = 0;
  
  for (const file of files) {
    current++;
    
    yield { type: 'progress', current, total, filePath: file.path };
    
    try {
      const fileData = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: `${dirPath}/${file.path}`,
      });
      if ('content' in fileData.data) {
        yield {
          type: 'file',
          path: file.path,
          content: Buffer.from(fileData.data.content, 'base64').toString('utf-8'),
        };
      }
    } catch {
      // Skip files that fail to load
    }
  }
  
  yield { type: 'done' };
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

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        for await (const event of fetchFilesWithProgress(octokit, owner, repo, cleanPath, cleanPath)) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        }
      } catch (error) {
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Unknown error' }) + '\n'));
      }
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Trash2,
  Globe,
  Lock,
  GitCommit,
  FileText,
  Folder,
  ExternalLink,
} from "lucide-react";
import SkillViewer from "@/components/skill-viewer";
import CopyButton from "@/components/copy-button";
import AppHeader from "@/components/app-header";
import type { SkillFrontmatter, SkillIndex, SkillFile } from "@/lib/skills";
import { Progress } from "@/components/ui/progress";

type Commit = {
  sha: string;
  message: string;
  date: string | null;
  author: string | null;
};

type Props = {
  skill: SkillIndex;
  frontmatter: SkillFrontmatter;
  body: string;
  rawMarkdown: string;
  commits: Commit[];
  username: string;
  repoName: string;
  files?: SkillFile[];
};

export default function SkillDetailClient({
  skill,
  frontmatter,
  body,
  rawMarkdown,
  commits,
  username,
  repoName,
  files,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<{
    current: number;
    total: number;
    filePath: string;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const githubUrl = `https://github.com/${username}/${repoName}/tree/main/skills/${skill.slug}`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    setDeleteProgress(null);

    try {
      const res = await fetch(`/api/skills/${skill.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to delete skill");
        setDeleting(false);
        setDeleteDialogOpen(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setDeleteDialogOpen(false);
        router.push("/dashboard");
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const event = JSON.parse(line);

            if (event.type === "progress") {
              setDeleteProgress({
                current: event.current,
                total: event.total,
                filePath: event.filePath,
              });
            } else if (event.type === "done") {
              setDeleteDialogOpen(false);
              router.push("/dashboard");
              return;
            } else if (event.type === "error") {
              alert(event.message || "Failed to delete skill");
              setDeleting(false);
              setDeleteDialogOpen(false);
              return;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      setDeleteDialogOpen(false);
      router.push("/dashboard");
    } catch {
      setDeleting(false);
    }
  };

  const cliCommand = `npx skills add ${username}/${repoName} --skill ${skill.slug}`;

  return (
    <>
      <AppHeader
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/skills/${skill.slug}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete skill?</AlertDialogTitle>
                  {deleteProgress ? (
                    <div className="space-y-2 mt-2 w-full">
                      <div>
                        Deleting {deleteProgress.current} of{" "}
                        {deleteProgress.total} files...
                      </div>
                      <Progress className="w-full" value={(deleteProgress.current / deleteProgress.total) * 100} />
                      <div className="text-xs text-muted-foreground truncate">
                        {deleteProgress.filePath}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      This will permanently delete "{skill.name}" from your
                      repository. This action cannot be undone.
                    </div>
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    variant="destructive"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium truncate">{skill.name}</span>
        </div>
      </AppHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-2"
                >
                  {skill.name}
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </h1>
              {/* Will be brought back in v2 */}
              {/* {skill.public ? (
                <Badge variant="secondary" className="gap-1">
                  <Globe className="w-3 h-3" />
                  Public
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Private
                </Badge>
              )} */}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">{skill.category}</Badge>
              <span>v{skill.version}</span>
              <span>
                Created {new Date(skill.created).toLocaleDateString()}
              </span>
              <span>
                Updated {new Date(skill.updated).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground">{skill.description}</p>

          {(frontmatter.license || frontmatter.compatibility) && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Metadata
              </h3>
              <div className="space-y-2">
                {frontmatter.license && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-24">
                      License
                    </span>
                    <span className="text-sm">{frontmatter.license}</span>
                  </div>
                )}
                {frontmatter.compatibility && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-24">
                      Compatibility
                    </span>
                    <span className="text-sm">{frontmatter.compatibility}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <CopyButton text={rawMarkdown} label="Copy Raw" />
            <CopyButton text={cliCommand} terminal label="Copy CLI" />
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">CLI Command</p>
            <code className="text-sm">{cliCommand}</code>
          </div>

          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              {files && files.length > 0 && (
                <TabsTrigger value="files">
                  <Folder className="w-4 h-4 mr-1" />
                  Files ({files.length})
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="preview">
              <div className="border rounded-lg p-6">
                <SkillViewer markdown={body} />
              </div>
            </TabsContent>
            <TabsContent value="raw">
              <div className="border rounded-lg p-4 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {rawMarkdown}
                </pre>
              </div>
            </TabsContent>
            {files && files.length > 0 && (
              <TabsContent value="files">
                <div className="border rounded-lg divide-y">
                  {files
                    .sort((a, b) => a.path.localeCompare(b.path))
                    .map((file) => {
                      const extension = file.path.split(".").pop() ?? "";
                      const isBinary = [
                        "ttf",
                        "otf",
                        "woff",
                        "woff2",
                        "png",
                        "jpg",
                        "jpeg",
                        "gif",
                        "svg",
                        "ico",
                        "pdf",
                        "zip",
                      ].includes(extension);

                      return (
                        <div key={file.path} className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium">{file.path}</span>
                            {isBinary && (
                              <span className="text-xs text-neutral-500">
                                (binary file)
                              </span>
                            )}
                          </div>
                          {!isBinary && (
                            <pre className="text-sm font-mono whitespace-pre-wrap bg-neutral-900 p-4 rounded overflow-auto max-h-[300px]">
                              {file.content}
                            </pre>
                          )}
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {commits.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GitCommit className="w-5 h-5" />
                Commit History
              </h2>
              <div className="border rounded-lg divide-y">
                {commits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{commit.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {commit.author} ·{" "}
                        {commit.date &&
                          formatDistanceToNow(new Date(commit.date), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                    <code className="text-xs text-muted-foreground font-mono">
                      {commit.sha}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

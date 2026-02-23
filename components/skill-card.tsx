"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check, Terminal, Folder, FolderOpen } from "lucide-react";
import type { SkillIndex } from "@/lib/skills";
import { Button } from "./ui/button";

type Props = {
  skill: SkillIndex;
  username: string;
  repoName: string;
};

export default function SkillCard({ skill, username, repoName }: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch(`/api/skills/${skill.slug}`);
    const data = await res.json();
    navigator.clipboard.writeText(data.rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCli = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cliCommand = `npx skills add ${username}/${repoName} --skill ${skill.slug}`;
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <Card className="bg-neutral-900 border-neutral-800 p-0! hover:border-neutral-700 transition-colors relative h-full flex flex-col">
      <Link href={`/skills/${skill.slug}`} className="block flex-1 py-4">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-neutral-100 pr-16">
              {skill.name}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
            {skill.description}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs p-2 py-2.5">
              <FolderOpen /> {skill.category}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {skill.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{skill.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex flex-row items-center justify-between">
            {" "}
            <p className="text-xs text-neutral-500">
              Updated{" "}
              {formatDistanceToNow(new Date(skill.updated), {
                addSuffix: true,
              })}
            </p>
            <span className="text-xs text-neutral-500">v{skill.version}</span>
          </div>
        </CardContent>
      </Link>
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleCopy}
              size="icon-sm"
              variant="ghost"
            >
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5 text-neutral-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? "Copied!" : "Copy markdown"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleCopyCli}
              size="icon-sm"
              variant="ghost"
            >
              {copiedCli ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Terminal className="size-3.5 text-neutral-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {copiedCli ? "Copied!" : "Copy CLI command"}
          </TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}

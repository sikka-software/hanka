"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Filter, X } from "lucide-react";
import type { SkillIndex } from "@/lib/skills";
import SkillCard from "@/components/skill-card";
import AppHeader from "@/components/app-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  skills: SkillIndex[];
  username: string;
  repoName: string;
};

export default function DashboardClient({ skills, username, repoName }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    skills.forEach((s) => {
      cats.set(s.category, (cats.get(s.category) || 0) + 1);
    });
    return Array.from(cats.entries());
  }, [skills]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    skills.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        !selectedCategory || s.category === selectedCategory;
      const matchesTag = !selectedTag || s.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [skills, search, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const hasActiveFilters = selectedCategory || selectedTag;

  return (
    <>
      <AppHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            target="_blank"
            href={`https://github.com/${username}/${repoName}`}
          >
            @{username}/{repoName}
          </a>
        </div>
      </AppHeader>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b px-4 py-3 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {(selectedCategory ? 1 : 0) + (selectedTag ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Category
                    </div>
                    {categories.map(([cat, count]) => (
                      <DropdownMenuCheckboxItem
                        key={cat}
                        checked={selectedCategory === cat}
                        onCheckedChange={() =>
                          setSelectedCategory(
                            selectedCategory === cat ? null : cat,
                          )
                        }
                      >
                        {cat} ({count})
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                )}
                {tags.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium mt-2">
                      Tag
                    </div>
                    {tags.slice(0, 10).map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedTag === tag}
                        onCheckedChange={() =>
                          setSelectedTag(selectedTag === tag ? null : tag)
                        }
                      >
                        #{tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                )}
                {hasActiveFilters && (
                  <>
                    <div className="border-t mt-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={clearFilters}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear filters
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild>
              <Link href="/skills/new">
                <Plus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:block">Add Skill</span>
              </Link>
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="px-4 py-2 border-b flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1">
                #{selectedTag}
                <button onClick={() => setSelectedTag(null)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-6">
            {filteredSkills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>No skills found.</p>
                {skills.length === 0 && (
                  <Button asChild className="mt-4">
                    <Link href="/skills/new">Add your first skill</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.slug}
                    skill={skill}
                    username={username}
                    repoName={repoName}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

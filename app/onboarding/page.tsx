"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Repo = {
  name: string;
  private: boolean;
  description: string;
  updatedAt: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [tab, setTab] = useState("create");
  const [repoName, setRepoName] = useState("my-agent-skills");
  const [isPrivate, setIsPrivate] = useState(false);
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);

  useEffect(() => {
    const u = (window as unknown as { HANKA_USERNAME?: string }).HANKA_USERNAME;
    if (u) setUsername(u);
  }, []);

  useEffect(() => {
    if (tab === "existing") {
      setFetchingRepos(true);
      fetch("/api/repos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setRepos(data);
        })
        .finally(() => setFetchingRepos(false));
    }
  }, [tab]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, isPrivate }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast(data.error || "Failed to create repository");
      }
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to create repository",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName: selectedRepo }),
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="border border-neutral-800 rounded-lg p-8 bg-neutral-900 w-full max-w-md">
        <h1 className="text-2xl font-bold text-neutral-50 mb-2">
          Set up your skill library
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Create a new repo or use an existing one to store your skills.
        </p>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="create" className="flex-1">
              Create new
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex-1">
              Use existing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div>
              <Label htmlFor="repoName">Repository name</Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-agent-skills"
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isPrivate">
                  Private repository <Badge className="text-xs scale-80 translate-y-0.5">Soon</Badge>{" "}
                </Label>
                <p className="text-xs text-neutral-500">
                  Make this repo private
                </p>
              </div>
              <Switch
                disabled
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            {!isPrivate && username && (
              <p className="text-xs text-neutral-400 bg-neutral-800 p-3 rounded-lg">
                Skills in public repos can be installed by anyone using:{" "}
                <code className="text-neutral-300">
                  npx skills add {username}/{repoName} --skill skillname
                </code>
              </p>
            )}
            <Button
              onClick={handleCreate}
              disabled={loading || !repoName}
              className="w-full"
            >
              {loading ? "Creating..." : "Create repo"}
            </Button>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4">
            {fetchingRepos ? (
              <p className="text-neutral-400 text-sm">Loading repos...</p>
            ) : repos.length === 0 ? (
              <p className="text-neutral-400 text-sm">No repos found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {repos.map((repo) => (
                  <button
                    key={repo.name}
                    onClick={() => setSelectedRepo(repo.name)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRepo === repo.name
                        ? "border-neutral-500 bg-neutral-800"
                        : "border-neutral-700 hover:border-neutral-600"
                    }`}
                  >
                    <div className="font-medium text-neutral-100">
                      {repo.name}
                    </div>
                    {repo.description && (
                      <div className="text-sm text-neutral-400 truncate">
                        {repo.description}
                      </div>
                    )}
                    <div className="text-xs text-neutral-500 mt-1">
                      {repo.private ? "Private" : "Public"} · Updated{" "}
                      {new Date(repo.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <Button
              onClick={handleSelect}
              disabled={loading || !selectedRepo}
              className="w-full"
            >
              {loading ? "Selecting..." : "Use this repo"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

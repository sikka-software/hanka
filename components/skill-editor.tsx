"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TagInput from "./tag-input";
import SkillViewer from "./skill-viewer";
import type { SkillFrontmatter } from "@/lib/skills";
import { Loader2 } from "lucide-react";
import matter from "gray-matter";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

type Props = {
  initialFrontmatter?: SkillFrontmatter;
  initialBody?: string;
  existingSha?: string;
  onSave: (frontmatter: SkillFrontmatter, body: string) => Promise<void>;
  isSaving: boolean;
};

export default function SkillEditor({
  initialFrontmatter,
  initialBody,
  onSave,
  isSaving,
}: Props) {
  const [name, setName] = useState(initialFrontmatter?.name ?? "");
  const [description, setDescription] = useState(
    initialFrontmatter?.description ?? "",
  );
  const [license, setLicense] = useState(initialFrontmatter?.license ?? "");
  const [compatibility, setCompatibility] = useState(
    initialFrontmatter?.compatibility ?? "",
  );
  const [category, setCategory] = useState(
    initialFrontmatter?.metadata?.category ?? "general",
  );
  const [tags, setTags] = useState<string[]>(
    initialFrontmatter?.metadata?.tags ?? [],
  );
  const [version, setVersion] = useState(
    initialFrontmatter?.metadata?.version ?? "1.0.0",
  );
  const [isPublic, setIsPublic] = useState(
    initialFrontmatter?.metadata?.public ?? false,
  );
  const [body, setBody] = useState(initialBody ?? "");
  const [created] = useState(
    initialFrontmatter?.metadata?.created ??
      new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (initialFrontmatter) {
      setName(initialFrontmatter.name ?? "");
      setDescription(initialFrontmatter.description ?? "");
      setLicense(initialFrontmatter.license ?? "");
      setCompatibility(initialFrontmatter.compatibility ?? "");
      setCategory(initialFrontmatter.metadata?.category ?? "general");
      setTags(initialFrontmatter.metadata?.tags ?? []);
      setVersion(initialFrontmatter.metadata?.version ?? "1.0.0");
      setIsPublic(initialFrontmatter.metadata?.public ?? false);
    }
    if (initialBody !== undefined) {
      setBody(initialBody);
    }
  }, [initialFrontmatter, initialBody]);

  const handleBodyChange = useCallback((val: string) => {
    if (val.trimStart().startsWith("---")) {
      try {
        const { data, content } = matter(val);
        if (data.name) {
          setName(data.name ?? "");
          setDescription(data.description ?? "");
          setLicense(data.license ?? "");
          setCompatibility(data.compatibility ?? "");
          if (data.metadata) {
            setTags(Array.isArray(data.metadata.tags) ? data.metadata.tags : []);
            setCategory(data.metadata.category ?? "general");
            setVersion(data.metadata.version ?? "1.0.0");
            setIsPublic(Boolean(data.metadata.public ?? false));
          }
          setBody(content.trimStart());
          return;
        }
      } catch {
        // Not valid frontmatter, just use as-is
      }
    }
    setBody(val);
  }, []);

  const handleSave = async () => {
    const frontmatter: SkillFrontmatter = {
      name,
      description,
      license: license || undefined,
      compatibility: compatibility || undefined,
      metadata: {
        tags,
        category,
        version,
        public: isPublic,
        created,
        updated: new Date().toISOString().split("T")[0],
      },
    };
    await onSave(frontmatter, body);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skill name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="license">License (optional)</Label>
          <Input
            id="license"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            placeholder="MIT"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="compatibility">Compatibility (optional)</Label>
          <Input
            id="compatibility"
            value={compatibility}
            onChange={(e) => setCompatibility(e.target.value)}
            placeholder="gpt-4, claude"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="general"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-2">
            <TagInput value={tags} onChange={setTags} />
          </div>
        </div>

        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            className="mt-2"
          />
        </div>

        {/* needs more consideration */}
        {/* <div className="flex items-center justify-between">
          <Label htmlFor="public">Public</Label>
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div> */}

        <Button
          onClick={handleSave}
          disabled={isSaving || !name}
          className="w-full"
        >
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Skill
        </Button>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <CodeMirror
                value={body}
                onChange={handleBodyChange}
                height="400px"
                theme="dark"
              />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="border border-neutral-800 rounded-lg p-4 max-h-[400px] overflow-auto">
              <SkillViewer markdown={body} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

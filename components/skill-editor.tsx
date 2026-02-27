"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TagInput from "./tag-input";
import SkillViewer from "./skill-viewer";
import type { SkillFrontmatter, SkillFile } from "@/lib/skills";
import { Loader2, Plus, FileText, X } from "lucide-react";
import matter from "gray-matter";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

type Props = {
  initialFrontmatter?: SkillFrontmatter;
  initialBody?: string;
  initialFiles?: SkillFile[];
  existingSha?: string;
  onSave: (frontmatter: SkillFrontmatter, files: SkillFile[]) => Promise<void>;
  isSaving: boolean;
};

export default function SkillEditor({
  initialFrontmatter,
  initialBody,
  initialFiles,
  onSave,
  isSaving,
}: Props) {
  const [name, setName] = useState(() => initialFrontmatter?.name ?? "");
  const [description, setDescription] = useState(
    () => initialFrontmatter?.description ?? "",
  );
  const [license, setLicense] = useState(() => initialFrontmatter?.license ?? "");
  const [compatibility, setCompatibility] = useState(
    () => initialFrontmatter?.compatibility ?? "",
  );
  const [category, setCategory] = useState(
    () => initialFrontmatter?.metadata?.category ?? "general",
  );
  const [tags, setTags] = useState<string[]>(
    () => initialFrontmatter?.metadata?.tags ?? [],
  );
  const [version, setVersion] = useState(
    () => initialFrontmatter?.metadata?.version ?? "1.0.0",
  );
  const [isPublic, setIsPublic] = useState(
    () => initialFrontmatter?.metadata?.public ?? false,
  );
  const [body, setBody] = useState(() => initialBody ?? "");
  const [files, setFiles] = useState<SkillFile[]>(() => initialFiles ?? []);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isMultiFileMode, setIsMultiFileMode] = useState(() => (initialFiles?.length ?? 0) > 0);
  const [created] = useState(
    () => initialFrontmatter?.metadata?.created ??
      new Date().toISOString().split("T")[0],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
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
    if (initialFiles !== undefined) {
      setFiles(initialFiles);
    }
  }, [initialFrontmatter, initialBody, initialFiles]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const handleFileContentChange = useCallback((val: string) => {
    if (files[activeFileIndex].path.trimStart().startsWith("---")) {
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
          const newFiles = [...files];
          newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content: content.trimStart() };
          setFiles(newFiles);
          return;
        }
      } catch {
        // Not valid frontmatter, just use as-is
      }
    }
    const newFiles = [...files];
    newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content: val };
    setFiles(newFiles);
  }, [files, activeFileIndex]);

  const handleFilePathChange = useCallback((path: string) => {
    const newFiles = [...files];
    newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], path };
    setFiles(newFiles);
  }, [files, activeFileIndex]);

  const addNewFile = () => {
    const newFile: SkillFile = {
      path: `file-${files.length + 1}.txt`,
      content: "",
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const removeFile = (index: number) => {
    if (files.length <= 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(newFiles.length - 1);
    } else if (activeFileIndex > index) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  };

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

    const filesToSave = files.length > 0 ? files : [{ path: "SKILL.md", content: body }];
    await onSave(frontmatter, filesToSave);
  };

  const currentBody = isMultiFileMode ? files[activeFileIndex]?.content ?? "" : body;
  const isMultiFile = isMultiFileMode && files.length > 0;

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

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="multi-file">Multi-file skill</Label>
            <p className="text-xs text-neutral-400 mt-1">
              Bundle multiple files (scripts, references, assets)
            </p>
          </div>
          <Switch
            id="multi-file"
            checked={isMultiFileMode}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsMultiFileMode(true);
                if (files.length === 0) {
                  setFiles([{ path: "SKILL.md", content: body }]);
                }
              } else {
                const currentContent = files[activeFileIndex]?.content ?? "";
                setBody(currentContent);
                setIsMultiFileMode(false);
              }
            }}
          />
        </div>

        {isMultiFileMode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Files</Label>
              <Button variant="outline" size="sm" onClick={addNewFile}>
                <Plus className="w-4 h-4 mr-1" />
                Add File
              </Button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.map((file, index) => (
                <Card
                  key={index}
                  className={`p-2 cursor-pointer transition-colors ${
                    activeFileIndex === index
                      ? "border-primary bg-neutral-800"
                      : "border-neutral-800 hover:bg-neutral-800"
                  }`}
                  onClick={() => setActiveFileIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="flex-1 text-sm truncate">{file.path}</span>
                    {files.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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
        {isMultiFile && (
          <div>
            <Label>File Path</Label>
            <Input
              value={files[activeFileIndex]?.path ?? ""}
              onChange={(e) => handleFilePathChange(e.target.value)}
              placeholder="SKILL.md"
              className="mt-2"
            />
          </div>
        )}
        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <CodeMirror
                value={currentBody}
                onChange={isMultiFile ? handleFileContentChange : handleBodyChange}
                height="400px"
                theme="dark"
              />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="border border-neutral-800 rounded-lg p-4 max-h-[400px] overflow-auto">
              <SkillViewer markdown={currentBody} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

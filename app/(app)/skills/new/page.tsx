'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import SkillEditor from '@/components/skill-editor'
import AppHeader from '@/components/app-header'
import type { SkillFrontmatter, SkillFile } from '@/lib/skills'
import { parseSkillFile } from '@/lib/skills'
import { toast } from 'sonner'
import { useSync } from '@/lib/sync-context'

type ImportProgress = {
  current: number
  total: number
  filePath: string
}

export default function NewSkillPage() {
  const router = useRouter()
  const { syncedFetch } = useSync()
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [progress, setProgress] = useState<ImportProgress | null>(null)

  const [initialFrontmatter, setInitialFrontmatter] = useState<SkillFrontmatter | undefined>()
  const [initialBody, setInitialBody] = useState<string | undefined>()
  const [initialFiles, setInitialFiles] = useState<SkillFile[] | undefined>()
  const [initialMultiFile, setInitialMultiFile] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const handleImport = async () => {
    if (!importUrl.trim()) return
    
    setImporting(true)
    setImportError('')
    setProgress(null)
    setInitialFiles(undefined)
    setInitialFrontmatter(undefined)
    setInitialBody(undefined)
    
    abortRef.current = new AbortController()

    try {
      const res = await syncedFetch('/api/skills/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
        signal: abortRef.current.signal,
      })
      
      if (!res.ok) {
        const error = await res.json()
        setImportError(error.error || 'Failed to import skill')
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      const files: SkillFile[] = []
      let currentProgress: ImportProgress | null = null

      if (!reader) {
        setImportError('Failed to read response')
        return
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)

        for (const line of lines) {
          try {
            const event = JSON.parse(line)
            
            if (event.type === 'progress') {
              currentProgress = {
                current: event.current,
                total: event.total,
                filePath: event.filePath,
              }
              setProgress(currentProgress)
            } else if (event.type === 'file') {
              files.push({
                path: event.path,
                content: event.content,
              })
            } else if (event.type === 'error') {
              setImportError(event.message || 'Failed to import skill')
              return
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      if (files.length > 0) {
        setInitialFiles(files)
        setInitialMultiFile(files.length > 1)
        const skillMdFile = files.find((f: SkillFile) => f.path === 'SKILL.md')
        if (skillMdFile) {
          const { frontmatter, body } = parseSkillFile(skillMdFile.content)
          setInitialFrontmatter(frontmatter)
          setInitialBody(body)
        }
        toast.success(`Imported ${files.length} files successfully`)
      } else {
        setImportError('No files found in this repository path')
      }
      
      setImportUrl('')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Import was cancelled
        return
      }
      setImportError('Failed to import skill')
    } finally {
      setImporting(false)
      setProgress(null)
      abortRef.current = null
    }
  }

  const handleCancelImport = () => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }

  const handleSave = async (frontmatter: SkillFrontmatter, files: SkillFile[]) => {
    if (!frontmatter.name?.trim()) {
      setNameError("Name is required")
      setDescriptionError("")
      return
    }
    if (!frontmatter.description?.trim()) {
      setDescriptionError("Description is required")
      setNameError("")
      return
    }
    setNameError("")
    setDescriptionError("")
    setSaving(true)
    
    let toastId: string | number | undefined
    
    try {
      const body = files.find(f => f.path === 'SKILL.md')?.content ?? ''
      const res = await syncedFetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter, body, files }),
      })

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 409) {
          const errorMessage = error.error || 'A skill with this name already exists'
          setNameError(errorMessage)
          toast.error(errorMessage)
        } else {
          toast.error(error.error || 'Failed to save skill')
        }
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let slug = ''

      if (!reader) {
        toast.error('Failed to save skill')
        return
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)

        for (const line of lines) {
          try {
            const event = JSON.parse(line)
            
            if (event.type === 'progress') {
              if (toastId) {
                toast.loading(`Saving ${event.current}/${event.total}: ${event.filePath}`, {
                  id: toastId,
                })
              } else {
                toastId = toast.loading(`Saving 1/${event.total}: ${event.filePath}`, {
                  duration: Infinity,
                })
              }
            } else if (event.type === 'done') {
              slug = event.slug
            } else if (event.type === 'error') {
              toast.error(event.message || 'Failed to save skill')
              return
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      if (slug) {
        toast.success('Skill saved successfully!')
        router.push(`/skills/${slug}`)
      }
    } catch {
      toast.error('Failed to save skill')
    } finally {
      setSaving(false)
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }

  return (
    <>
      <AppHeader
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        }
      >
        <h1 className="text-lg font-semibold">Add Skill</h1>
      </AppHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="border border-neutral-800 rounded-lg p-4">
            <Label htmlFor="import-url" className="text-sm font-medium">
              Import from public repository
            </Label>
            <p className="text-sm text-neutral-400 mt-1 mb-3">
              Paste a GitHub URL pointing to a folder containing skill files and folders (e.g. <code className="text-xs bg-neutral-800 px-1 py-0.5 rounded">https://github.com/repo-name/skills/tree/main/skills/find-skills</code>)
            </p>
            <div className="flex gap-2">
              <Input
                id="import-url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/tree/main/skills/skill-name"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                disabled={importing}
              />
              {importing ? (
                <Button variant="outline" onClick={handleCancelImport}>
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleImport}
                  disabled={!importUrl.trim()}
                >
                  Import
                </Button>
              )}
            </div>
            
            {importing && progress && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Importing {progress.current} of {progress.total} files...
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round((progress.current / progress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(progress.current / progress.total) * 100} />
                <p className="text-xs text-muted-foreground truncate">
                  {progress.filePath}
                </p>
              </div>
            )}
            
            {importError && (
              <p className="text-sm text-red-400 mt-2">{importError}</p>
            )}
          </div>

          <SkillEditor
            onSave={handleSave}
            isSaving={saving}
            nameError={nameError}
            descriptionError={descriptionError}
            initialFrontmatter={initialFrontmatter}
            initialBody={initialBody}
            initialFiles={initialFiles}
            initialMultiFile={initialMultiFile}
          />
        </div>
      </div>
    </>
  )
}

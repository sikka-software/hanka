'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SkillEditor from '@/components/skill-editor'
import AppHeader from '@/components/app-header'
import type { SkillFrontmatter, SkillFile } from '@/lib/skills'
import { parseSkillFile } from '@/lib/skills'
import { Loader2 } from 'lucide-react'

export default function NewSkillPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')

  const [initialFrontmatter, setInitialFrontmatter] = useState<SkillFrontmatter | undefined>()
  const [initialBody, setInitialBody] = useState<string | undefined>()
  const [initialFiles, setInitialFiles] = useState<SkillFile[] | undefined>()
  const [initialMultiFile, setInitialMultiFile] = useState(false)

  const handleImport = async () => {
    if (!importUrl.trim()) return
    
    setImporting(true)
    setImportError('')
    
    try {
      const res = await fetch('/api/skills/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        setImportError(error.error || 'Failed to import skill')
        return
      }
      
      const { content, files } = await res.json()
      
      if (files && Array.isArray(files) && files.length > 0) {
        setInitialFiles(files)
        setInitialMultiFile(files.length > 1)
        const skillMdFile = files.find((f: SkillFile) => f.path === 'SKILL.md')
        if (skillMdFile) {
          const { frontmatter, body } = parseSkillFile(skillMdFile.content)
          setInitialFrontmatter(frontmatter)
          setInitialBody(body)
        }
      } else {
        const { frontmatter, body } = parseSkillFile(content)
        setInitialFrontmatter(frontmatter)
        setInitialBody(body)
      }
      setImportUrl('')
    } catch {
      setImportError('Failed to import skill')
    } finally {
      setImporting(false)
    }
  }

  const handleSave = async (frontmatter: SkillFrontmatter, files: SkillFile[]) => {
    setSaving(true)
    try {
      const body = files.find(f => f.path === 'SKILL.md')?.content ?? ''
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter, body, files }),
      })
      if (res.ok) {
        const { slug } = await res.json()
        router.push(`/skills/${slug}`)
      }
    } finally {
      setSaving(false)
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
              />
              <Button
                variant="outline"
                onClick={handleImport}
                disabled={importing || !importUrl.trim()}
              >
                {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Import
              </Button>
            </div>
            {importError && (
              <p className="text-sm text-red-400 mt-2">{importError}</p>
            )}
          </div>

          <SkillEditor
            onSave={handleSave}
            isSaving={saving}
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

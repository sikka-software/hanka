'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SkillEditor from '@/components/skill-editor'
import AppHeader from '@/components/app-header'
import type { SkillFrontmatter, SkillFile } from '@/lib/skills'

function indexToFrontmatter(data: { name: string; description: string; license?: string; compatibility?: string; tags: string[]; category: string; version: string; public: boolean; created: string; updated: string }): SkillFrontmatter {
  return {
    name: data.name,
    description: data.description,
    license: data.license,
    compatibility: data.compatibility,
    metadata: {
      tags: data.tags,
      category: data.category,
      version: data.version,
      public: data.public,
      created: data.created,
      updated: data.updated,
    },
  }
}

export default function EditSkillPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [frontmatter, setFrontmatter] = useState<SkillFrontmatter | undefined>()
  const [body, setBody] = useState<string | undefined>()
  const [files, setFiles] = useState<SkillFile[] | undefined>()
  const [fileShas, setFileShas] = useState<{ path: string; sha: string }[]>([])
  const [sha, setSha] = useState<string | undefined>()
  const [skillName, setSkillName] = useState<string>('')

  useEffect(() => {
    fetch(`/api/skills/${slug}`)
      .then(res => res.json())
      .then(data => {
        setFrontmatter(indexToFrontmatter(data))
        setBody(data.body)
        setSha(data.sha)
        setSkillName(data.name)
        if (data.files && Array.isArray(data.files) && data.files.length > 0) {
          setFiles(data.files)
          if (data.fileShas) {
            setFileShas(data.fileShas)
          }
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleSave = async (fm: SkillFrontmatter, skillFiles: SkillFile[], skillFileShas?: { path: string; sha: string }[]) => {
    if (!sha) return
    setSaving(true)
    try {
      const bodyContent = skillFiles.find(f => f.path === 'SKILL.md')?.content ?? body ?? ''
      const fileShasToUse = skillFileShas ?? fileShas
      const res = await fetch(`/api/skills/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter: fm, body: bodyContent, sha, files: skillFiles, fileShas: fileShasToUse }),
      })
      if (res.ok) {
        const { slug: newSlug } = await res.json()
        router.push(`/skills/${newSlug}`)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader>
          <h1 className="text-lg font-semibold">Edit Skill</h1>
        </AppHeader>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    )
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
        <h1 className="text-lg font-semibold">Edit: {skillName}</h1>
      </AppHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <SkillEditor
            initialFrontmatter={frontmatter}
            initialBody={body}
            initialFiles={files}
            existingSha={sha}
            existingFileShas={fileShas}
            onSave={handleSave}
            isSaving={saving}
          />
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SkillEditor from '@/components/skill-editor'
import AppHeader from '@/components/app-header'
import type { SkillFrontmatter, SkillIndex } from '@/lib/skills'

function indexToFrontmatter(data: SkillIndex): SkillFrontmatter {
  return {
    name: data.name,
    description: data.description,
    license: data.license,
    compatibility: data.compatibility,
    metadata: data.metadata,
    hanka: {
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
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleSave = async (fm: SkillFrontmatter, b: string) => {
    if (!sha) return
    setSaving(true)
    try {
      const res = await fetch(`/api/skills/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter: fm, body: b, sha }),
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
            existingSha={sha}
            onSave={handleSave}
            isSaving={saving}
          />
        </div>
      </div>
    </>
  )
}

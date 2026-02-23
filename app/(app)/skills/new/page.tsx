'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SkillEditor from '@/components/skill-editor'
import AppHeader from '@/components/app-header'
import type { SkillFrontmatter } from '@/lib/skills'

export default function NewSkillPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async (frontmatter: SkillFrontmatter, body: string) => {
    setSaving(true)
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontmatter, body }),
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
        <h1 className="text-lg font-semibold">New Skill</h1>
      </AppHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <SkillEditor onSave={handleSave} isSaving={saving} />
        </div>
      </div>
    </>
  )
}

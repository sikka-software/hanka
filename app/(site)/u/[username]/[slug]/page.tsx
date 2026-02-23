import { getPublicIndex, getPublicSkillFile } from '@/lib/github'
import { parseSkillFile } from '@/lib/skills'
import { notFound } from 'next/navigation'
import SkillViewer from '@/components/skill-viewer'
import CopyButton from '@/components/copy-button'

export default async function PublicSkillPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>
}) {
  const { username, slug } = await params
  const index = await getPublicIndex(username, 'my-agent-skills')
  const meta = index.find(s => s.slug === slug)

  if (!meta) notFound()

  const content = await getPublicSkillFile(username, 'my-agent-skills', meta.filePath)
  if (!content) notFound()

  const { body } = parseSkillFile(content)
  const cliCommand = `npx skills add ${username}/${slug} --skill [skillname]`

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href={`/u/${username}`} className="text-sm text-neutral-400 hover:text-neutral-200 mb-4 block">
            ← @{username}
          </a>
          <h1 className="text-3xl font-bold mb-2">{meta.name}</h1>
          <p className="text-neutral-400 mb-4">{meta.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded">{meta.category}</span>
            <span className="text-xs text-neutral-500">v{meta.version}</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-400 mb-2">CLI Command</p>
          <code className="text-sm font-mono text-neutral-100">{cliCommand}</code>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <CopyButton text={body} label="Copy Raw" />
          <CopyButton text={cliCommand} label="Copy CLI" />
        </div>

        <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-900">
          <SkillViewer markdown={body} />
        </div>
      </div>
    </main>
  )
}

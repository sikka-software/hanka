import { getPublicIndex } from '@/lib/github'
import SkillCard from '@/components/skill-card'
import { notFound } from 'next/navigation'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const skills = await getPublicIndex(username, 'my-agent-skills')

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">@{username}</h1>
        <p className="text-neutral-400 mb-8">Public skills</p>

        {skills.length === 0 ? (
          <p className="text-neutral-500">No public skills found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map(skill => (
              <div key={skill.slug} className="cursor-pointer">
                <a href={`/u/${username}/${skill.slug}`} className="block">
                  <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900 hover:border-neutral-700 transition-colors">
                    <h3 className="font-semibold text-neutral-100 mb-2">{skill.name}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{skill.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded">{skill.category}</span>
                      <span className="text-xs text-neutral-500">v{skill.version}</span>
                    </div>
                    {skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skill.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-neutral-500">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

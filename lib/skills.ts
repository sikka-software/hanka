import matter from 'gray-matter'
import slugify from 'slugify'

export type HankaMeta = {
  tags: string[]
  category: string
  version: string
  public: boolean
  created: string
  updated: string
}

export type SkillFrontmatter = {
  name: string
  description: string
  license?: string
  compatibility?: string
  metadata?: Record<string, string>
  hanka: HankaMeta
}

export type SkillIndex = {
  slug: string
  filePath: string
  name: string
  description: string
  license?: string
  compatibility?: string
  metadata?: Record<string, string>
  tags: string[]
  category: string
  version: string
  public: boolean
  created: string
  updated: string
}

export type Skill = SkillIndex & {
  body: string
  rawMarkdown: string
  sha: string
}

export function generateSlug(name: string): string {
  return slugify(name, { lower: true, strict: true })
}

export function generateFilePath(slug: string): string {
  return `skills/${slug}/SKILL.md`
}

export function serializeSkill(frontmatter: SkillFrontmatter, body: string): string {
  return matter.stringify(body, frontmatter as Record<string, unknown>)
}

export function parseSkillFile(rawMarkdown: string): {
  frontmatter: SkillFrontmatter
  body: string
} {
  const { data, content } = matter(rawMarkdown)
  const hanka = data.hanka ?? {}
  return {
    frontmatter: {
      name: data.name ?? '',
      description: data.description ?? '',
      license: data.license,
      compatibility: data.compatibility,
      metadata: data.metadata,
      hanka: {
        tags: Array.isArray(hanka.tags) ? hanka.tags : [],
        category: hanka.category ?? 'general',
        version: hanka.version ?? '1.0.0',
        public: Boolean(hanka.public ?? false),
        created: hanka.created ?? new Date().toISOString().split('T')[0],
        updated: hanka.updated ?? new Date().toISOString().split('T')[0],
      },
    },
    body: content,
  }
}

export function buildSkillIndex(
  frontmatter: SkillFrontmatter,
  slug: string,
  filePath: string
): SkillIndex {
  return {
    slug,
    filePath,
    name: frontmatter.name,
    description: frontmatter.description,
    license: frontmatter.license,
    compatibility: frontmatter.compatibility,
    metadata: frontmatter.metadata,
    tags: frontmatter.hanka.tags,
    category: frontmatter.hanka.category,
    version: frontmatter.hanka.version,
    public: frontmatter.hanka.public,
    created: frontmatter.hanka.created,
    updated: frontmatter.hanka.updated,
  }
}

export function indexToFrontmatter(index: SkillIndex): SkillFrontmatter {
  return {
    name: index.name,
    description: index.description,
    license: index.license,
    compatibility: index.compatibility,
    metadata: index.metadata,
    hanka: {
      tags: index.tags,
      category: index.category,
      version: index.version,
      public: index.public,
      created: index.created,
      updated: index.updated,
    },
  }
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

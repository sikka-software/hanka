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

export type SkillFile = {
  path: string
  content: string
}

export type SkillFrontmatter = {
  name: string
  description: string
  license?: string
  compatibility?: string
  metadata: HankaMeta
  files?: SkillFile[]
}

export type SkillIndex = {
  slug: string
  filePath: string
  name: string
  description: string
  license?: string
  compatibility?: string
  tags: string[]
  category: string
  version: string
  public: boolean
  created: string
  updated: string
  fileCount?: number
}

export type Skill = SkillIndex & {
  body: string
  rawMarkdown: string
  sha: string
  files?: SkillFile[]
}

export function generateSlug(name: string): string {
  return slugify(name, { lower: true, strict: true })
}

export function generateFilePath(slug: string): string {
  return `skills/${slug}/SKILL.md`
}

export function generateSkillFolderPath(slug: string): string {
  return `skills/${slug}`
}

export function getSkillMdPath(slug: string): string {
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
  const metadata = data.metadata ?? {}
  return {
    frontmatter: {
      name: data.name ?? '',
      description: data.description ?? '',
      license: data.license,
      compatibility: data.compatibility,
      metadata: {
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        category: metadata.category ?? 'general',
        version: metadata.version ?? '1.0.0',
        public: Boolean(metadata.public ?? false),
        created: metadata.created ?? new Date().toISOString().split('T')[0],
        updated: metadata.updated ?? new Date().toISOString().split('T')[0],
      },
    },
    body: content,
  }
}

export function buildSkillIndex(
  frontmatter: SkillFrontmatter,
  slug: string,
  filePath: string,
  fileCount?: number
): SkillIndex {
  return {
    slug,
    filePath,
    name: frontmatter.name,
    description: frontmatter.description,
    license: frontmatter.license,
    compatibility: frontmatter.compatibility,
    tags: frontmatter.metadata.tags,
    category: frontmatter.metadata.category,
    version: frontmatter.metadata.version,
    public: frontmatter.metadata.public,
    created: frontmatter.metadata.created,
    updated: frontmatter.metadata.updated,
    fileCount,
  }
}

export function indexToFrontmatter(index: SkillIndex): SkillFrontmatter {
  return {
    name: index.name,
    description: index.description,
    license: index.license,
    compatibility: index.compatibility,
    metadata: {
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

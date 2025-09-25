import { useEffect, useMemo, useState } from 'react'
import { PreviewProps, useClient } from 'sanity'

type TagReferenceValue = {
  _ref?: string
  _id?: string
  title?: string
  color?: unknown
}

type TagDocument = {
  _id: string
  overskrift?: string
  name?: string
  color?: unknown
}

type ResolvedTag = {
  id: string
  title: string
  color?: string
}

type TagReference = {
  rawId: string
  normalizedId: string
  fallbackTitle?: string
  fallbackColor?: string
}

const apiVersion = '2024-05-01'
const DEFAULT_TAG_TITLE = 'Uten navn'
const DEFAULT_TEXT_COLOR = '#1a1a1a'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractColor = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (isRecord(value) && typeof value.hex === 'string') return value.hex
  return undefined
}

const stripDraftPrefix = (id: string) =>
  id.startsWith('drafts.') ? id.slice('drafts.'.length) : id

const ensurePreviewValue = (
  props: PreviewProps
): Record<string, unknown> | null => {
  const value = (props as { value?: unknown }).value
  return isRecord(value) ? value : null
}

const toTagReference = (
  candidate: TagReferenceValue | undefined
): TagReference | null => {
  if (!candidate || !isRecord(candidate)) return null

  let rawId: string | null = null
  if (typeof candidate._ref === 'string') {
    rawId = candidate._ref
  } else if (typeof candidate._id === 'string') {
    rawId = candidate._id
  }

  if (!rawId) return null

  return {
    rawId,
    normalizedId: stripDraftPrefix(rawId),
    fallbackTitle:
      typeof candidate.title === 'string' ? candidate.title : undefined,
    fallbackColor: extractColor(candidate.color),
  }
}

const toTagReferences = (value: unknown): TagReference[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => toTagReference(item as TagReferenceValue | undefined))
    .filter((item): item is TagReference => Boolean(item))
}

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = hex.replace(/^#/, '')

  if (normalized.length === 3) {
    const components = normalized
      .split('')
      .map((char) => parseInt(char + char, 16))
    return components.some(Number.isNaN)
      ? null
      : [components[0], components[1], components[2]]
  }

  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16)
    const g = parseInt(normalized.slice(2, 4), 16)
    const b = parseInt(normalized.slice(4, 6), 16)
    return [r, g, b].some(Number.isNaN) ? null : [r, g, b]
  }

  return null
}

const getTextColorForBackground = (hex?: string): string => {
  if (!hex) return DEFAULT_TEXT_COLOR

  const rgb = hexToRgb(hex)
  if (!rgb) return DEFAULT_TEXT_COLOR

  const [r, g, b] = rgb
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  return luminance > 0.6 ? DEFAULT_TEXT_COLOR : '#ffffff'
}

const buildTagSignature = (references: TagReference[]): string =>
  references
    .map(
      ({ rawId, fallbackTitle, fallbackColor }, index) =>
        `${index}:${rawId}:${fallbackTitle ?? ''}:${fallbackColor ?? ''}`
    )
    .join('|')

const mapToResolvedTag = (
  reference: TagReference,
  document?: TagDocument
): ResolvedTag => ({
  id: reference.normalizedId,
  title:
    reference.fallbackTitle ??
    document?.overskrift ??
    document?.name ??
    DEFAULT_TAG_TITLE,
  color: reference.fallbackColor ?? extractColor(document?.color),
})

const useResolvedTags = (
  client: ReturnType<typeof useClient>,
  references: TagReference[]
) => {
  const [resolvedTags, setResolvedTags] = useState<ResolvedTag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const signature = useMemo(() => buildTagSignature(references), [references])

  useEffect(() => {
    if (references.length === 0) {
      setResolvedTags([])
      setIsLoading(false)
      return
    }

    const allHaveTitles = references.every((ref) => ref.fallbackTitle)
    if (allHaveTitles) {
      setResolvedTags(references.map((ref) => mapToResolvedTag(ref)))
      setIsLoading(false)
      return
    }

    const idsToFetch = Array.from(
      new Set(references.flatMap((ref) => [ref.rawId, ref.normalizedId]))
    )

    if (idsToFetch.length === 0) {
      setResolvedTags([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    const resolve = async () => {
      setIsLoading(true)

      const docs = await client.fetch<TagDocument[]>(
        '*[_type == "tag" && _id in $ids]{_id, overskrift, name, color}',
        { ids: idsToFetch }
      )

      if (cancelled) return

      const documentById = new Map<string, TagDocument>()
      docs.forEach((doc) => {
        documentById.set(stripDraftPrefix(doc._id), doc)
      })

      setResolvedTags(
        references.map((ref) =>
          mapToResolvedTag(ref, documentById.get(ref.normalizedId))
        )
      )

      setIsLoading(false)
    }

    resolve()

    return () => {
      cancelled = true
    }
  }, [client, signature, references])

  return { resolvedTags, isLoading }
}

export const TaggedDocumentPreview = (props: PreviewProps) => {
  const previewValue = ensurePreviewValue(props)
  const tagReferences = useMemo(
    () => toTagReferences(previewValue?.tags),
    [previewValue?.tags]
  )

  const client = useClient({ apiVersion })
  const { resolvedTags, isLoading } = useResolvedTags(client, tagReferences)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {props.renderDefault(props)}
      {(isLoading || resolvedTags.length > 0) && (
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {isLoading && (
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Laster tags …
            </span>
          )}
          {resolvedTags.map((tag) => {
            const backgroundColor = tag.color ?? '#e5e7eb'
            const textColor = getTextColorForBackground(backgroundColor)

            return (
              <span
                key={tag.id}
                style={{
                  background: backgroundColor,
                  color: textColor,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                {tag.title}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TaggedDocumentPreview

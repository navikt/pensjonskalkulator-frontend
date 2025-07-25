import { definePlugin } from 'sanity'
import type { DocumentActionComponent } from 'sanity'

interface SanityDocument {
  _id?: string
  _type?: string
  _rev?: string
  innhold?: SanityBlock[]
  overskrift?: string
  name?: string
  [key: string]: unknown
}

interface SanityBlock {
  _type: string
  _key: string
  children?: SanitySpan[]
  [key: string]: unknown
}

interface SanitySpan {
  _type: string
  _key: string
  text?: string
  [key: string]: unknown
}

interface CurrentUserInfo {
  displayName?: string
  name?: string
  email?: string
}

interface SlackMessageData {
  eventType: string
  documentId: string
  beforeTitle: string
  afterTitle: string
  beforeContent: string
  afterContent: string
  docType: string
  author: string
}

interface ContentStrings {
  beforeTitle: string
  afterTitle: string
  beforeContent: string
  afterContent: string
}

const WEBHOOK_URL = process.env.SANITY_SLACK_WEBHOOK_URL

const ALLOWED_DOCUMENT_TYPES = [
  'readmore',
  'forbeholdAvsnitt',
  'guidepanel',
] as const

const ACTION_EVENT_MAP = {
  publish: 'document.published',
  unpublish: 'document.unpublished',
  delete: 'document.deleted',
  create: 'document.created',
} as const

const ACTION_CONFIG = {
  published: { emoji: '📢', norwegian: 'PUBLISERT' },
  unpublished: { emoji: '📝', norwegian: 'AVPUBLISERT' },
  deleted: { emoji: '🗑️', norwegian: 'SLETTET' },
  created: { emoji: '✨', norwegian: 'OPPRETTET' },
} as const

const MAX_CONTENT_PREVIEW_LENGTH = 300
const MAX_CHANGE_PREVIEW_LENGTH = 200

const extractTextContent = (document: SanityDocument): string => {
  const content = document.innhold
  if (!Array.isArray(content)) return ''

  return content
    .filter(
      (block): block is SanityBlock & { children: SanitySpan[] } =>
        block._type === 'block' && Array.isArray(block.children)
    )
    .map((block) =>
      block.children
        .filter((child) => child._type === 'span' && child.text)
        .map((child) => child.text)
        .join('')
        .trim()
    )
    .filter(Boolean)
    .join('\n\n')
}

const extractTitle = (document: SanityDocument): string => {
  return document.overskrift || document.name || ''
}

const createContentStrings = (
  before: SanityDocument,
  after: SanityDocument
): ContentStrings => ({
  beforeTitle: extractTitle(before),
  afterTitle: extractTitle(after),
  beforeContent: extractTextContent(before),
  afterContent: extractTextContent(after),
})

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

const formatTimestamp = (): string => {
  return new Date().toLocaleString('no-NO', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatSlackMessage = (data: SlackMessageData): string => {
  const action = data.eventType.replace(
    'document.',
    ''
  ) as keyof typeof ACTION_CONFIG
  const config = ACTION_CONFIG[action] || {
    emoji: '📄',
    norwegian: action.toUpperCase(),
  }
  const title = data.afterTitle || data.beforeTitle || 'Untitled'

  const lines: string[] = [
    `${config.emoji} DOKUMENT ${config.norwegian} ━━━━━━━━━━━━━━━━`,
    '',
    `📋 Tittel: ${title}`,
    `👤 Forfatter: ${data.author}`,
    `🕒 Tidspunkt: ${formatTimestamp()}`,
    `🔗 Type: ${data.docType}`,
    `🆔 ID: ${data.documentId}`,
    '',
  ]

  if (
    action === 'published' &&
    data.beforeContent &&
    data.afterContent &&
    data.beforeContent !== data.afterContent
  ) {
    lines.push(
      '🔄 ENDRINGER I INNHOLD:',
      '',
      `⬅️ Tidligere innhold:`,
      truncateText(data.beforeContent, MAX_CHANGE_PREVIEW_LENGTH),
      '',
      `➡️ Nytt innhold:`,
      truncateText(data.afterContent, MAX_CHANGE_PREVIEW_LENGTH),
      ''
    )
  } else if (data.afterContent || data.beforeContent) {
    const content = data.afterContent || data.beforeContent
    lines.push(
      '📝 INNHOLD:',
      truncateText(content, MAX_CONTENT_PREVIEW_LENGTH),
      ''
    )
  }

  const actionMessages = {
    deleted: '🗑️ Dokumentet er permanent slettet',
    unpublished: '📝 Dokumentet er tatt ned fra publisering',
    created: '✨ Nytt dokument har blitt opprettet',
    published: '📢 Dokumentet er nå publisert og tilgjengelig',
  }

  if (action in actionMessages) {
    lines.push(actionMessages[action])
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  return lines.join('\n')
}

const getDocumentsForEvent = (
  eventType: string,
  props: Parameters<DocumentActionComponent>[0]
): { before: SanityDocument | null; after: SanityDocument | null } => {
  const published = props.published as SanityDocument | undefined
  const draft = props.draft as SanityDocument | undefined

  switch (eventType) {
    case 'document.unpublished':
    case 'document.deleted':
      return { before: published || draft || null, after: null }
    case 'document.created':
      return { before: null, after: draft || null }
    case 'document.published':
    default:
      return { before: published || null, after: draft || null }
  }
}

async function sendDocumentWebhook(
  eventType: string,
  before: SanityDocument | null,
  after: SanityDocument | null,
  author: string = 'Sanity User'
): Promise<void> {
  const documentId = after?._id || before?._id || 'unknown'
  console.log(
    `sendDocumentWebhook called for: ${documentId}, event: ${eventType}`
  )

  if (!WEBHOOK_URL) {
    console.warn('No webhook URL configured for document events')
    return
  }

  try {
    let contentData: ContentStrings = {
      beforeTitle: '',
      afterTitle: '',
      beforeContent: '',
      afterContent: '',
    }

    if (before && after) {
      contentData = createContentStrings(before, after)
    } else if (after) {
      contentData.afterTitle = extractTitle(after)
      contentData.afterContent = extractTextContent(after)
    } else if (before) {
      contentData.beforeTitle = extractTitle(before)
      contentData.beforeContent = extractTextContent(before)
    }

    const docType = after?._type || before?._type || 'unknown'

    console.log('Sending webhook payload:', {
      event: eventType,
      document_id: documentId,
      document_type: docType,
      hasBeforeTitle: !!contentData.beforeTitle,
      hasAfterTitle: !!contentData.afterTitle,
      hasBeforeContent: !!contentData.beforeContent,
      hasAfterContent: !!contentData.afterContent,
    })

    const message = formatSlackMessage({
      eventType,
      documentId,
      docType,
      author,
      ...contentData,
    })

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ text: message }),
    })

    console.log('Webhook sent successfully (no-cors mode)')
  } catch (error) {
    console.error('Document webhook error:', error)
  }
}

export function createActionWithWebhook(
  originalAction: DocumentActionComponent,
  eventType: string,
  currentUser?: CurrentUserInfo | null
): DocumentActionComponent {
  const ActionWithWebhook: DocumentActionComponent = (
    props: Parameters<DocumentActionComponent>[0] & { onComplete?: () => void }
  ) => {
    const originalResult = originalAction(props)
    if (!originalResult) return null

    const label =
      typeof originalResult.label === 'string'
        ? originalResult.label
        : eventType.charAt(0).toUpperCase() + eventType.slice(1)

    return {
      ...originalResult,
      label,
      onHandle: () => {
        ;(async () => {
          try {
            if (typeof originalResult.onHandle === 'function') {
              await Promise.resolve(originalResult.onHandle())
            }

            const { before, after } = getDocumentsForEvent(eventType, props)

            const authorName =
              currentUser?.displayName ||
              currentUser?.name ||
              currentUser?.email ||
              'Sanity User'

            if (before || after) {
              await sendDocumentWebhook(eventType, before, after, authorName)
            }
          } catch (error) {
            console.error(`Error during ${eventType} action:`, error)
          } finally {
            if (typeof props.onComplete === 'function') {
              props.onComplete()
            }
          }
        })()
      },
    }
  }

  return ActionWithWebhook
}

export const webhookPlugin = definePlugin({
  name: 'webhook-plugin',
  document: {
    actions: (prev, { schemaType, currentUser }) => {
      const isAllowedType = (
        type: string
      ): type is (typeof ALLOWED_DOCUMENT_TYPES)[number] =>
        (ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(type)
      if (!isAllowedType(schemaType)) {
        return prev
      }

      return prev.map((action) => {
        const eventType =
          ACTION_EVENT_MAP[action.action as keyof typeof ACTION_EVENT_MAP]
        return eventType
          ? createActionWithWebhook(action, eventType, currentUser || undefined)
          : action
      })
    },
  },
})

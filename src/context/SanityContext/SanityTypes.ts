export type Content = {
  _type: 'content'
  children?: Array<
    | {
        marks?: Array<string>
        text?: string
        _type: 'span'
        _key: string
      }
    | {
        _ref: string
        _type: 'reference'
        _weak?: boolean
        _key: string
        [internalGroqTypeReferenceTo]?: 'faktagrunnlag'
      }
  >
  style?: 'normal'
  listItem?: 'bullet'
  markDefs?: null
  level?: number
}

export type SanityReadMore = {
  name: string
  overskrift: string
  innhold: Array<
    {
      _key: string
    } & Content
  >
  language: Locales
}

export type SanityForbeholdAvsnitt = {
  name: string
  overskrift: string
  order: number
  innhold: Array<
    {
      _key: string
    } & Content
  >
  language: Locales
}

export declare const internalGroqTypeReferenceTo: unique symbol

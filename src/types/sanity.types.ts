// Query TypeMap
import '@sanity/client'

/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type LocaleString = {
  _type: 'localeString'
  nb?: string
  nn?: string
  en?: string
}

export type TranslationMetadata = {
  _id: string
  _type: 'translation.metadata'
  _createdAt: string
  _updatedAt: string
  _rev: string
  translations?: Array<
    {
      _key: string
    } & InternationalizedArrayReferenceValue
  >
  schemaTypes?: Array<string>
}

export type InternationalizedArrayReferenceValue = {
  _type: 'internationalizedArrayReferenceValue'
  value?:
    | {
        _ref: string
        _type: 'reference'
        _weak?: boolean
        [internalGroqTypeReferenceTo]?: 'readmore'
      }
    | {
        _ref: string
        _type: 'reference'
        _weak?: boolean
        [internalGroqTypeReferenceTo]?: 'forbeholdAvsnitt'
      }
    | {
        _ref: string
        _type: 'reference'
        _weak?: boolean
        [internalGroqTypeReferenceTo]?: 'guidepanel'
      }
}

export type Guidepanel = {
  _id: string
  _type: 'guidepanel'
  _createdAt: string
  _updatedAt: string
  _rev: string
  language?: string
  name: string
  overskrift?: string
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'normal'
      | 'listTitle'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'blockquote'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}

export type ForbeholdAvsnitt = {
  _id: string
  _type: 'forbeholdAvsnitt'
  _createdAt: string
  _updatedAt: string
  _rev: string
  language?: string
  name: string
  overskrift?: string
  order?: number
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'normal'
      | 'listTitle'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'blockquote'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}

export type Readmore = {
  _id: string
  _type: 'readmore'
  _createdAt: string
  _updatedAt: string
  _rev: string
  language?: string
  name: string
  overskrift?: string
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'normal'
      | 'listTitle'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'blockquote'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}

export type InternationalizedArrayReference = Array<
  {
    _key: string
  } & InternationalizedArrayReferenceValue
>

export type SanityImagePaletteSwatch = {
  _type: 'sanity.imagePaletteSwatch'
  background?: string
  foreground?: string
  population?: number
  title?: string
}

export type SanityImagePalette = {
  _type: 'sanity.imagePalette'
  darkMuted?: SanityImagePaletteSwatch
  lightVibrant?: SanityImagePaletteSwatch
  darkVibrant?: SanityImagePaletteSwatch
  vibrant?: SanityImagePaletteSwatch
  dominant?: SanityImagePaletteSwatch
  lightMuted?: SanityImagePaletteSwatch
  muted?: SanityImagePaletteSwatch
}

export type SanityImageDimensions = {
  _type: 'sanity.imageDimensions'
  height?: number
  width?: number
  aspectRatio?: number
}

export type SanityImageHotspot = {
  _type: 'sanity.imageHotspot'
  x?: number
  y?: number
  height?: number
  width?: number
}

export type SanityImageCrop = {
  _type: 'sanity.imageCrop'
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type SanityFileAsset = {
  _id: string
  _type: 'sanity.fileAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  source?: SanityAssetSourceData
}

export type SanityImageAsset = {
  _id: string
  _type: 'sanity.imageAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  metadata?: SanityImageMetadata
  source?: SanityAssetSourceData
}

export type SanityImageMetadata = {
  _type: 'sanity.imageMetadata'
  location?: Geopoint
  dimensions?: SanityImageDimensions
  palette?: SanityImagePalette
  lqip?: string
  blurHash?: string
  hasAlpha?: boolean
  isOpaque?: boolean
}

export type Geopoint = {
  _type: 'geopoint'
  lat?: number
  lng?: number
  alt?: number
}

export type Slug = {
  _type: 'slug'
  current: string
  source?: string
}

export type SanityAssetSourceData = {
  _type: 'sanity.assetSourceData'
  name?: string
  id?: string
  url?: string
}

export type AllSanitySchemaTypes =
  | LocaleString
  | TranslationMetadata
  | InternationalizedArrayReferenceValue
  | Guidepanel
  | ForbeholdAvsnitt
  | Readmore
  | InternationalizedArrayReference
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityImageHotspot
  | SanityImageCrop
  | SanityFileAsset
  | SanityImageAsset
  | SanityImageMetadata
  | Geopoint
  | Slug
  | SanityAssetSourceData
export declare const internalGroqTypeReferenceTo: unique symbol
// Source: ./src/context/LanguageProvider/LanguageProvider.tsx
// Variable: forbeholdAvsnittQuery
// Query: *[_type == "forbeholdAvsnitt" && language == $locale] | order(order asc) | {overskrift,innhold}
export type ForbeholdAvsnittQueryResult = Array<{
  overskrift: string | null
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'blockquote'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'listTitle'
      | 'normal'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}>
// Variable: guidePanelQuery
// Query: *[_type == "guidepanel" && language == $locale] | {name,overskrift,innhold}
export type GuidePanelQueryResult = Array<{
  name: string
  overskrift: string | null
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'blockquote'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'listTitle'
      | 'normal'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}>
// Variable: readMoreQuery
// Query: *[_type == "readmore" && language == $locale] | {name,overskrift,innhold}
export type ReadMoreQueryResult = Array<{
  name: string
  overskrift: string | null
  innhold: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?:
      | 'blockquote'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'listTitle'
      | 'normal'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      blank?: boolean
      className?: '' | 'nowrap'
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
}>

declare module '@sanity/client' {
  interface SanityQueries {
    '*[_type == "forbeholdAvsnitt" && language == $locale] | order(order asc) | {overskrift,innhold}': ForbeholdAvsnittQueryResult
    '*[_type == "guidepanel" && language == $locale] | {name,overskrift,innhold}': GuidePanelQueryResult
    '*[_type == "readmore" && language == $locale] | {name,overskrift,innhold}': ReadMoreQueryResult
  }
}

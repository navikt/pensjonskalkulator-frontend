import React from 'react'

import {
  ForbeholdAvsnittQueryResult,
  GuidePanelQueryResult,
  ReadMoreQueryResult,
} from '@/types/sanity.types'

interface SanityContext {
  guidePanelData: Record<string, GuidePanelQueryResult[number]>
  readMoreData: Record<string, ReadMoreQueryResult[number]>
  forbeholdAvsnittData: ForbeholdAvsnittQueryResult
}

export const SanityContext = React.createContext<SanityContext>({
  guidePanelData: {},
  readMoreData: {},
  forbeholdAvsnittData: [],
})

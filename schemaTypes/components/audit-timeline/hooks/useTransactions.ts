import type { SanityClient } from '@sanity/client'
import { useEffect, useState } from 'react'

import {
  listTransactionsDatasetPage,
  listTransactionsForDocument,
} from '../api/history'
import { DEFAULT_LIMIT, DEFAULT_PER_PAGE } from '../constants'
import type { Action, Transaction } from '../types'
import { getAttemptIds, sortDescByTimestamp } from '../utils'

interface FilterParams {
  readonly actions: readonly Action[]
}

interface UseTransactionsResult {
  items: readonly Transaction[]
  loading: boolean
  usedFallback: boolean
}

const paginateDocumentTransactions = async (
  client: SanityClient,
  id: string,
  params: FilterParams,
  signal: AbortSignal
): Promise<readonly Transaction[]> => {
  let offset = 0
  let combined: readonly Transaction[] = []
  let hadAny = false

  while (true) {
    const rows = await listTransactionsForDocument(
      client,
      id,
      {
        limit: DEFAULT_PER_PAGE,
        offset,
        actions: [...params.actions],
      },
      signal
    )

    if (!rows.length) break
    hadAny = true
    combined = [...combined, ...rows]
    if (rows.length < DEFAULT_PER_PAGE) break
    offset += DEFAULT_PER_PAGE
  }

  if (!hadAny) throw new Error(`No transactions found for document ${id}`)
  return sortDescByTimestamp(combined)
}

export const useTransactions = (
  client: SanityClient,
  documentId: string,
  params: FilterParams,
  refreshKey: number,
  signal?: AbortSignal
): UseTransactionsResult => {
  const [items, setItems] = useState<readonly Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    if (!client) return

    const abortController = new AbortController()
    const { signal: abortSignal } = abortController

    setLoading(true)
    setItems([])
    setUsedFallback(false)

    let externalAbortHandler: (() => void) | undefined
    if (signal) {
      if (signal.aborted) {
        abortController.abort()
      } else {
        externalAbortHandler = () => abortController.abort()
        signal.addEventListener('abort', externalAbortHandler)
      }
    }

    const fetchDatasetPage = async () => {
      const page = await listTransactionsDatasetPage(client, {
        filters: {
          actions: [...params.actions],
        },
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
      return { items: page.items, usedFallback: page.usedFallback || false }
    }

    const fetchForDocumentIds = async (
      ids: readonly string[],
      sig: AbortSignal
    ) => {
      let fallbackUsed = false
      for (const id of ids) {
        try {
          const rows = await paginateDocumentTransactions(
            client,
            id,
            params,
            sig
          )
          return { items: rows, usedFallback: fallbackUsed }
        } catch (error) {
          console.warn(
            `Failed to fetch for ${id}: ${error instanceof Error ? error.message : String(error)}`
          )
          fallbackUsed = true
        }
      }
      throw new Error(`No transactions found for document ${documentId}`)
    }

    const load = async () => {
      try {
        let allItems: readonly Transaction[] = []
        let fallbackUsed = false

        if (documentId.trim()) {
          const attemptIds = getAttemptIds(documentId)
          const res = await fetchForDocumentIds(attemptIds, abortSignal)
          allItems = [...allItems, ...res.items]
          fallbackUsed = res.usedFallback
        } else {
          const res = await fetchDatasetPage()
          allItems = res.items
          fallbackUsed = res.usedFallback
        }

        if (!abortSignal.aborted) {
          const sorted = sortDescByTimestamp(allItems)
          setItems(sorted)
          setUsedFallback(fallbackUsed)
        }
      } catch (error) {
        if (!abortSignal.aborted) {
          console.error('Failed to load transactions:', {
            error: error instanceof Error ? error.message : String(error),
            documentId,
            params,
          })
          setItems([])
          setUsedFallback(true)
        }
      } finally {
        if (!abortSignal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      abortController.abort()
      if (signal && externalAbortHandler) {
        signal.removeEventListener('abort', externalAbortHandler)
      }
    }
  }, [client, documentId, params.actions, refreshKey, signal])

  return { items, loading, usedFallback }
}

import type { SanityClient } from '@sanity/client'
import { useEffect, useState } from 'react'

import {
  listTransactionsDatasetPage,
  listTransactionsForDocument,
} from '../api/history'
import { INITIAL_VISIBLE_LIMIT } from '../constants'
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
  signal: AbortSignal,
  maxItems?: number
): Promise<readonly Transaction[]> => {
  let offset = 0
  let combined: readonly Transaction[] = []
  let hadAny = false

  const requestedTotal: number | undefined =
    typeof maxItems === 'number' && Number.isFinite(maxItems) && maxItems > 0
      ? maxItems
      : undefined

  let perPage: number
  const parseSafeNumber = (v: unknown, fallback = 1): number => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const n = Number(v)
      return Number.isFinite(n) ? n : fallback
    }
    return fallback
  }

  const defaultPerPage = parseSafeNumber(INITIAL_VISIBLE_LIMIT, 1)
  if (typeof requestedTotal === 'number') {
    perPage = Math.max(1, Math.min(defaultPerPage, requestedTotal))
  } else {
    perPage = defaultPerPage
  }

  while (true) {
    if (typeof requestedTotal === 'number' && combined.length >= requestedTotal)
      break
    const remaining: number | undefined =
      typeof requestedTotal === 'number'
        ? Math.max(0, requestedTotal - combined.length)
        : undefined
    const limit =
      typeof remaining === 'number' ? Math.min(perPage, remaining) : perPage
    if (limit === 0) break

    const rows = await listTransactionsForDocument(
      client,
      id,
      {
        limit,
        offset,
        actions: [...params.actions],
      },
      signal
    )

    if (!rows.length) break
    hadAny = true
    combined = [...combined, ...rows]
    if (rows.length < limit) break
    offset += limit
  }

  if (!hadAny) throw new Error(`No transactions found for document ${id}`)
  const sliced =
    typeof requestedTotal === 'number'
      ? combined.slice(0, requestedTotal)
      : combined
  return sortDescByTimestamp(sliced)
}

interface UseTransactionsOptions {
  limit?: number
  signal?: AbortSignal
}

export const useTransactions = (
  client: SanityClient,
  documentId: string,
  params: FilterParams,
  refreshKey: number,
  options?: UseTransactionsOptions
): UseTransactionsResult => {
  const [items, setItems] = useState<readonly Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const limit = options?.limit
  const externalSignal = options?.signal

  useEffect(() => {
    if (!client) return

    const abortController = new AbortController()
    const { signal: abortSignal } = abortController

    setLoading(true)
    setItems([])
    setUsedFallback(false)

    let externalAbortHandler: (() => void) | undefined
    if (externalSignal) {
      if (externalSignal.aborted) {
        abortController.abort()
      } else {
        externalAbortHandler = () => abortController.abort()
        externalSignal.addEventListener('abort', externalAbortHandler)
      }
    }

    const fetchDatasetPage = async () => {
      const page = await listTransactionsDatasetPage(client, {
        filters: {
          actions: [...params.actions],
        },
        offset: 0,
        ...(typeof limit === 'number' && limit > 0 ? { limit } : {}),
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
            sig,
            limit
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
      if (externalSignal && externalAbortHandler) {
        externalSignal.removeEventListener('abort', externalAbortHandler)
      }
    }
  }, [client, documentId, params.actions, refreshKey, externalSignal, limit])

  return { items, loading, usedFallback }
}

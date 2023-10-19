import { describe, expect, it } from 'vitest'

import useRequest from '../useRequest'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { API_BASEURL } from '@/paths'
import { act, renderHook, waitFor } from '@/test-utils'

describe('useRequest', () => {
  it('henter data feiler', async () => {
    mockErrorResponse('/use-request/fail')
    const { result } = renderHook(() =>
      useRequest<boolean, { data: string }>(`${API_BASEURL}/use-request/fail`)
    )
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.status).toBe(500)
    expect(result.current.hasError).toBe(true)
    expect(result.current.errorData?.data).toBe(`Beep boop I'm an error!`)
  })

  it('henter data OK, men ikke JSON', async () => {
    mockResponse('/use-request/ok', {
      text: 'Error string',
    })
    const { result } = renderHook(() =>
      useRequest<string>(`${API_BASEURL}/use-request/ok`)
    )
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasError).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('henter strukturert feildata', async () => {
    mockErrorResponse('/use-request/fail', {
      json: { error: 'strukturert feil', userId: 10 },
    })

    type ErrorType = {
      error: string
      userId: number
    }

    type DataType = string
    const { result } = renderHook(() =>
      useRequest<DataType, ErrorType>(`${API_BASEURL}/use-request/fail`)
    )
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.status).toBe(500)
    expect(result.current.hasError).toBe(true)
    expect(result.current.errorData?.error).toBe(`strukturert feil`)
    expect(result.current.errorData?.userId).toBe(10)
  })

  it('henter data ok', async () => {
    mockResponse('/use-request/ok')
    const { result } = renderHook(() =>
      useRequest<{ data: string }>(`${API_BASEURL}/use-request/ok`)
    )
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasError).toBe(false)
    expect(result.current.data?.data).toBe('OK')
  })

  it('henter data på nytt', async () => {
    mockResponse('/use-request/retry')
    const { result } = renderHook(() =>
      useRequest<{ data: string }>(`${API_BASEURL}/use-request/retry`)
    )
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasError).toBe(false)
    expect(result.current.data?.data).toBe('OK')

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBeUndefined()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data?.data).toBe('OK')
  })

  it('feiler med tekst', async () => {
    mockErrorResponse('/use-request/error', {
      noData: true,
      status: 401,
    })
    const { result } = renderHook(() =>
      useRequest<undefined, undefined>(`${API_BASEURL}/use-request/error`)
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.status).toBe(401)
  })
})

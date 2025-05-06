import { act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import * as reactRouter from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { paths } from '@/router/constants'
import { renderHook } from '@/test-utils'

import {
  NavigationHistoryProvider,
  useNavigationHistory,
} from '../navigationHistory'

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  }
})

describe('NavigationHistory', () => {
  const mockNavigate = vi.fn()
  const createMockLocation = (pathname: string) => ({
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'default',
  })

  // Setup mocks before each test
  beforeEach(() => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue(
      createMockLocation(paths.root)
    )
    vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate)
  })

  // Clean up mocks after each test
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('legger til i historikken når plasseringen endres', () => {
    vi.spyOn(reactRouter, 'useLocation')
      .mockReturnValueOnce(createMockLocation(paths.start))
      .mockReturnValueOnce(createMockLocation(paths.afp))

    const { result } = renderHook(() => useNavigationHistory(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
        </MemoryRouter>
      ),
    })

    expect(result.current.history).toStrictEqual([
      paths.start,
      paths.afp,
      paths.root,
    ])
  })

  it('navigerer tilbake til et tidligere steg når goBackToStep blir kalt med et steg i historikken', () => {
    vi.spyOn(reactRouter, 'useLocation')
      .mockReturnValueOnce(createMockLocation(paths.start))
      .mockReturnValueOnce(createMockLocation(paths.afp))
      .mockReturnValueOnce(createMockLocation(paths.samtykke))

    const { result } = renderHook(() => useNavigationHistory(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.goBackToStep(paths.start)
    })

    expect(result.current.history).toStrictEqual([paths.start])
    expect(mockNavigate).toHaveBeenCalledWith(-3)
  })

  it('navigerer direkte til steg hvis det ikke finnes i historikken', () => {
    vi.spyOn(reactRouter, 'useLocation')
      .mockReturnValueOnce(createMockLocation(paths.afp))
      .mockReturnValueOnce(createMockLocation(paths.samtykke))

    const { result } = renderHook(() => useNavigationHistory(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.goBackToStep(paths.sivilstand)
    })

    expect(mockNavigate).toHaveBeenCalledWith(paths.sivilstand)
  })
})

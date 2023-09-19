import '@testing-library/jest-dom'
import { fetch, Headers, Request, Response } from 'cross-fetch'
import { useSerialIds } from 'highcharts'
import { vi } from 'vitest'

import { server } from '@/mocks/server'

global.fetch = fetch
global.Request = Request
global.Response = Response
global.Headers = Headers
global.scrollTo = () => vi.fn()

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    }
  }

window.ResizeObserver =
  window.ResizeObserver ||
  vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }))

window.HTMLElement.prototype.scrollIntoView = vi.fn()

vi.mock(
  '@navikt/nav-dekoratoren-moduler',
  async (): Promise<typeof import('@navikt/nav-dekoratoren-moduler')> => {
    const mod = await vi.importActual<{
      default: typeof import('@navikt/nav-dekoratoren-moduler')
    }>('@navikt/nav-dekoratoren-moduler')

    return {
      ...mod.default,
      getAmplitudeInstance: () => vi.fn(),
    }
  }
)

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'bypass' })
  if (process.env.NODE_ENV === 'test') {
    useSerialIds(true)
  }
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

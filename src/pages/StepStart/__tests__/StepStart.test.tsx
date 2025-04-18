import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, vi } from 'vitest'

import {
  fulfilledGetLoependeVedtak0Ufoeregrad,
  fulfilledGetPerson,
  rejectedGetLoependeVedtak,
  rejectedGetPerson,
} from '@/mocks/mockedRTKQueryApiCalls'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { BASE_PATH, paths } from '@/router/constants'
import { routes } from '@/router/routes'
import * as apiSliceUtils from '@/state/api/apiSlice'
import { store } from '@/state/store'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen, userEvent, waitFor } from '@/test-utils'

const initialGetState = store.getState

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('StepStart', () => {
  afterEach(() => {
    store.dispatch(apiSliceUtils.apiSlice.util.resetApiState())
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.resetModules()
    store.getState = initialGetState
  })

  it('har riktig sidetittel og viser loader mens loaderen fetcher data', async () => {
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.start}`],
    })
    render(<RouterProvider router={router} />, {
      hasRouter: false,
    })
    await waitFor(async () => {
      expect(document.title).toBe('application.title.stegvisning.start')
    })
    await waitFor(async () => {
      expect(screen.getByTestId('start-loader')).toBeVisible()
    })
  })

  describe('Gitt at brukeren ikke har noe vedtak om alderspensjon eller AFP', () => {
    it('henter personopplysninger og viser hilsen med navnet til brukeren', async () => {
      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.start}`],
      })
      render(<RouterProvider router={router} />, {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetPerson,
              ...fulfilledGetLoependeVedtak0Ufoeregrad,
            },
          },
        },
        hasRouter: false,
      })
      expect(await screen.findByText('stegvisning.start.ingress')).toBeVisible()
      expect(screen.getByText('stegvisning.start.title Aprikos!')).toBeVisible()
    })

    it('rendrer ikke siden når henting av personopplysninger feiler og redirigerer til /uventet-feil', async () => {
      mockErrorResponse('/v4/person')
      const mockedState = {
        api: {
          queries: {
            ...rejectedGetPerson,
            ...fulfilledGetLoependeVedtak0Ufoeregrad,
          },
        },
        userInput: { ...userInputInitialState, samtykke: null },
      }
      store.getState = vi.fn().mockImplementation(() => {
        return mockedState
      })

      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.start}`],
      })
      render(<RouterProvider router={router} />, {
        // @ts-ignore
        preloadedState: {
          ...mockedState,
        },
        hasRouter: false,
      })

      await waitFor(async () => {
        expect(await screen.findByText('pageframework.title')).toBeVisible()
        expect(navigateMock).toHaveBeenCalledWith(paths.uventetFeil)
      })
    })
  })

  describe('Gitt at brukeren har et vedtak om alderspensjon eller AFP', () => {
    it('viser informasjon om dagens alderspensjon og AFP i tillegg til hilsen med navnet til brukeren', async () => {
      mockResponse('/v4/vedtak/loepende-vedtak', {
        status: 200,
        json: {
          alderspensjon: {
            grad: 50,
            fom: '2020-10-02',
            sivilstand: 'UGIFT',
          },
          ufoeretrygd: { grad: 0 },
        } satisfies LoependeVedtak,
      })

      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.start}`],
      })
      render(<RouterProvider router={router} />, {
        hasRouter: false,
      })
      await waitFor(() => {
        expect(
          screen.getByText('stegvisning.start.title Aprikos!')
        ).toBeVisible()
        expect(screen.getByText('Du har nå', { exact: false })).toBeVisible()
        expect(
          screen.getByText('50 % alderspensjon', { exact: false })
        ).toBeVisible()
      })
    })

    it('rendrer ikke siden når henting av loepende vedtak feiler og redirigerer til /uventet-feil', async () => {
      mockErrorResponse('/v4/vedtak/loepende-vedtak')
      const mockedState = {
        api: {
          queries: {
            ...fulfilledGetPerson,
            ...rejectedGetLoependeVedtak,
          },
        },
        userInput: { ...userInputInitialState, samtykke: null },
      }
      store.getState = vi.fn().mockImplementation(() => {
        return mockedState
      })

      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.start}`],
      })
      render(<RouterProvider router={router} />, {
        // @ts-ignore
        preloadedState: {
          ...mockedState,
        },
        hasRouter: false,
      })

      await waitFor(async () => {
        expect(await screen.findByText('pageframework.title')).toBeVisible()
        expect(navigateMock).toHaveBeenCalledWith(paths.uventetFeil)
      })
    })
  })

  it('sender videre til neste steg når brukeren klikker på Neste', async () => {
    const user = userEvent.setup()

    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.start}`],
    })
    render(<RouterProvider router={router} />, {
      preloadedState: {
        api: {
          // @ts-ignore
          queries: {
            ...fulfilledGetPerson,
            ...fulfilledGetLoependeVedtak0Ufoeregrad,
          },
        },
      },
      hasRouter: false,
    })
    await waitFor(async () => {
      const startButton = await screen.findByText('stegvisning.start.button')
      await user.click(startButton)
      expect(navigateMock).toHaveBeenCalledWith(paths.sivilstand)
    })
  })

  describe('Gitt at brukeren er logget på som veileder', async () => {
    it('vises ikke Avbryt knapp', async () => {
      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.start}`],
      })
      render(<RouterProvider router={router} />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '81549300',
          },
        },
        hasRouter: false,
      })

      expect(screen.queryAllByRole('button')).toHaveLength(0)
    })
  })
})

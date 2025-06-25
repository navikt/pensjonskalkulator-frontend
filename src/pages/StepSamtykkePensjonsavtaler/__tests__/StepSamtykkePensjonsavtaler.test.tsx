import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, vi } from 'vitest'

import {
  fulfilledGetLoependeVedtak0Ufoeregrad,
  fulfilledGetLoependeVedtak75Ufoeregrad,
  fulfilledGetPerson,
  fulfilledPensjonsavtaler,
  fulfilledsimulerOffentligTp,
} from '@/mocks/mockedRTKQueryApiCalls'
import { BASE_PATH, paths } from '@/router/constants'
import { routes } from '@/router/routes'
import * as apiSliceUtils from '@/state/api/apiSlice'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import * as userInputReducerUtils from '@/state/userInput/userInputSlice'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen, userEvent, waitFor } from '@/test-utils'

import { StepSamtykkePensjonsavtaler } from '..'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('StepSamtykkePensjonsavtaler', () => {
  beforeEach(() => {
    store.getState = vi.fn().mockImplementation(() => ({
      api: {
        queries: {
          ...fulfilledGetPerson,
        },
      },
      userInput: {
        ...userInputReducerUtils.userInputInitialState,
        samtykke: true,
      },
    }))
  })

  afterEach(() => {
    store.dispatch(apiSlice.util.resetApiState())
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.resetModules()
  })

  it('har riktig sidetittel', async () => {
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.samtykke}`],
    })

    render(<RouterProvider router={router} />, {
      hasRouter: false,
      preloadedState: {
        api: {
          // @ts-ignore
          queries: { mock: 'mock' },
        },
      },
    })
    await waitFor(async () => {
      expect(document.title).toBe('application.title.stegvisning.samtykke')
    })
  })

  describe('Gitt at brukeren svarer Ja på spørsmål om samtykke', async () => {
    it('registrerer samtykke og navigerer videre til riktig side når brukeren klikker på Neste', async () => {
      const user = userEvent.setup()

      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.samtykke}`],
      })

      render(<RouterProvider router={router} />, {
        hasRouter: false,
      })
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'stegvisning.samtykke_pensjonsavtaler.title'
        )
      })

      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons).toHaveLength(2)
      await user.click(radioButtons[0])
      await user.click(screen.getByText('stegvisning.neste'))

      expect(store.getState().userInput.samtykke).toBe(true)
      expect(navigateMock).toHaveBeenCalledWith(paths.beregningEnkel)
    })
  })

  describe('Gitt at brukeren svarer Nei på spørsmål om samtykke', async () => {
    it('invaliderer cache for offentlig-tp og pensjonsavtaler i storen (for å fjerne evt. data som ble hentet pga en tidligere samtykke). Navigerer videre til riktig side når brukeren klikker på Neste', async () => {
      const invalidateMock = vi.spyOn(
        apiSliceUtils.apiSlice.util.invalidateTags,
        'match'
      )

      const user = userEvent.setup()
      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.samtykke}`],
      })

      render(<RouterProvider router={router} />, {
        hasRouter: false,
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetPerson,
              ...fulfilledsimulerOffentligTp,
              ...fulfilledPensjonsavtaler,
              ...fulfilledGetLoependeVedtak75Ufoeregrad,
            },
          },
          userInput: {
            ...userInputInitialState,
            samtykke: true,
          },
        },
      })
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'stegvisning.samtykke_pensjonsavtaler.title'
        )
      })

      const radioButtons = screen.getAllByRole('radio')

      await user.click(radioButtons[1])
      await user.click(screen.getByText('stegvisning.neste'))

      expect(invalidateMock).toHaveBeenCalledWith({
        payload: ['OffentligTp', 'Pensjonsavtaler'],
        type: 'api/invalidateTags',
      })
      expect(navigateMock).toHaveBeenCalledWith(paths.beregningEnkel)
    })
  })

  it('navigerer tilbake når brukeren klikker på Tilbake', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.samtykke}`],
    })

    render(<RouterProvider router={router} />, {
      hasRouter: false,
      preloadedState: {
        api: {
          // @ts-ignore
          queries: {
            ...fulfilledGetPerson,
          },
        },
        userInput: {
          ...userInputInitialState,
          samtykke: true,
        },
      },
    })
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'stegvisning.samtykke_pensjonsavtaler.title'
      )
    })
    await user.click(screen.getByText('stegvisning.tilbake'))
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.stringContaining('back=true') as string,
      })
    )
  })

  describe('Gitt at brukeren er logget på som veileder', async () => {
    it('vises ikke Avbryt knapp', async () => {
      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.samtykke}`],
      })

      render(<RouterProvider router={router} />, {
        hasRouter: false,
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetPerson,
            },
          },
          userInput: {
            ...userInputInitialState,
            samtykke: true,
            veilederBorgerFnr: '81549300',
          },
        },
      })
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'stegvisning.samtykke_pensjonsavtaler.title'
        )
      })
      expect(await screen.findByText('stegvisning.neste')).toBeVisible()
      expect(await screen.findByText('stegvisning.tilbake')).toBeVisible()
      expect(screen.queryByText('stegvisning.avbryt')).not.toBeInTheDocument()
    })
  })
})

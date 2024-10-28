import * as ReactRouterUtils from 'react-router'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { describe, it, vi } from 'vitest'

import {
  fulfilledGetPerson,
  rejectedGetInntekt,
  fulfilledGetLoependeVedtak0Ufoeregrad,
} from '@/mocks/mockedRTKQueryApiCalls'
import { BASE_PATH, paths } from '@/router/constants'
import { routes } from '@/router/routes'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import * as userInputReducerUtils from '@/state/userInput/userInputReducer'
import { screen, render, userEvent, waitFor } from '@/test-utils'

const initialGetState = store.getState

describe('StepAFP', () => {
  beforeEach(() => {
    store.getState = vi.fn().mockImplementation(() => ({
      api: {
        queries: {
          ...fulfilledGetPerson,
        },
      },
      userInput: {
        ...userInputReducerUtils.userInputInitialState,
      },
    }))
  })

  afterEach(() => {
    store.dispatch(apiSlice.util.resetApiState())
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.resetModules()
    store.getState = initialGetState
  })

  it('har riktig sidetittel og viser loader mens loaderen fetcher data', async () => {
    store.getState = vi.fn().mockImplementation(() => ({
      api: {
        queries: {
          ...rejectedGetInntekt,
          ...fulfilledGetPerson,
        },
      },
      userInput: {
        ...userInputReducerUtils.userInputInitialState,
      },
    }))

    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.afp}`],
    })
    render(<RouterProvider router={router} />, {
      hasRouter: false,
    })
    await waitFor(async () => {
      expect(document.title).toBe('application.title.stegvisning.afp')
    })

    await waitFor(async () => {
      expect(await screen.findByTestId('afp-loader')).toBeVisible()
    })
  })

  it('rendrer StepAFP slik den skal', async () => {
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.afp}`],
    })
    render(<RouterProvider router={router} />, {
      hasRouter: false,
    })
    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it('Når brukeren velger afp og klikker på Neste, registrerer afp og navigerer videre til neste steg', async () => {
    const setAfpMock = vi.spyOn(
      userInputReducerUtils.userInputActions,
      'setAfp'
    )
    const user = userEvent.setup()

    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.afp}`],
    })
    render(<RouterProvider router={router} />, {
      preloadedState: {
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: {
            ...fulfilledGetLoependeVedtak0Ufoeregrad,
          },
        },
      },
      hasRouter: false,
    })

    const radioButtons = await screen.findAllByRole('radio')
    await user.click(radioButtons[0])
    await user.click(screen.getByText('stegvisning.neste'))

    expect(setAfpMock).toHaveBeenCalledWith('ja_offentlig')
    expect(navigateMock).toHaveBeenCalledWith(paths.ufoeretrygdAFP)
  })

  it('navigerer tilbake når brukeren klikker på Tilbake', async () => {
    const user = userEvent.setup()
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const router = createMemoryRouter(routes, {
      basename: BASE_PATH,
      initialEntries: [`${BASE_PATH}${paths.afp}`],
    })
    render(<RouterProvider router={router} />, {
      hasRouter: false,
    })
    await waitFor(async () => {
      await user.click(await screen.findByText('stegvisning.tilbake'))
    })
    expect(navigateMock).toHaveBeenCalledWith(-1)
  })

  describe('Gitt at brukeren er logget på som veileder', async () => {
    it('vises ikke Avbryt knapp', async () => {
      const router = createMemoryRouter(routes, {
        basename: BASE_PATH,
        initialEntries: [`${BASE_PATH}${paths.afp}`],
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

      expect(await screen.findAllByRole('button')).toHaveLength(4)
    })
  })
})

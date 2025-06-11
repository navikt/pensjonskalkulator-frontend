import { describe, it } from 'vitest'

import {
  fulfilledGetPerson,
  fulfilledPre1963GetPerson,
} from '@/mocks/mockedRTKQueryApiCalls'
import { BASE_PATH } from '@/router/constants'
import * as apiSliceUtils from '@/state/api/apiSlice'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import * as userInputReducerUtils from '@/state/userInput/userInputSlice'
import { render, screen, userEvent, waitFor } from '@/test-utils'

import { VeilederInput } from '../'

const previousWindow = window

describe('VeilederInput', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    global.window = previousWindow
  })

  describe('Gitt at borger ikke er valgt', () => {
    afterEach(() => {
      vi.clearAllMocks()
      vi.resetAllMocks()
      global.window = previousWindow
    })

    it('viser sjema med input og submit knapp', () => {
      render(<VeilederInput />, { hasRouter: false })
      expect(screen.getByTestId('borger-fnr-input')).toBeInTheDocument()
    })

    it('Når borger fnr tastes inn og submit knappen trykkes på, lagres fnr og encrypted fnr i store', async () => {
      const setVeilederBorgerFnrMock = vi.spyOn(
        userInputReducerUtils.userInputActions,
        'setVeilederBorgerFnr'
      )
      const invalidateMock = vi.spyOn(
        apiSliceUtils.apiSlice.util.invalidateTags,
        'match'
      )
      const user = userEvent.setup()
      render(<VeilederInput />, { hasRouter: false })
      expect(screen.getByText('Veiledertilgang')).toBeVisible()
      const submitButton = screen.getByTestId('veileder-submit')
      expect(submitButton).toHaveTextContent('Logg inn')

      const input = screen.getByTestId('borger-fnr-input')
      await user.clear(input)
      await user.type(input, '1')
      await user.type(input, '0')
      await user.type(input, '0')
      await user.type(input, '3')
      await user.type(input, '6')
      await user.type(input, '5')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')

      await user.click(submitButton)

      expect(setVeilederBorgerFnrMock).toHaveBeenCalledWith({
        encryptedFnr: 'this-is-just-jibbrish-encrypted-fnr',
        fnr: '10036599999',
      })
      expect(invalidateMock).toHaveBeenCalled()
    })

    it('Når en feil oppstår ved fnr-encryption, vises det riktig feilmelding', async () => {
      const cache = console.error
      console.error = () => {}

      // Mock API responses - with encryption failing with error
      const fetchMock = vi.spyOn(global, 'fetch')

      // Setup mock implementation that handles specific URLs
      fetchMock.mockImplementation((url, options) => {
        const requestUrl = url instanceof Request ? url.url : String(url)

        // If this is the encrypt endpoint, reject with an error
        if (requestUrl.includes('/api/v1/encrypt')) {
          return Promise.reject(new Error('Encryption failed'))
        }

        // For all other requests, return success
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'fullfilled',
          json: () => Promise.resolve({}),
        } as Response)
      })

      const user = userEvent.setup()

      render(<VeilederInput />, { hasRouter: false })
      expect(screen.getByText('Veiledertilgang')).toBeVisible()
      const submitButton = screen.getByTestId('veileder-submit')
      expect(submitButton).toHaveTextContent('Logg inn')

      const input = screen.getByTestId('borger-fnr-input')
      await user.clear(input)
      await user.type(input, '1')
      await user.type(input, '0')
      await user.type(input, '0')
      await user.type(input, '3')
      await user.type(input, '6')
      await user.type(input, '5')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')
      await user.type(input, '9')

      await user.click(submitButton)

      // Wait for the error alert to appear - this is the main assertion
      // Wait for the error alert to appear, with increased timeout since fetch mock might take longer
      expect(
        await screen.findByTestId('error-alert', { timeout: 3000 })
      ).toBeVisible()

      // Verify that encrypt endpoint was called
      await waitFor(() => {
        const calls = fetchMock.mock.calls.filter((call) => {
          const req = call[0]
          return (req instanceof Request || String(req))
            .toString()
            .includes('encrypt')
        })
        expect(calls.length).toBeGreaterThan(0)
      })

      console.error = cache
    })
  })

  describe('Gitt at borger er valgt', () => {
    afterEach(() => {
      global.window = previousWindow
    })
    it('viser kalkulatoren', async () => {
      render(<VeilederInput />, {
        hasRouter: false,
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '12345678901',
          },
        },
      })
      await waitFor(async () => {
        expect(screen.queryByTestId('borger-fnr-input')).not.toBeInTheDocument()
      })
    })

    it('tittelen er klikkbar', async () => {
      render(<VeilederInput />, {
        hasRouter: false,
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '12345678901',
          },
        },
      })

      expect(
        screen.getByRole('link', { name: 'Pensjonskalkulator' })
      ).toHaveProperty('href', `${window.location.origin}${BASE_PATH}/veileder`)
    })

    it('viser inaktiv-alert', async () => {
      vi.spyOn(URLSearchParams.prototype, 'has').mockImplementation(() => true)
      render(<VeilederInput />, {
        hasRouter: false,
      })
      await waitFor(async () => {
        expect(screen.getByTestId('inaktiv-alert')).toBeInTheDocument()
      })
    })

    it('viser advarsel om delB når bruker er født før 1963', async () => {
      render(<VeilederInput />, {
        hasRouter: false,
        preloadedState: {
          api: {
            // @ts-ignore
            queries: { ...fulfilledPre1963GetPerson },
          },
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '12345678901',
            veilederBorgerEncryptedFnr: 'encrypted123',
          },
        },
      })

      await waitFor(() => {
        expect(screen.getByTestId('alert-del-b')).toBeInTheDocument()
      })
    })

    it('viser ikke advarsel om delB når bruker er født etter 1962', async () => {
      render(<VeilederInput />, {
        hasRouter: false,
        preloadedState: {
          api: {
            // @ts-ignore
            queries: { ...fulfilledGetPerson },
          },
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '12345678901',
            veilederBorgerEncryptedFnr: 'encrypted123',
          },
        },
      })

      await waitFor(() => {
        expect(screen.queryByTestId('alert-del-b')).not.toBeInTheDocument()
      })
    })
  })
})

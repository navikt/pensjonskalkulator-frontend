import { describe, it, vi } from 'vitest'

import { StepSamtykkeOffentligAFP } from '..'
import { fulfilledGetLoependeVedtak0Ufoeregrad } from '@/mocks/mockedRTKQueryApiCalls'
import { paths } from '@/router/constants'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { screen, render, userEvent } from '@/test-utils'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('StepSamtykkeOffentligAFP', () => {
  it('har riktig sidetittel', () => {
    render(<StepSamtykkeOffentligAFP />)
    expect(document.title).toBe(
      'application.title.stegvisning.samtykke_offentlig_AFP'
    )
  })

  describe('Gitt at brukeren svarer Ja på spørsmål om samtykke til beregning av offentlig AFP', async () => {
    it('registrerer samtykke og navigerer videre til riktig side når brukeren klikker på Neste', async () => {
      const user = userEvent.setup()

      const { store } = render(<StepSamtykkeOffentligAFP />, {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetLoependeVedtak0Ufoeregrad,
            },
          },
        },
      })
      const radioButtons = screen.getAllByRole('radio')

      await user.click(radioButtons[0])
      await user.click(screen.getByText('stegvisning.neste'))

      expect(store.getState().userInput.samtykkeOffentligAFP).toBe(true)
      expect(navigateMock).toHaveBeenCalledWith(paths.samtykke)
    })
  })

  describe('Gitt at brukeren svarer Nei på spørsmål om samtykke til beregning av offentlig AFP', async () => {
    it('registrerer samtykke og navigerer videre til riktig side når brukeren klikker på Neste', async () => {
      const user = userEvent.setup()

      const { store } = render(<StepSamtykkeOffentligAFP />, {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetLoependeVedtak0Ufoeregrad,
            },
          },
        },
      })
      const radioButtons = screen.getAllByRole('radio')

      await user.click(radioButtons[1])
      await user.click(screen.getByText('stegvisning.neste'))

      expect(store.getState().userInput.samtykkeOffentligAFP).toBe(false)
      expect(navigateMock).toHaveBeenCalledWith(paths.samtykke)
    })
  })

  it('nullstiller input fra brukeren og navigerer tilbake når brukeren klikker på Tilbake', async () => {
    const user = userEvent.setup()

    const { store } = render(<StepSamtykkeOffentligAFP />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykkeOffentligAFP: null },
      },
    })
    const radioButtons = screen.getAllByRole('radio')

    await user.click(radioButtons[0])
    expect(radioButtons[0]).toBeChecked()
    await user.click(screen.getByText('stegvisning.tilbake'))

    expect(navigateMock).toHaveBeenCalledWith(-1)
    expect(store.getState().userInput.samtykkeOffentligAFP).toBe(null)
  })

  describe('Gitt at brukeren er logget på som veileder', async () => {
    it('vises ikke Avbryt knapp', async () => {
      render(<StepSamtykkeOffentligAFP />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            veilederBorgerFnr: '81549300',
          },
        },
      })
      expect(await screen.findAllByRole('button')).toHaveLength(2)
    })
  })
})

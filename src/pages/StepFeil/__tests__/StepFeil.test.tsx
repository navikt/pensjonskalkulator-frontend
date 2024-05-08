import * as ReactRouterUtils from 'react-router'

import { describe, it, vi } from 'vitest'

import { StepFeil } from '..'
import { paths } from '@/router/constants'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import { screen, render, userEvent, waitFor } from '@/test-utils'

describe('Step Feil', () => {
  it('har riktig sidetittel', () => {
    render(<StepFeil />)
    expect(document.title).toBe('application.title.stegvisning.uventet_feil')
  })

  it('rendrer Step Feil slik den skal når brukeren har svart på spørsmålet om samtykke,', async () => {
    render(<StepFeil />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'error.global.title'
      )
    })
  })

  it('redirigerer til landingssiden når brukeren klikker på knappen', async () => {
    const user = userEvent.setup()
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const { store } = render(<StepFeil />, {
      preloadedState: {
        userInput: {
          ...userInputInitialState,
          samtykke: true,
          afp: 'nei',
          samboer: true,
        },
      },
    })
    await user.click(await screen.findByText('error.global.button'))
    expect(navigateMock.mock.lastCall?.[0]).toBe(paths.login)
    expect(store.getState().userInput.samtykke).toBe(null)
    expect(store.getState().userInput.afp).toBe(null)
    expect(store.getState().userInput.samboer).toBe(null)
  })
})

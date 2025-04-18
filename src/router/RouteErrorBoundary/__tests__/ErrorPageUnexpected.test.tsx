import { describe, it, vi } from 'vitest'

import { paths } from '@/router/constants'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen, userEvent } from '@/test-utils'

import { ErrorPageUnexpected } from '../ErrorPageUnexpected'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('ErrorPageUnexpected', () => {
  it('rendrer med riktig tekst og knapper', () => {
    render(<ErrorPageUnexpected />)
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('sender brukeren til landingside og tømmer storen når brukeren klikker på knappen', async () => {
    const user = userEvent.setup()

    const { store } = render(<ErrorPageUnexpected />, {
      preloadedState: {
        userInput: {
          ...userInputInitialState,
          samtykke: true,
        },
      },
    })
    await user.click(screen.getByText('error.global.button'))
    expect(navigateMock.mock.lastCall?.[0]).toBe(paths.login)
    expect(store.getState().userInput.samtykke).toBe(null)
  })
})

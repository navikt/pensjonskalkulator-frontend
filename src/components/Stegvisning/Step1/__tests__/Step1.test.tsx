import * as ReactRouterUtils from 'react-router'

import { describe, it, vi } from 'vitest'

import { Step1 } from '..'
import { render, screen, waitFor, fireEvent } from '@/test-utils'

describe('Step 1', () => {
  it('rendrer slik den skal, med riktig heading, bilde, tekst og knapper', async () => {
    const result = render(<Step1 />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'stegvisning.steg1.title'
      )
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('sender videre til steg 2 når brukeren klikker på Neste', () => {
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    render(<Step1 />)
    fireEvent.click(screen.getByText('stegvisning.steg1.start'))
    expect(navigateMock).toHaveBeenCalledWith('/stegvisning/2')
  })

  it('redirigerer til landingssiden når brukeren klikker på Avbryt', () => {
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    render(<Step1 />)
    fireEvent.click(screen.getByText('stegvisning.avbryt'))
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})

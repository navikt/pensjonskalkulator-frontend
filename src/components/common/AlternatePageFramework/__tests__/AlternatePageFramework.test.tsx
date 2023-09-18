import { Link } from 'react-router-dom'

import { describe, it, vi } from 'vitest'

import { AlternatePageFramework } from '..'
import { render, screen, userEvent } from '@/test-utils'

function TestComponent() {
  return <Link to="/something-else">Klikk</Link>
}

describe('AlternatePageFramework', () => {
  afterEach(() => {
    window.scrollTo = () => vi.fn()
  })

  it('rendrer slik den skal, med main tag og Heading på riktig nivå', () => {
    const result = render(<AlternatePageFramework />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'application.title'
    )
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('rendrer slik den skal i full width', () => {
    const result = render(<AlternatePageFramework isFullWidth />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'application.title'
    )
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('scroller på toppen av siden når en route endrer seg', async () => {
    const user = userEvent.setup()
    const scrollToMock = vi.fn()
    Object.defineProperty(global.window, 'scrollTo', {
      value: scrollToMock,
      writable: true,
    })

    render(
      <AlternatePageFramework>
        <TestComponent />
      </AlternatePageFramework>
    )

    await await user.click(screen.getByText('Klikk'))
    expect(scrollToMock).toHaveBeenCalledWith(0, 0)
  })
})

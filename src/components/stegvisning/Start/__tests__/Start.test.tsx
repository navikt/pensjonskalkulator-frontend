import { describe, it, vi } from 'vitest'

import { Start } from '..'
import { render, screen, waitFor, fireEvent } from '@/test-utils'

describe('stegvisning - Start', () => {
  const onCancelMock = vi.fn()
  const onNextMock = vi.fn()

  it('rendrer slik den skal, med riktig heading, bilde, tekst og knapper', async () => {
    const result = render(
      <Start fornavn="Ola" onCancel={onCancelMock} onNext={onNextMock} />
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'stegvisning.stegvisning.start.title Ola!'
      )
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('rendrer riktig uten fornavn', async () => {
    render(<Start onCancel={onCancelMock} onNext={onNextMock} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'stegvisning.stegvisning.start.title!'
      )
    })
  })

  it('kaller onNext når brukeren klikker på Neste', () => {
    render(<Start onCancel={onCancelMock} onNext={onNextMock} />)
    fireEvent.click(screen.getByText('stegvisning.stegvisning.start.start'))
    expect(onNextMock).toHaveBeenCalled()
  })

  it('kaller onCancel når brukeren klikker på Avbryt', () => {
    render(<Start onCancel={onCancelMock} onNext={onNextMock} />)
    fireEvent.click(screen.getByText('stegvisning.avbryt'))
    expect(onCancelMock).toHaveBeenCalled()
  })
})

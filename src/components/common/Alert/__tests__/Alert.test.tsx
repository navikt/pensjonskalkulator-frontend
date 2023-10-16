import { describe, it, vi } from 'vitest'

import { Alert } from '..'
import { act, render, screen, userEvent } from '@/test-utils'

describe('Alert', () => {
  it('rendrer riktig med default verdier', () => {
    const { asFragment } = render(<Alert data-testid="alert">My text</Alert>)

    expect(screen.getByTestId('alert')).toBeVisible()
    expect(screen.getByText('My text')).toBeVisible()
    expect(asFragment()).toMatchSnapshot()
  })

  it('rendrer riktig når onRetry er oppgitt', async () => {
    const user = userEvent.setup()
    const onRetryMock = vi.fn()
    const { asFragment } = render(
      <Alert data-testid="alert" onRetry={onRetryMock}>
        My text
      </Alert>
    )

    expect(screen.getByTestId('alert')).toBeVisible()
    await act(async () => {
      await user.click(screen.getByText('Prøv på nytt'))
    })
    expect(asFragment()).toMatchSnapshot()
    expect(onRetryMock).toHaveBeenCalled
  })
})

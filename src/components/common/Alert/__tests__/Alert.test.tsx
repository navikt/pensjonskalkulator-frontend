import { describe, it, vi } from 'vitest'

import { render, screen, userEvent } from '@/test-utils'

import { Alert } from '..'

describe('Alert', () => {
  it('rendrer riktig med default verdier', () => {
    render(<Alert data-testid="alert">My text</Alert>)

    expect(screen.getByTestId('alert')).toBeVisible()
    expect(screen.getByText('My text')).toBeVisible()
  })

  it('rendrer riktig når onRetry er oppgitt', async () => {
    const user = userEvent.setup()
    const onRetryMock = vi.fn()
    render(
      <Alert data-testid="alert" onRetry={onRetryMock}>
        My text
      </Alert>
    )

    expect(screen.getByTestId('alert')).toBeVisible()
    await user.click(screen.getByText('application.global.retry'))
    expect(onRetryMock).toHaveBeenCalled()
  })
})

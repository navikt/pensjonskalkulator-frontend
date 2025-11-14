import { describe, it } from 'vitest'

import { render, screen } from '@/test-utils'

import { Divider } from '..'

describe('Divider', () => {
  it('viser korrekt med standardverdier', async () => {
    render(<Divider />)
    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect((divider as unknown as HTMLElement).className).toMatch(
      /divider_[a-zA-Z0-9]+/
    )
    expect(divider).not.toHaveClass('smallMargin')
    expect(divider).not.toHaveClass('noMargin')
    expect(divider).not.toHaveClass('noMarginBottom')
  })

  it('viser korrekt uten margin', async () => {
    render(<Divider noMargin />)
    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider?.className).toContain('noMargin')
  })

  it('viser korrekt med liten margin', async () => {
    render(<Divider smallMargin />)
    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider?.className).toContain('smallMargin')
  })

  it('viser korrekt uten margin i bunnen', async () => {
    render(<Divider noMarginBottom />)
    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider?.className).toContain('noMarginBottom')
  })
})

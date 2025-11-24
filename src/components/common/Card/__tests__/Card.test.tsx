import { describe, it } from 'vitest'

import { render, screen } from '@/test-utils'

import { Card } from '..'

describe('Card', () => {
  it('viser innhold korrekt uten className', async () => {
    const testContent = 'lorem ipsum'
    render(
      <Card>
        <p>{testContent}</p>
      </Card>
    )
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('bruker egendefinert className når det er gitt', async () => {
    const customClass = 'className'
    render(
      <Card className={customClass}>
        <p>lorem ipsum</p>
      </Card>
    )
    const paragraph = screen.getByText('lorem ipsum')
    const cardElement = paragraph.parentElement as HTMLElement
    expect(cardElement).toHaveClass(customClass)
  })

  it('bruker stor padding når hasLargePadding er satt til true', async () => {
    render(
      <Card hasLargePadding>
        <p>lorem ipsum</p>
      </Card>
    )
    const paragraph = screen.getByText('lorem ipsum')
    const cardElement = paragraph.parentElement as HTMLElement
    expect(cardElement?.className).toContain('largePadding')
  })

  it('bruker margin når hasMargin er satt til true', async () => {
    render(
      <Card hasMargin>
        <p>lorem ipsum</p>
      </Card>
    )
    const paragraph = screen.getByText('lorem ipsum')
    const cardElement = paragraph.parentElement as HTMLElement
    expect(cardElement?.className).toContain('marginBotton')
  })

  it('kombinerer alle props korrekt', async () => {
    const customClass = 'customClassName'
    render(
      <Card className={customClass} hasLargePadding hasMargin>
        <p>lorem ipsum</p>
      </Card>
    )
    const paragraph = screen.getByText('lorem ipsum')
    const cardElement = paragraph.parentElement as HTMLElement
    expect(cardElement).toHaveClass(customClass)
    expect(cardElement?.className).toContain('largePadding')
    expect(cardElement?.className).toContain('marginBotton')
  })
})

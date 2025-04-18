import { render, screen } from '@/test-utils'

import { GrunnlagForbehold } from '..'

describe('GrunnlagForbehold', () => {
  it('rendrer riktig', () => {
    render(<GrunnlagForbehold headingLevel="2" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'grunnlag.forbehold.title'
    )
  })
})

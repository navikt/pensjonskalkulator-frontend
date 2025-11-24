import { render, screen } from '@/test-utils'

import { InfoOmInntekt } from '..'

describe('InfoModalInntekt', () => {
  it('viser fast info om inntekt', async () => {
    render(<InfoOmInntekt />)

    // Check for lists
    const infoList = screen.getByTestId('info-om-inntekt-list')
    expect(infoList.children.length).toBeGreaterThan(2)
  })
})

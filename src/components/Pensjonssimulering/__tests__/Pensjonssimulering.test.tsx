import { describe, it } from 'vitest'

import { Pensjonssimulering } from '../Pensjonssimulering'
import { render, screen, userEvent } from '@/test-utils'

describe('Pensjonssimulering', () => {
  it('rendrer med riktig tittel og chart og uten scroll-knapper', async () => {
    const { container, asFragment } = render(
      <Pensjonssimulering
        uttaksalder={{ aar: 65, maaned: 0, uttaksdato: '2031-11-01' }}
      />
    )

    expect(await screen.findByText('Beregning')).toBeInTheDocument()

    expect(
      container.getElementsByClassName('highcharts-container').length
    ).toBe(1)
    expect(asFragment()).toMatchSnapshot()
  })

  it('viser tabell og oppdaterer label når brukeren klikker på Vis tabell knapp', async () => {
    render(
      <Pensjonssimulering
        uttaksalder={{ aar: 65, maaned: 0, uttaksdato: '2031-11-01' }}
      />
    )

    expect(await screen.findByText('Vis tabell')).toBeVisible()

    await userEvent.click(screen.getByText('Vis tabell'))

    expect(screen.getByText('Lukk tabell')).toBeVisible()
    expect(screen.getAllByRole('row')).not.toHaveLength(0)
  })
})

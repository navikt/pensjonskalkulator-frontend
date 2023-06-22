import { render, screen } from '@/test-utils'
import { Grafvisning } from '@/components/Grafvisning/Grafvisning'

describe('Grafvisning', () => {
  it('rendrer som forventet', async () => {
    const aldere = ['62', '63', '64']
    const data = {
      alderspensjon: [100_000, 100_000, 100_000],
      afpPrivat: [10_000, 10_000, 10_000],
      inntekt: [200_000, 0, 0],
      pensjonsavtaler: [10_000],
    }

    const { container, asFragment } = render(
      <Grafvisning aldere={aldere} data={data} />
    )

    expect(await screen.findByText('Beregning')).toBeInTheDocument()

    expect(
      container.getElementsByClassName('highcharts-container')
    ).toHaveLength(1)
    expect(asFragment()).toMatchSnapshot()
  })

  it('rendrer bare legend for series med minst ett innslag som er høyere enn 0', async () => {
    const aldere = ['62', '63', '64']
    const data = {
      alderspensjon: [100_000, 100_000, 100_000],
      afpPrivat: [0, 0, 0],
      inntekt: [200_000, 0, 0],
      pensjonsavtaler: [],
    }

    render(<Grafvisning aldere={aldere} data={data} />)

    await screen.findByText('Beregning')

    expect(screen.getByText('Inntekt', { exact: false })).toBeVisible()
    expect(screen.getByText('Alderspensjon', { exact: false })).toBeVisible()
    expect(
      screen.queryByText('Avtalefestet pensjon', { exact: false })
    ).not.toBeInTheDocument()
  })
})

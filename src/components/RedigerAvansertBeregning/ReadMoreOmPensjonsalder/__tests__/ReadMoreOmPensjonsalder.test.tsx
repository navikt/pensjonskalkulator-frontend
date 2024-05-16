import { ReadMoreOmPensjonsalder } from '..'
import { render, screen, userEvent } from '@/test-utils'

describe('ReadMoreOmPensjonsalder', () => {
  it('viser riktig info om pensjonsalder for brukere uten uføretrygd', async () => {
    const user = userEvent.setup()
    render(<ReadMoreOmPensjonsalder ufoeregrad={0} />)
    await user.click(
      screen.getByText(
        'beregning.avansert.rediger.read_more.pensjonsalder.label'
      )
    )
    expect(
      screen.queryByText('omufoeretrygd.readmore.title')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Stortinget har blitt enige om endringer i pensjonssystemet.',
        { exact: false }
      )
    ).toBeVisible()
    expect(
      screen.getByText(
        'beregning.avansert.rediger.read_more.pensjonsalder.subtitle'
      )
    ).toBeVisible()
    expect(
      screen.getByText(
        'Din opptjening i folketrygden og eventuell AFP bestemmer når du kan ta ut alderspensjon.',
        { exact: false }
      )
    ).toBeVisible()
  })

  it('viser riktig info om pensjonsalder for brukere med gradert uføretrygd', async () => {
    const user = userEvent.setup()
    render(<ReadMoreOmPensjonsalder ufoeregrad={75} />)
    await user.click(screen.getByText('omufoeretrygd.readmore.title'))
    expect(
      screen.queryByText(
        'beregning.avansert.rediger.read_more.pensjonsalder.label'
      )
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Din opptjening i folketrygden bestemmer når du kan ta ut alderspensjon. Ved 67 år må pensjonen minst tilsvare garantipensjon.',
        { exact: false }
      )
    ).toBeVisible()
  })

  it('viser riktig info om pensjonsalder for brukere med 100 % uføretrygd', async () => {
    const user = userEvent.setup()
    render(<ReadMoreOmPensjonsalder ufoeregrad={100} />)
    await user.click(screen.getByText('omufoeretrygd.readmore.title'))
    expect(
      screen.queryByText(
        'beregning.avansert.rediger.read_more.pensjonsalder.label'
      )
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Det er derfor ikke mulig å beregne alderspensjon før 67 år i kalkulatoren.',
        { exact: false }
      )
    ).toBeVisible()
  })
})

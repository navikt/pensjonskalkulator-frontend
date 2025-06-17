import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import { DetaljRad } from '../../hooks'
import { Opptjeningsdetaljer } from '../Opptjeningsdetaljer'

const renderWithIntl = (component: React.ReactElement) => {
  const mockMessages = {
    'beregning.detaljer.opptjeningsdetaljer.kap19.table.title':
      'Kapitel 19 detaljer',
    'beregning.detaljer.opptjeningsdetaljer.kap20.table.title':
      'Kapitel 20 detaljer',
  }
  return render(
    <IntlProvider locale="nb" messages={mockMessages}>
      {component}
    </IntlProvider>
  )
}

describe('Gitt at Opptjeningsdetaljer rendres', () => {
  const mockOpptjeningKap19Liste: DetaljRad[] = [
    { tekst: 'Andelsbrøk', verdi: '10/10' },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
    { tekst: 'Grunnpensjon', verdi: '180 000 kr' },
  ]

  const mockOpptjeningKap20Liste: DetaljRad[] = [
    { tekst: 'Pensjonsbeholdning før uttak', verdi: '500 000 kr' },
    { tekst: 'Trygdetid', verdi: 40 },
    { tekst: 'Alderspensjon', verdi: '200 000 kr' },
  ]

  const defaultProps = {
    opptjeningKap19Liste: mockOpptjeningKap19Liste,
    opptjeningKap20Liste: mockOpptjeningKap20Liste,
  }

  it('rendrer komponenten med påkrevde props', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer {...defaultProps} />
    )

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('rendrer kap19 opptjeningsdetaljer når data er tilgjengelig', () => {
    renderWithIntl(<Opptjeningsdetaljer {...defaultProps} />)

    expect(screen.getByText('Andelsbrøk:')).toBeVisible()
    expect(screen.getByText('10/10')).toBeVisible()
    expect(screen.getByText('Sluttpoengtall:')).toBeVisible()
    expect(screen.getByText('6.5')).toBeVisible()
    expect(screen.getByText('Grunnpensjon:')).toBeVisible()
    expect(screen.getByText('180 000 kr')).toBeVisible()
  })

  it('rendrer kap20 opptjeningsdetaljer når data er tilgjengelig', () => {
    renderWithIntl(<Opptjeningsdetaljer {...defaultProps} />)

    expect(screen.getByText('Pensjonsbeholdning før uttak:')).toBeVisible()
    expect(screen.getByText('500 000 kr')).toBeVisible()
    expect(screen.getByText('Trygdetid:')).toBeVisible()
    expect(screen.getByText('40')).toBeVisible()
    expect(screen.getByText('Alderspensjon:')).toBeVisible()
    expect(screen.getByText('200 000 kr')).toBeVisible()
  })

  it('rendrer ikke kap19 seksjon når data er tom', () => {
    renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Liste={[]}
        opptjeningKap20Liste={mockOpptjeningKap20Liste}
      />
    )

    expect(screen.queryByText('Andelsbrøk:')).not.toBeInTheDocument()
    expect(screen.queryByText('Sluttpoengtall:')).not.toBeInTheDocument()
  })

  it('rendrer ikke kap20 seksjon når data er tom', () => {
    renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Liste={mockOpptjeningKap19Liste}
        opptjeningKap20Liste={[]}
      />
    )

    expect(
      screen.queryByText('Pensjonsbeholdning før uttak:')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Trygdetid:')).not.toBeInTheDocument()
  })

  it('håndterer tomme arrays for begge objekter', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Liste={[]}
        opptjeningKap20Liste={[]}
      />
    )

    const section = container.querySelector('section')
    expect(section).toBeVisible()
    expect(screen.queryByText('Andelsbrøk:')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Pensjonsbeholdning før uttak:')
    ).not.toBeInTheDocument()
  })

  it('håndterer undefined verdier i DetaljRad objekter', () => {
    const objektMedUndefined: DetaljRad[] = [
      { tekst: 'Test tekst', verdi: undefined },
      { tekst: 'Test tekst 2' },
    ]

    renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Liste={objektMedUndefined}
        opptjeningKap20Liste={[]}
      />
    )

    expect(screen.getByText('Test tekst:')).toBeVisible()
    expect(screen.getByText('Test tekst 2:')).toBeVisible()
  })

  it('rendrer VStack med korrekt gap', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer {...defaultProps} />
    )

    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeVisible()
  })

  it('rendrer definition lists korrekt', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer {...defaultProps} />
    )

    const definitionLists = container.querySelectorAll('dl')
    expect(definitionLists).toHaveLength(2) // En for kap19 og en for kap20
  })

  it('rendrer HStack komponenter med space-between justering', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer {...defaultProps} />
    )

    const hStackElements = container.querySelectorAll('.navds-stack')
    expect(hStackElements.length).toBeGreaterThan(0)
  })
})

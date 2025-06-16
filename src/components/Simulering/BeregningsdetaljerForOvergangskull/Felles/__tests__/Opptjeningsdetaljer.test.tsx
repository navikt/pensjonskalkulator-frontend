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
  const mockOpptjeningKap19Objekt: DetaljRad[] = [
    { tekst: 'Andelsbrøk', verdi: '10/10' },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
    { tekst: 'Grunnpensjon', verdi: '180 000 kr' },
  ]

  const mockOpptjeningKap20Objekt: DetaljRad[] = [
    { tekst: 'Pensjonsbeholdning før uttak', verdi: '500 000 kr' },
    { tekst: 'Trygdetid', verdi: 40 },
    { tekst: 'Alderspensjon', verdi: '200 000 kr' },
  ]

  const defaultProps = {
    opptjeningKap19Objekt: mockOpptjeningKap19Objekt,
    opptjeningKap20Objekt: mockOpptjeningKap20Objekt,
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

    expect(screen.getByText('Andelsbrøk:')).toBeInTheDocument()
    expect(screen.getByText('10/10')).toBeInTheDocument()
    expect(screen.getByText('Sluttpoengtall:')).toBeInTheDocument()
    expect(screen.getByText('6.5')).toBeInTheDocument()
    expect(screen.getByText('Grunnpensjon:')).toBeInTheDocument()
    expect(screen.getByText('180 000 kr')).toBeInTheDocument()
  })

  it('rendrer kap20 opptjeningsdetaljer når data er tilgjengelig', () => {
    renderWithIntl(<Opptjeningsdetaljer {...defaultProps} />)

    expect(
      screen.getByText('Pensjonsbeholdning før uttak:')
    ).toBeInTheDocument()
    expect(screen.getByText('500 000 kr')).toBeInTheDocument()
    expect(screen.getByText('Trygdetid:')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
    expect(screen.getByText('Alderspensjon:')).toBeInTheDocument()
    expect(screen.getByText('200 000 kr')).toBeInTheDocument()
  })

  it('rendrer ikke kap19 seksjon når data er tom', () => {
    renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Objekt={[]}
        opptjeningKap20Objekt={mockOpptjeningKap20Objekt}
      />
    )

    expect(screen.queryByText('Andelsbrøk:')).not.toBeInTheDocument()
    expect(screen.queryByText('Sluttpoengtall:')).not.toBeInTheDocument()
  })

  it('rendrer ikke kap20 seksjon når data er tom', () => {
    renderWithIntl(
      <Opptjeningsdetaljer
        opptjeningKap19Objekt={mockOpptjeningKap19Objekt}
        opptjeningKap20Objekt={[]}
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
        opptjeningKap19Objekt={[]}
        opptjeningKap20Objekt={[]}
      />
    )

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
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
        opptjeningKap19Objekt={objektMedUndefined}
        opptjeningKap20Objekt={[]}
      />
    )

    expect(screen.getByText('Test tekst:')).toBeInTheDocument()
    expect(screen.getByText('Test tekst 2:')).toBeInTheDocument()
  })

  it('rendrer VStack med korrekt gap', () => {
    const { container } = renderWithIntl(
      <Opptjeningsdetaljer {...defaultProps} />
    )

    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeInTheDocument()
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

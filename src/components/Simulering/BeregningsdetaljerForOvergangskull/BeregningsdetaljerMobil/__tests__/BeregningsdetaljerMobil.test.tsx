import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DetaljRad } from '../../hooks'
import { BeregningsdetaljerMobil } from '../BeregningsdetaljerMobil'

// Mock the child components
vi.mock('../../Felles/AlderspensjonDetaljer', () => ({
  AlderspensjonDetaljer: ({
    alderspensjonDetaljerListe,
  }: {
    alderspensjonDetaljerListe: DetaljRad[][]
  }) => (
    <div
      data-testid="AlderspensjonDetaljer"
      data-objekter-length={alderspensjonDetaljerListe.length}
    >
      AlderspensjonDetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/OpptjeningDetaljer', () => ({
  OpptjeningDetaljer: ({
    opptjeningKap19Liste,
    opptjeningKap20Liste,
  }: {
    opptjeningKap19Liste: DetaljRad[]
    opptjeningKap20Liste: DetaljRad[]
  }) => (
    <div
      data-testid="OpptjeningDetaljer"
      data-kap19-length={opptjeningKap19Liste.length}
      data-kap20-length={opptjeningKap20Liste.length}
    >
      OpptjeningDetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/AfpDetaljer', () => ({
  AfpDetaljer: ({
    opptjeningAfpPrivatListe,
    opptjeningPre2025OffentligAfpListe,
  }: {
    opptjeningAfpPrivatListe?: DetaljRad[][]
    opptjeningPre2025OffentligAfpListe?: DetaljRad[]
  }) => (
    <div
      data-testid="AfpDetaljer"
      data-afp-privat-length={opptjeningAfpPrivatListe?.length ?? ''}
      data-pre2025-length={opptjeningPre2025OffentligAfpListe?.length ?? ''}
    >
      AfpDetaljer Mock
    </div>
  ),
}))

describe('Gitt at BeregningsdetaljerMobil rendres', () => {
  const mockalderspensjonDetaljerListe: DetaljRad[][] = [
    [
      { tekst: 'Trygdetid', verdi: 40 },
      { tekst: 'Sluttpoengtall', verdi: 6.5 },
    ],
    [{ tekst: 'Pensjonsbeholdning', verdi: '500000 kr' }],
  ]

  const mockOpptjeningKap19Liste: DetaljRad[] = [
    { tekst: 'Andelsbrøk', verdi: '10/10' },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
  ]

  const mockOpptjeningKap20Liste: DetaljRad[] = [
    { tekst: 'Pensjonsbeholdning før uttak', verdi: '500000 kr' },
    { tekst: 'Trygdetid', verdi: 40 },
  ]

  const mockOpptjeningAfpPrivatListe: DetaljRad[][] = [
    [
      { tekst: 'AFP grad', verdi: 100 },
      { tekst: 'Kompensasjonsgrad', verdi: 0.76 },
    ],
  ]

  const mockOpptjeningPre2025OffentligAfpListe: DetaljRad[] = [
    { tekst: 'AFP grad', verdi: 100 },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
  ]

  const defaultProps = {
    alderspensjonDetaljerListe: mockalderspensjonDetaljerListe,
    opptjeningKap19Liste: mockOpptjeningKap19Liste,
    opptjeningKap20Liste: mockOpptjeningKap20Liste,
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('rendrer komponenten med påkrevde props', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    expect(screen.getByTestId('AlderspensjonDetaljer')).toBeVisible()
    expect(screen.getByTestId('OpptjeningDetaljer')).toBeVisible()
    expect(screen.getByTestId('AfpDetaljer')).toBeVisible()
  })

  it('rendrer VStack med korrekte props', () => {
    const { container } = render(<BeregningsdetaljerMobil {...defaultProps} />)

    const vStack = container.firstChild as HTMLElement
    expect(vStack).toHaveClass('navds-stack')
  })

  it('sender alderspensjonDetaljerListe til AlderspensjonDetaljer komponent', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const AlderspensjonDetaljer = screen.getByTestId('AlderspensjonDetaljer')
    expect(AlderspensjonDetaljer).toHaveAttribute('data-objekter-length', '2')
  })

  it('sender korrekte props til OpptjeningDetaljer', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const OpptjeningDetaljer = screen.getByTestId('OpptjeningDetaljer')
    expect(OpptjeningDetaljer).toHaveAttribute('data-kap19-length', '2')
    expect(OpptjeningDetaljer).toHaveAttribute('data-kap20-length', '2')
  })

  it('sender valgfrie AFP props til AfpDetaljer når de er tilgjengelige', () => {
    render(
      <BeregningsdetaljerMobil
        {...defaultProps}
        opptjeningAfpPrivatListe={mockOpptjeningAfpPrivatListe}
        opptjeningPre2025OffentligAfpListe={
          mockOpptjeningPre2025OffentligAfpListe
        }
      />
    )

    const AfpDetaljer = screen.getByTestId('AfpDetaljer')
    expect(AfpDetaljer).toHaveAttribute('data-afp-privat-length', '1')
    expect(AfpDetaljer).toHaveAttribute('data-pre2025-length', '2')
  })

  it('sender undefined AFP props til AfpDetaljer når de ikke er tilgjengelige', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const AfpDetaljer = screen.getByTestId('AfpDetaljer')
    expect(AfpDetaljer).toHaveAttribute('data-afp-privat-length', '')
    expect(AfpDetaljer).toHaveAttribute('data-pre2025-length', '')
  })

  it('håndterer tomme matriser for påkrevde props', () => {
    const emptyProps = {
      alderspensjonDetaljerListe: [] as DetaljRad[][],
      opptjeningKap19Liste: [] as DetaljRad[],
      opptjeningKap20Liste: [] as DetaljRad[],
    }

    render(<BeregningsdetaljerMobil {...emptyProps} />)

    expect(screen.getByTestId('AlderspensjonDetaljer')).toBeVisible()
    expect(screen.getByTestId('OpptjeningDetaljer')).toBeVisible()
    expect(screen.getByTestId('AfpDetaljer')).toBeVisible()

    const AlderspensjonDetaljer = screen.getByTestId('AlderspensjonDetaljer')
    expect(AlderspensjonDetaljer).toHaveAttribute('data-objekter-length', '0')

    const OpptjeningDetaljer = screen.getByTestId('OpptjeningDetaljer')
    expect(OpptjeningDetaljer).toHaveAttribute('data-kap19-length', '0')
    expect(OpptjeningDetaljer).toHaveAttribute('data-kap20-length', '0')
  })

  it('rendrer alle komponenter i riktig rekkefølge', () => {
    const { container } = render(<BeregningsdetaljerMobil {...defaultProps} />)

    const vStack = container.firstChild as HTMLElement
    const children = Array.from(vStack.children)

    expect(children[0]).toHaveAttribute('data-testid', 'AlderspensjonDetaljer')
    expect(children[1]).toHaveAttribute('data-testid', 'OpptjeningDetaljer')
    expect(children[2]).toHaveAttribute('data-testid', 'AfpDetaljer')
  })
})

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DetaljRad } from '../../hooks'
import { BeregningsdetaljerMobil } from '../BeregningsdetaljerMobil'

// Mock the child components
vi.mock('../../Felles/Grunnpensjonsdetaljer', () => ({
  Grunnpensjonsdetaljer: ({
    grunnpensjonListe,
  }: {
    grunnpensjonListe: DetaljRad[][]
  }) => (
    <div
      data-testid="grunnpensjonsdetaljer"
      data-objekter-length={grunnpensjonListe.length}
    >
      Grunnpensjonsdetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/Opptjeningsdetaljer', () => ({
  Opptjeningsdetaljer: ({
    opptjeningKap19Liste,
    opptjeningKap20Liste,
  }: {
    opptjeningKap19Liste: DetaljRad[]
    opptjeningKap20Liste: DetaljRad[]
  }) => (
    <div
      data-testid="opptjeningsdetaljer"
      data-kap19-length={opptjeningKap19Liste.length}
      data-kap20-length={opptjeningKap20Liste.length}
    >
      Opptjeningsdetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/Afpdetaljer', () => ({
  Afpdetaljer: ({
    opptjeningAfpPrivatListe,
    opptjeningPre2025OffentligAfpListe,
  }: {
    opptjeningAfpPrivatListe?: DetaljRad[][]
    opptjeningPre2025OffentligAfpListe?: DetaljRad[]
  }) => (
    <div
      data-testid="afpdetaljer"
      data-afp-privat-length={opptjeningAfpPrivatListe?.length ?? ''}
      data-pre2025-length={opptjeningPre2025OffentligAfpListe?.length ?? ''}
    >
      Afpdetaljer Mock
    </div>
  ),
}))

describe('Gitt at BeregningsdetaljerMobil rendres', () => {
  const mockGrunnpensjonListe: DetaljRad[][] = [
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
    grunnpensjonListe: mockGrunnpensjonListe,
    opptjeningKap19Liste: mockOpptjeningKap19Liste,
    opptjeningKap20Liste: mockOpptjeningKap20Liste,
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('rendrer komponenten med påkrevde props', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    expect(screen.getByTestId('grunnpensjonsdetaljer')).toBeVisible()
    expect(screen.getByTestId('opptjeningsdetaljer')).toBeVisible()
    expect(screen.getByTestId('afpdetaljer')).toBeVisible()
  })

  it('rendrer VStack med korrekte props', () => {
    const { container } = render(<BeregningsdetaljerMobil {...defaultProps} />)

    const vStack = container.firstChild as HTMLElement
    expect(vStack).toHaveClass('navds-stack')
  })

  it('sender grunnpensjonListe til Grunnpensjonsdetaljer komponent', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const grunnpensjonsdetaljer = screen.getByTestId('grunnpensjonsdetaljer')
    expect(grunnpensjonsdetaljer).toHaveAttribute('data-objekter-length', '2')
  })

  it('sender korrekte props til Opptjeningsdetaljer', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const opptjeningsdetaljer = screen.getByTestId('opptjeningsdetaljer')
    expect(opptjeningsdetaljer).toHaveAttribute('data-kap19-length', '2')
    expect(opptjeningsdetaljer).toHaveAttribute('data-kap20-length', '2')
  })

  it('sender valgfrie AFP props til Afpdetaljer når de er tilgjengelige', () => {
    render(
      <BeregningsdetaljerMobil
        {...defaultProps}
        opptjeningAfpPrivatListe={mockOpptjeningAfpPrivatListe}
        opptjeningPre2025OffentligAfpListe={
          mockOpptjeningPre2025OffentligAfpListe
        }
      />
    )

    const afpdetaljer = screen.getByTestId('afpdetaljer')
    expect(afpdetaljer).toHaveAttribute('data-afp-privat-length', '1')
    expect(afpdetaljer).toHaveAttribute('data-pre2025-length', '2')
  })

  it('sender undefined AFP props til Afpdetaljer når de ikke er tilgjengelige', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    const afpdetaljer = screen.getByTestId('afpdetaljer')
    expect(afpdetaljer).toHaveAttribute('data-afp-privat-length', '')
    expect(afpdetaljer).toHaveAttribute('data-pre2025-length', '')
  })

  it('håndterer tomme matriser for påkrevde props', () => {
    const emptyProps = {
      grunnpensjonListe: [] as DetaljRad[][],
      opptjeningKap19Liste: [] as DetaljRad[],
      opptjeningKap20Liste: [] as DetaljRad[],
    }

    render(<BeregningsdetaljerMobil {...emptyProps} />)

    expect(screen.getByTestId('grunnpensjonsdetaljer')).toBeVisible()
    expect(screen.getByTestId('opptjeningsdetaljer')).toBeVisible()
    expect(screen.getByTestId('afpdetaljer')).toBeVisible()

    const grunnpensjonsdetaljer = screen.getByTestId('grunnpensjonsdetaljer')
    expect(grunnpensjonsdetaljer).toHaveAttribute('data-objekter-length', '0')

    const opptjeningsdetaljer = screen.getByTestId('opptjeningsdetaljer')
    expect(opptjeningsdetaljer).toHaveAttribute('data-kap19-length', '0')
    expect(opptjeningsdetaljer).toHaveAttribute('data-kap20-length', '0')
  })

  it('rendrer alle komponenter i riktig rekkefølge', () => {
    const { container } = render(<BeregningsdetaljerMobil {...defaultProps} />)

    const vStack = container.firstChild as HTMLElement
    const children = Array.from(vStack.children)

    expect(children[0]).toHaveAttribute('data-testid', 'grunnpensjonsdetaljer')
    expect(children[1]).toHaveAttribute('data-testid', 'opptjeningsdetaljer')
    expect(children[2]).toHaveAttribute('data-testid', 'afpdetaljer')
  })
})

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DetaljRad } from '../../hooks'
import { BeregningsdetaljerMobil } from '../BeregningsdetaljerMobil'

// Mock the child components
vi.mock('../../Felles/Grunnpensjonsdetaljer', () => ({
  Grunnpensjonsdetaljer: ({
    grunnpensjonObjekter,
  }: {
    grunnpensjonObjekter: DetaljRad[][]
  }) => (
    <div
      data-testid="grunnpensjonsdetaljer"
      data-objekter-length={grunnpensjonObjekter.length}
    >
      Grunnpensjonsdetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/Opptjeningsdetaljer', () => ({
  Opptjeningsdetaljer: ({
    opptjeningKap19Objekt,
    opptjeningKap20Objekt,
  }: {
    opptjeningKap19Objekt: DetaljRad[]
    opptjeningKap20Objekt: DetaljRad[]
  }) => (
    <div
      data-testid="opptjeningsdetaljer"
      data-kap19-length={opptjeningKap19Objekt.length}
      data-kap20-length={opptjeningKap20Objekt.length}
    >
      Opptjeningsdetaljer Mock
    </div>
  ),
}))

vi.mock('../../Felles/Afpdetaljer', () => ({
  Afpdetaljer: ({
    opptjeningAfpPrivatObjekt,
    opptjeningPre2025OffentligAfpObjekt,
  }: {
    opptjeningAfpPrivatObjekt?: DetaljRad[][]
    opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
  }) => (
    <div
      data-testid="afpdetaljer"
      data-afp-privat-length={opptjeningAfpPrivatObjekt?.length ?? ''}
      data-pre2025-length={opptjeningPre2025OffentligAfpObjekt?.length ?? ''}
    >
      Afpdetaljer Mock
    </div>
  ),
}))

describe('Gitt at BeregningsdetaljerMobil rendres', () => {
  const mockGrunnpensjonObjekter: DetaljRad[][] = [
    [
      { tekst: 'Trygdetid', verdi: 40 },
      { tekst: 'Sluttpoengtall', verdi: 6.5 },
    ],
    [{ tekst: 'Pensjonsbeholdning', verdi: '500000 kr' }],
  ]

  const mockOpptjeningKap19Objekt: DetaljRad[] = [
    { tekst: 'Andelsbrøk', verdi: '10/10' },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
  ]

  const mockOpptjeningKap20Objekt: DetaljRad[] = [
    { tekst: 'Pensjonsbeholdning før uttak', verdi: '500000 kr' },
    { tekst: 'Trygdetid', verdi: 40 },
  ]

  const mockOpptjeningAfpPrivatObjekt: DetaljRad[][] = [
    [
      { tekst: 'AFP grad', verdi: 100 },
      { tekst: 'Kompensasjonsgrad', verdi: 0.76 },
    ],
  ]

  const mockOpptjeningPre2025OffentligAfpObjekt: DetaljRad[] = [
    { tekst: 'AFP grad', verdi: 100 },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
  ]

  const defaultProps = {
    grunnpensjonObjekter: mockGrunnpensjonObjekter,
    opptjeningKap19Objekt: mockOpptjeningKap19Objekt,
    opptjeningKap20Objekt: mockOpptjeningKap20Objekt,
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('rendrer komponenten med påkrevde props', () => {
    render(<BeregningsdetaljerMobil {...defaultProps} />)

    expect(screen.getByTestId('grunnpensjonsdetaljer')).toBeInTheDocument()
    expect(screen.getByTestId('opptjeningsdetaljer')).toBeInTheDocument()
    expect(screen.getByTestId('afpdetaljer')).toBeInTheDocument()
  })

  it('rendrer VStack med korrekte props', () => {
    const { container } = render(<BeregningsdetaljerMobil {...defaultProps} />)

    const vStack = container.firstChild as HTMLElement
    expect(vStack).toHaveClass('navds-stack')
  })

  it('sender grunnpensjonObjekter til Grunnpensjonsdetaljer komponent', () => {
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
        opptjeningAfpPrivatObjekt={mockOpptjeningAfpPrivatObjekt}
        opptjeningPre2025OffentligAfpObjekt={
          mockOpptjeningPre2025OffentligAfpObjekt
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
      grunnpensjonObjekter: [] as DetaljRad[][],
      opptjeningKap19Objekt: [] as DetaljRad[],
      opptjeningKap20Objekt: [] as DetaljRad[],
    }

    render(<BeregningsdetaljerMobil {...emptyProps} />)

    expect(screen.getByTestId('grunnpensjonsdetaljer')).toBeInTheDocument()
    expect(screen.getByTestId('opptjeningsdetaljer')).toBeInTheDocument()
    expect(screen.getByTestId('afpdetaljer')).toBeInTheDocument()

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

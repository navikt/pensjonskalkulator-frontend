import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { BeregningsdetaljerForOvergangskull } from '../BeregningsdetaljerForOvergangskull'

vi.mock('../BeregningsdetaljerDesktop/BeregningsdetaljerDesktop', () => ({
  BeregningsdetaljerDesktop: () => <div data-testid="desktop-component" />,
}))
vi.mock('../BeregningsdetaljerMobil/BeregningsdetaljerMobil', () => ({
  BeregningsdetaljerMobil: () => <div data-testid="mobil-component" />,
}))

vi.mock('@/state/hooks', () => ({
  useAppSelector: () => ({
    uttaksalder: { aar: 67, maaneder: 0 },
    gradertUttaksperiode: null,
  }),
}))
vi.mock('../hooks', () => ({
  useBeregningsdetaljer: () => ({
    grunnpensjonListe: [],
    opptjeningKap19Liste: [],
    opptjeningKap20Liste: [],
    opptjeningPre2025OffentligAfpListe: [],
  }),
}))

describe('BeregningsdetaljerForOvergangskull', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Rendrer wrapper med korrekt test id', () => {
    render(<BeregningsdetaljerForOvergangskull />)
    expect(
      screen.getByTestId('beregningsdetaljer-for-overgangskull')
    ).toBeVisible()
  })

  it('Rendrer desktop komponent ved større skjermstørrelse', () => {
    window.innerWidth = 1200
    window.dispatchEvent(new Event('resize'))
    render(<BeregningsdetaljerForOvergangskull />)
    expect(screen.getByTestId('desktop-component')).toBeVisible()
  })

  it('Rendrer mobil komponent ved mindre skjermstørrelse', () => {
    window.innerWidth = 400
    window.dispatchEvent(new Event('resize'))
    render(<BeregningsdetaljerForOvergangskull />)
    expect(screen.getByTestId('mobil-component')).toBeVisible()
  })
})

import { describe, expect, it, vi } from 'vitest'

import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen } from '@/test-utils'

import { MaanedsbloepAvansertBeregning } from '../MaanedsbloepAvansertBeregning'

// Mock the hook to control its return values
vi.mock('../hooks/usePensjonBeregninger', () => ({
  usePensjonBeregninger: () => ({
    pensionData: [
      {
        alder: { aar: 67, maaneder: 0 },
        grad: 100,
        afp: 10000,
        pensjonsavtale: 5000,
        alderspensjon: 20000,
      },
    ],
    summerYtelser: () => 35000,
    hentUttaksmaanedOgAar: () => ({ maaned: 'januar', aar: '2030' }),
    harGradering: false,
    uttaksalder: { aar: 67, maaneder: 0 },
  }),
}))

describe('MaanedsbloepAvansertBeregning', () => {
  it('renders correctly', () => {
    render(
      <MaanedsbloepAvansertBeregning
        alderspensjonMaanedligVedEndring={{
          heltUttakMaanedligBeloep: 20000,
          gradertUttakMaanedligBeloep: 15000,
        }}
        afpPrivatListe={[]}
        afpOffentligListe={[]}
        pensjonsavtaler={[]}
      />,
      {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            currentSimulation: {
              ...userInputInitialState.currentSimulation,
              uttaksalder: { aar: 67, maaneder: 0 },
            },
          },
        },
      }
    )

    expect(screen.getByText('maanedsbeloep.title')).toBeInTheDocument()
  })
})

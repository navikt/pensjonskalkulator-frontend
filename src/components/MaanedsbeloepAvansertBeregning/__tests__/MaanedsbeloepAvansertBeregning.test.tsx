import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fulfilledGetPerson } from '@/mocks/mockedRTKQueryApiCalls'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen } from '@/test-utils'

import { MaanedsbeloepAvansertBeregning } from '../MaanedsbeloepAvansertBeregning'

// Create a mock implementation that we can configure per test
const mockUsePensjonBeregninger = vi.fn()

describe('MaanedsbeloepAvansertBeregning', () => {
  // Default mock values
  const defaultMockValues = {
    pensjonsdata: [
      {
        alder: { aar: 67, maaneder: 0 },
        grad: 100,
        afp: 10000,
        pensjonsavtale: 5000,
        alderspensjon: 20000,
      },
    ],
    summerYtelser: () => 35000,
    hentUttaksmaanedOgAar: () => ({ maaned: 10, aar: 2030 }),
    harGradering: false,
    uttaksalder: { aar: 67, maaneder: 0 },
  }

  // Reset mock before each test
  beforeEach(() => {
    mockUsePensjonBeregninger.mockReturnValue(defaultMockValues)
  })

  const pensjonsavtale: Pensjonsavtale = {
    key: 0,
    produktbetegnelse: 'DNB',
    kategori: 'PRIVAT_TJENESTEPENSJON',
    startAar: 67,
    utbetalingsperioder: [
      {
        startAlder: { aar: 67, maaneder: 0 } as Alder,
        aarligUtbetaling: 12345,
        grad: 100,
      },
    ],
  }

  const pensjonsavtaler: Pensjonsavtale[] = [
    pensjonsavtale,
    {
      ...pensjonsavtale,
      key: 1,
      utbetalingsperioder: [
        {
          ...pensjonsavtale.utbetalingsperioder[0],
          startAlder: { aar: 67, maaneder: 6 } as Alder,
          sluttAlder: { aar: 71, maaneder: 0 } as Alder,
          aarligUtbetaling: 12345,
        },
      ],
    },
  ]

  const afpOffentligListe = [
    {
      alder: 62,
      beloep: 12000,
      maanedligBeloep: 980,
    },
    {
      alder: 63,
      beloep: 13000,
      maanedligBeloep: 10000,
    },
  ]

  it('renders correctly', () => {
    render(
      <MaanedsbeloepAvansertBeregning
        alderspensjonMaanedligVedEndring={{
          heltUttakMaanedligBeloep: 20000,
          gradertUttakMaanedligBeloep: 15000,
        }}
        afpPrivatListe={[]}
        afpOffentligListe={afpOffentligListe}
        pensjonsavtaler={pensjonsavtaler}
      />,
      {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetPerson,
            },
          },
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

    expect(
      screen.getByTestId('maanedsbloep-avansert-beregning')
    ).toBeInTheDocument()
  })

  it('returns null when uttaksalder is not defined', () => {
    // Override mock for this specific test
    mockUsePensjonBeregninger.mockReturnValue({
      ...defaultMockValues,
      uttaksalder: undefined,
    })

    const { container } = render(
      <MaanedsbeloepAvansertBeregning
        alderspensjonMaanedligVedEndring={{
          heltUttakMaanedligBeloep: 20000,
          gradertUttakMaanedligBeloep: 15000,
        }}
        afpPrivatListe={[]}
        afpOffentligListe={afpOffentligListe}
        pensjonsavtaler={pensjonsavtaler}
      />
    )

    // Component should render null when uttaksalder is undefined
    expect(container).toBeEmptyDOMElement()
  })
})

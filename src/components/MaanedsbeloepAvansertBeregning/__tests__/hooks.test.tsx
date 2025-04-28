import { IntlProvider } from 'react-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import { renderHook } from '@/test-utils'
import { transformUttaksalderToDate } from '@/utils/alder'

import translations_nb from '../../../translations/nb'
import {
  hentSumOffentligTjenestepensjonVedUttak,
  hentSumPensjonsavtalerVedUttak,
} from '../../Pensjonsavtaler/utils'
import { usePensjonBeregninger } from '../hooks'

// Mock the hooks that usePensjonBeregninger depends on
vi.mock('@/state/hooks', () => ({
  useAppSelector: vi.fn(),
}))

vi.mock('@/utils/alder', () => ({
  transformUttaksalderToDate: vi.fn(),
}))

vi.mock('@/context/LanguageProvider/utils', () => ({
  getSelectedLanguage: vi.fn(),
}))

vi.mock('../../Pensjonsavtaler/utils', () => ({
  hentSumPensjonsavtalerVedUttak: vi.fn(),
  hentSumOffentligTjenestepensjonVedUttak: vi.fn(),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <IntlProvider locale="nb" messages={translations_nb}>
      {children}
    </IntlProvider>
  )
}

describe('usePensjonBeregninger', () => {
  // Default mock values to be used across tests
  const mockUttaksalder: Alder = { aar: 67, maaneder: 0 }
  const mockGradertUttaksperiode = {
    uttaksalder: { aar: 62, maaneder: 6 },
    grad: 40,
  }
  const mockFoedselsdato = '1980-01-01'

  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()

    // Default mock implementations
    ;(useAppSelector as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) => {
        // Check which selector is being used and return appropriate mock data
        if (selector === selectCurrentSimulation) {
          return {
            uttaksalder: mockUttaksalder,
            gradertUttaksperiode: mockGradertUttaksperiode,
            aarligInntektVsaHelPensjon: undefined,
          }
        }
        if (selector === selectFoedselsdato) {
          return mockFoedselsdato
        }
        return undefined
      }
    )
    ;(
      transformUttaksalderToDate as ReturnType<typeof vi.fn>
    ).mockImplementation(() => '01.01.2047')
    ;(getSelectedLanguage as ReturnType<typeof vi.fn>).mockReturnValue('nb')
    ;(
      hentSumPensjonsavtalerVedUttak as ReturnType<typeof vi.fn>
    ).mockImplementation(() => 5000)
    ;(
      hentSumOffentligTjenestepensjonVedUttak as ReturnType<typeof vi.fn>
    ).mockImplementation(() => 3000)
  })

  it('returnerer korrekt struktur for pensjonsdata', () => {
    const pensjonsavtaler: Pensjonsavtale[] = [
      {
        key: 1,
        produktbetegnelse: 'Test Pensjon',
        kategori: 'PRIVAT_TJENESTEPENSJON',
        startAar: 62,
        utbetalingsperioder: [
          {
            startAlder: { aar: 62, maaneder: 0 } as Alder,
            aarligUtbetaling: 60000,
            grad: 100,
          },
        ],
      },
    ]

    const props = {
      alderspensjonMaanedligVedEndring: {
        heltUttakMaanedligBeloep: 20000,
        gradertUttakMaanedligBeloep: 8000,
      },
      afpPrivatListe: [
        {
          alder: 62,
          beloep: 240000,
          maanedligBeloep: 20000,
        },
      ],
      afpOffentligListe: undefined,
      pensjonsavtaler,
    }

    const { result } = renderHook(() => usePensjonBeregninger(props), {
      wrapper,
    })

    // Verify the structure and data returned by the hook
    expect(result.current).toHaveProperty('pensjonsdata')
    expect(result.current).toHaveProperty('summerYtelser')
    expect(result.current).toHaveProperty('hentUttaksmaanedOgAar')
    expect(result.current).toHaveProperty('harGradering')
    expect(result.current).toHaveProperty('uttaksalder')

    // Verify that pensjonsdata contains the expected entries
    expect(result.current.pensjonsdata).toHaveLength(2) // Should have both gradert and full uttak
    expect(result.current.harGradering).toBe(true)
  })

  it('beregner summen av ytelser korrekt', () => {
    const props = {
      alderspensjonMaanedligVedEndring: {
        heltUttakMaanedligBeloep: 20000,
        gradertUttakMaanedligBeloep: 8000,
      },
      afpPrivatListe: [
        {
          alder: 62,
          beloep: 240000,
          maanedligBeloep: 20000,
        },
      ],
    }

    const { result } = renderHook(() => usePensjonBeregninger(props), {
      initialProps: {},
    })

    // Test the summerYtelser function with sample data
    const testData = {
      alder: { aar: 67, maaneder: 0 },
      grad: 100,
      afp: 20000,
      pensjonsavtale: 5000,
      alderspensjon: 20000,
    }

    expect(result.current.summerYtelser(testData)).toBe(45000)
  })

  it('formaterer måned og år korrekt', () => {
    const props = {}

    // Mock date formatting
    ;(transformUttaksalderToDate as ReturnType<typeof vi.fn>).mockReturnValue(
      '01.01.2047'
    )
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('januar')

    const { result } = renderHook(() => usePensjonBeregninger(props))

    const testAlder = { aar: 67, maaneder: 0 }
    const formattedDate = result.current.hentUttaksmaanedOgAar(testAlder)

    expect(formattedDate).toEqual({
      maaned: 'januar',
      aar: '2047',
    })
  })

  it('håndterer udefinerte pensjonsavtaledata på en god måte', () => {
    const props = {
      alderspensjonMaanedligVedEndring: {
        heltUttakMaanedligBeloep: 20000,
        gradertUttakMaanedligBeloep: 8000,
      },
      // No pension agreements or AFP data
    }

    const { result } = renderHook(() => usePensjonBeregninger(props))

    // Should still calculate pension data without errors
    expect(result.current.pensjonsdata).toBeDefined()

    // Check that functions handle undefined data correctly
    const testData = {
      alder: { aar: 67, maaneder: 0 },
      grad: 100,
      // No AFP
      pensjonsavtale: 0,
      alderspensjon: 20000,
    }

    expect(result.current.summerYtelser(testData)).toBe(20000)
  })

  it('bestemmer korrekt AFP-beløp ved spesifikke aldre', () => {
    const afpPrivatListe = [
      {
        alder: 62,
        beloep: 120000,
        maanedligBeloep: 10000,
      },
      {
        alder: 65,
        beloep: 150000,
        maanedligBeloep: 12500,
      },
      {
        alder: 67,
        beloep: 180000,
        maanedligBeloep: 15000,
      },
    ]

    const props = {
      afpPrivatListe,
    }

    const { result } = renderHook(() => usePensjonBeregninger(props))

    // Extract pensjonsdata to verify AFP calculation
    const data = result.current.pensjonsdata
    expect(data.find((item) => item.alder.aar === 67)?.afp).toBe(15000)
  })

  it('håndterer scenario uten gradert uttaksperiode', () => {
    // Override the useAppSelector mock for this specific test
    ;(useAppSelector as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) => {
        if (selector === selectCurrentSimulation) {
          return {
            uttaksalder: mockUttaksalder,
            gradertUttaksperiode: null,
          }
        }
        if (selector === selectFoedselsdato) {
          return mockFoedselsdato
        }
        return undefined
      }
    )

    const props = {
      alderspensjonMaanedligVedEndring: {
        heltUttakMaanedligBeloep: 20000,
      },
    }

    const { result } = renderHook(() => usePensjonBeregninger(props), {
      wrapper,
    })

    // Should have only one data point for full retirement
    expect(result.current.pensjonsdata).toHaveLength(1)
    expect(result.current.harGradering).toBe(false)
  })
})

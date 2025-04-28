// filepath: /Users/Martin.Storvoll/Nav/pensjonskalkulator-frontend/src/components/MaanedsbeloepAvansertBeregning/Felles/__tests__/MobilePensjonVisning.test.tsx
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test-utils'

import { PensjonVisningMobil } from '../PensjonVisningMobil'

describe('MobilePensjonVisning', () => {
  const mockPensjonsdata = [
    {
      alder: { aar: 67, maaneder: 0 },
      grad: 100,
      afp: 10000,
      pensjonsavtale: 5000,
      alderspensjon: 20000,
    },
    {
      alder: { aar: 68, maaneder: 0 },
      grad: 100,
      afp: 12000,
      pensjonsavtale: 6000,
      alderspensjon: 22000,
    },
  ]

  const mockSummerYtelser = vi.fn((data) => {
    return (
      (data.afp || 0) + (data.pensjonsavtale || 0) + (data.alderspensjon || 0)
    )
  })

  const mockHentUttaksmaanedOgAar = vi.fn(() => {
    return { maaned: 'januar', aar: '2030' }
  })

  it('renderer korrekt uten gradering (enkel visning)', () => {
    render(
      <PensjonVisningMobil
        pensjonsdata={mockPensjonsdata}
        summerYtelser={mockSummerYtelser}
        hentUttaksmaanedOgAar={mockHentUttaksmaanedOgAar}
        harGradering={false}
      />
    )

    expect(mockSummerYtelser).toHaveBeenCalledTimes(1)
    expect(mockSummerYtelser).toHaveBeenCalledWith(mockPensjonsdata[0])

    expect(mockHentUttaksmaanedOgAar).toHaveBeenCalledWith({
      aar: 67,
      maaneder: 0,
    })

    expect(screen.getByText('10 000 kr')).toBeVisible()
    expect(screen.getByText('5 000 kr')).toBeVisible()
    expect(screen.getByText('20 000 kr')).toBeVisible()

    const readMoreElements = screen.queryAllByRole('button')
    expect(readMoreElements.length).toBe(0)
  })

  it('returnerer null når ingen pensjonsdata er tilgjengelig', () => {
    const { container } = render(
      <PensjonVisningMobil
        pensjonsdata={[]}
        summerYtelser={mockSummerYtelser}
        hentUttaksmaanedOgAar={mockHentUttaksmaanedOgAar}
        harGradering={false}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('viser kun datoen for alderspensjon uten afp og pensjonsavtale', () => {
    const singlePensjonData = [
      {
        alder: { aar: 67, maaneder: 0 },
        grad: 100,
        alderspensjon: 20000,
        pensjonsavtale: 1000,
      },
    ]

    render(
      <PensjonVisningMobil
        pensjonsdata={singlePensjonData}
        summerYtelser={mockSummerYtelser}
        hentUttaksmaanedOgAar={mockHentUttaksmaanedOgAar}
        harGradering={false}
      />
    )

    expect(screen.getByText(/januar 2030/)).toBeInTheDocument()
  })
})

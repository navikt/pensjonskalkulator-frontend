import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test-utils'

import { Pensjonsdata } from '../../hooks'
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
  ]

  const mockSummerYtelser = vi.fn((data: Pensjonsdata) => {
    return (
      (data.afp || 0) + (data.pensjonsavtale || 0) + (data.alderspensjon || 0)
    )
  })

  const mockHentUttaksmaanedOgAar = vi.fn(() => {
    return 'januar 2030'
  })

  it('renderer korrekt uten gradering', () => {
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

    expect(screen.getByText(/10 000\s*kr/)).toBeVisible()
    expect(screen.getByText('5 000 kr')).toBeVisible()
    expect(screen.getByText('20 000 kr')).toBeVisible()

    const readMoreElements = screen.queryAllByRole('button')
    expect(readMoreElements.length).toBe(0)
  })

  it('returnerer null når ingen pensjonsdata er tilgjengelig', async () => {
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
        afp: 0,
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

    expect(screen.getByText(/januar 2030/)).toBeVisible()
  })

  it('viser ikke kalender måned når det er mer enn en ytelse', () => {
    const singlePensjonData = [
      {
        alder: { aar: 67, maaneder: 0 },
        grad: 100,
        afp: 0,
        alderspensjon: 20000,
        pensjonsavtale: 0,
        pre2025OffentligAFP: 10000,
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

    expect(
      screen.getByTestId('maanedsbeloep-desktop-title').textContent
    ).not.toContain(/(januar 2030)/)
  })

  it('renderer med ReadMore komponenter når harGradering er true', () => {
    const mockMultiplePensjonsdata = [
      {
        alder: { aar: 67, maaneder: 0 },
        grad: 100,
        afp: 10000,
        pensjonsavtale: 5000,
        alderspensjon: 20000,
      },
      {
        alder: { aar: 70, maaneder: 0 },
        grad: 50,
        afp: 6000,
        pensjonsavtale: 3000,
        alderspensjon: 15000,
      },
    ]

    render(
      <PensjonVisningMobil
        pensjonsdata={mockMultiplePensjonsdata}
        summerYtelser={mockSummerYtelser}
        hentUttaksmaanedOgAar={mockHentUttaksmaanedOgAar}
        harGradering={true}
      />
    )

    const readMoreElements = screen.getAllByRole('button')
    expect(readMoreElements.length).toBe(2)

    expect(readMoreElements[0].getAttribute('aria-expanded')).toBe('true')
    expect(readMoreElements[1].getAttribute('aria-expanded')).toBe('false')

    expect(screen.getByText(/10 000\s*kr/)).toBeInTheDocument()
    expect(screen.getByText('5 000 kr')).toBeInTheDocument()
    expect(screen.getByText('20 000 kr')).toBeInTheDocument()
  })

  describe('vise månedsbeløp for gammel AFP - pre2025OffentligAfp', () => {
    const mockPensjonsdataPre2025OffentligAfp = [
      {
        alder: { aar: 65, maaneder: 3 },
        grad: 100,
        afp: 0,
        pensjonsavtale: 0,
        alderspensjon: undefined,
        pre2025OffentligAfp: 15000,
      },
      {
        alder: { aar: 65, maaneder: 3 },
        grad: 100,
        afp: 0,
        pensjonsavtale: 0,
        alderspensjon: 20000,
        pre2025OffentligAfp: 15000,
      },
    ]

    beforeEach(() => {
      render(
        <PensjonVisningMobil
          pensjonsdata={mockPensjonsdataPre2025OffentligAfp}
          summerYtelser={mockSummerYtelser}
          hentUttaksmaanedOgAar={mockHentUttaksmaanedOgAar}
          harGradering={true}
        />
      )
    })

    it('viser kun AFP og Alerdspensjon for pre2025OffentligAfp', () => {
      expect(mockHentUttaksmaanedOgAar).toHaveBeenCalledWith({
        aar: 65,
        maaneder: 3,
      })

      const sumText = screen.queryByTestId('maanedsbeloep-desktop-sum')
      expect(sumText).not.toBeInTheDocument()
    })

    it('viser dato i parantes i tittel for pre2025OffentligAfp', () => {
      const readMoreElements = screen.getAllByRole('button')

      expect(readMoreElements[0]).toContainElement(
        screen.queryByText(/(januar 2030)/)
      )
    })

    it('viser bare tidligst uttaks alder for AP i tittel for pre2025OffentligAfp', () => {
      const readMoreElements = screen.getAllByRole('button')

      expect(readMoreElements[1].getAttribute('aria-expanded')).toBe('false')
      expect(readMoreElements[1]).toContainElement(screen.queryByText(/67 år/))
    })
  })
})

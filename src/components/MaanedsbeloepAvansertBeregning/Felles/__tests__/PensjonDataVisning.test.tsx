import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test-utils'

import { PensjonDataVisning } from '../PensjonDataVisning'

describe('PensjonDataVisning', () => {
  const mockPensjonsdata = {
    alder: { aar: 67, maaneder: 0 },
    grad: 100,
    afp: 10000,
    pensjonsavtale: 5000,
    alderspensjon: 20000,
  }

  const mockSummerYtelser = vi.fn(() => 35000)
  const mockHentUttaksMaanedOgAar = vi.fn(() => ({ maaned: '10', aar: '2030' }))

  it('viser alle verdier når alle pensjonstyper er tilstede', () => {
    render(
      <PensjonDataVisning
        pensjonsdata={mockPensjonsdata}
        summerYtelser={mockSummerYtelser}
        hentUttaksMaanedOgAar={mockHentUttaksMaanedOgAar}
      />
    )

    expect(screen.getByText('10 000 kr')).toBeInTheDocument()
    expect(screen.getByText('5 000 kr')).toBeInTheDocument()
    expect(screen.getByText('20 000 kr')).toBeInTheDocument()
    expect(screen.getByText('35 000 kr')).toBeInTheDocument()

    expect(mockSummerYtelser).toHaveBeenCalledWith(mockPensjonsdata)
  })

  it('viser ikke AFP når den ikke er tilstede', () => {
    render(
      <PensjonDataVisning
        pensjonsdata={{ ...mockPensjonsdata, afp: undefined }}
        summerYtelser={mockSummerYtelser}
        hentUttaksMaanedOgAar={mockHentUttaksMaanedOgAar}
      />
    )

    const afpElements = screen.queryAllByText('AFP')
    expect(afpElements.length).toBe(0)

    expect(screen.getByText('5 000 kr')).toBeInTheDocument()
    expect(screen.getByText('20 000 kr')).toBeInTheDocument()
  })

  it('viser ikke pensjonsavtale når den er 0 eller ikke tilstede', () => {
    render(
      <PensjonDataVisning
        pensjonsdata={{ ...mockPensjonsdata, pensjonsavtale: 0 }}
        summerYtelser={mockSummerYtelser}
        hentUttaksMaanedOgAar={mockHentUttaksMaanedOgAar}
      />
    )

    const pensjonsavtaleElements = screen.queryAllByText('pensjonsavtaler')
    expect(pensjonsavtaleElements.length).toBe(0)
  })

  it('viser ikke sum når bare alderspensjon er tilstede', () => {
    render(
      <PensjonDataVisning
        pensjonsdata={{
          alder: { aar: 67, maaneder: 0 },
          grad: 100,
          alderspensjon: 20000,
          pensjonsavtale: 0,
        }}
        summerYtelser={mockSummerYtelser}
        hentUttaksMaanedOgAar={mockHentUttaksMaanedOgAar}
      />
    )

    expect(screen.getByText('20 000 kr')).toBeInTheDocument()

    const sumElements = screen.queryAllByText('sum')
    expect(sumElements.length).toBe(0)
  })

  it('bruker liten tekststørrelse i mobilmodus', () => {
    const { container } = render(
      <PensjonDataVisning
        pensjonsdata={mockPensjonsdata}
        summerYtelser={mockSummerYtelser}
        hentUttaksMaanedOgAar={mockHentUttaksMaanedOgAar}
      />
    )

    expect(container).not.toBeEmptyDOMElement()
  })
})

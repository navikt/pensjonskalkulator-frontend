import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useBeregningsdetaljer } from '../hooks'

vi.mock('@/utils/inntekt', () => ({
  formatInntekt: (v: number) => v.toString(),
}))

const mockAlderspensjon = {
  alder: 67,
  beloep: 4800,
  grunnpensjon: 1000,
  tilleggspensjon: 2000,
  skjermingstillegg: 300,
  pensjonstillegg: 400,
  inntektspensjonBeloep: 500,
  garantipensjonBeloep: 600,
  andelsbroekKap19: 0.3,
  andelsbroekKap20: 0.7,
  sluttpoengtall: 3,
  poengaarFoer92: 4,
  poengaarEtter91: 5,
  trygdetidKap19: 6,
  trygdetidKap20: 7,
  pensjonBeholdningFoerUttakBeloep: 80000,
}

const mockAfp = {
  alderAar: 62,
  totaltAfpBeloep: 15000,
  tidligereArbeidsinntekt: 500000,
  grunnbeloep: 118620,
  sluttpoengtall: 2,
  trygdetid: 5,
  poengaarTom1991: 3,
  poengaarFom1992: 4,
  grunnpensjon: 1000,
  tilleggspensjon: 2000,
  afpTillegg: 500,
  saertillegg: 0,
  afpGrad: 50,
  afpAvkortetTil70Prosent: false,
}

describe('useBeregningsdetaljer', () => {
  it('returnerer tomme arrays hvis ingen input', () => {
    const { result } = renderHook(() => useBeregningsdetaljer())
    expect(result.current.grunnpensjonObjekt).toEqual([])
    expect(result.current.opptjeningKap19Objekt).toEqual([])
    expect(result.current.opptjeningKap20Objekt).toEqual([])
    expect(result.current.opptjeningPre2025OffentligAfpObjekt).toEqual([])
  })

  describe('Gitt at brukeren har alderspensjon', () => {
    it('returneres riktige rader for grunnpensjonObjekt', () => {
      const { result } = renderHook(() =>
        useBeregningsdetaljer([mockAlderspensjon], mockAfp)
      )
      expect(result.current.grunnpensjonObjekt).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tekst: 'Grunnpensjon (kap. 19)',
            verdi: '83 kr',
          }),
          expect.objectContaining({
            tekst: 'Tilleggspensjon (kap. 19)',
            verdi: '167 kr',
          }),
          expect.objectContaining({
            tekst: 'Skjermingstillegg (kap. 19)',
            verdi: '25 kr',
          }),
          expect.objectContaining({
            tekst: 'Pensjonstillegg (kap. 19)',
            verdi: '33 kr',
          }),
          expect.objectContaining({
            tekst: 'Inntektspensjon (kap. 20)',
            verdi: '42 kr',
          }),
          expect.objectContaining({
            tekst: 'Garantipensjon (kap. 20)',
            verdi: '50 kr',
          }),
          expect.objectContaining({
            tekst: 'Sum månedlig alderspensjon',
            verdi: '400 kr',
          }),
        ])
      )
    })
    describe('Når det er felter som har verdi 0', () => {
      it('skjules feltene', () => {
        const mock = {
          ...mockAlderspensjon,
          grunnpensjon: 0,
          tilleggspensjon: 0,
          skjermingstillegg: 0,
          pensjonstillegg: 0,
          inntektspensjonBeloep: 0,
          garantipensjonBeloep: 0,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap19Objekt).toEqual(
          expect.arrayContaining([])
        )
      })
    })
    describe('Når det er felter som har negativ verdi', () => {
      it('skjules feltene i grunnpensjonObjekt', () => {
        const mock = {
          ...mockAlderspensjon,
          grunnpensjon: -100,
          tilleggspensjon: -200,
          skjermingstillegg: -300,
          pensjonstillegg: -400,
          inntektspensjonBeloep: -500,
          garantipensjonBeloep: -600,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.grunnpensjonObjekt).toEqual([])
      })
    })
  })

  describe('Gitt at brukeren har opptjening i kapittel 19', () => {
    it('returneres riktige rader for opptjeningKap19Objekt', () => {
      const { result } = renderHook(() =>
        useBeregningsdetaljer([mockAlderspensjon], mockAfp)
      )
      expect(result.current.opptjeningKap19Objekt).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ tekst: 'Andelsbrøk', verdi: 0.3 }),
          expect.objectContaining({ tekst: 'Sluttpoengtall', verdi: 3 }),
          expect.objectContaining({ tekst: 'Poengår', verdi: 9 }),
          expect.objectContaining({ tekst: 'Trygdetid', verdi: 6 }),
        ])
      )
    })

    describe('Når det er felter som har verdi 0', () => {
      it('vises Poengår selv om verdien er 0', () => {
        const mock = {
          ...mockAlderspensjon,
          poengaarFoer92: 0,
          poengaarEtter91: 0,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap19Objekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Poengår', verdi: 0 }),
          ])
        )
      })

      it('vises Trygdetid selv om verdien er 0', () => {
        const mock = { ...mockAlderspensjon, trygdetidKap19: 0 }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap19Objekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Trygdetid', verdi: 0 }),
          ])
        )
      })

      it('skjules andre felter med verdi 0', () => {
        const mock = {
          ...mockAlderspensjon,
          andelsbroekKap19: 0,
          sluttpoengtall: 0,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap19Objekt).not.toContain(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Andelsbrøk', verdi: 0 }),
            expect.objectContaining({ tekst: 'Sluttpoengtall', verdi: 0 }),
          ])
        )
      })
    })
  })

  describe('Gitt at brukeren har opptjening i kapittel 20', () => {
    it('returneres riktige rader for opptjeningKap20Objekt', () => {
      const { result } = renderHook(() =>
        useBeregningsdetaljer([mockAlderspensjon], mockAfp)
      )
      expect(result.current.opptjeningKap20Objekt).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ tekst: 'Andelsbrøk', verdi: 0.7 }),
          expect.objectContaining({ tekst: 'Trygdetid', verdi: 7 }),
          expect.objectContaining({
            tekst: 'Pensjonbeholdning før uttak',
            verdi: 80000,
          }),
        ])
      )
    })

    describe('Når det er felter som har verdi 0', () => {
      it('vises Trygdetid selv om verdien er 0', () => {
        const mock = { ...mockAlderspensjon, trygdetidKap20: 0 }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap20Objekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Trygdetid', verdi: 0 }),
          ])
        )
      })

      it('vises Pensjonbeholdning før uttak selv om verdien er 0', () => {
        const mock = {
          ...mockAlderspensjon,
          pensjonBeholdningFoerUttakBeloep: 0,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap20Objekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              tekst: 'Pensjonbeholdning før uttak',
              verdi: 0,
            }),
          ])
        )
      })

      it('skjules andre felter med verdi 0', () => {
        const mock = {
          ...mockAlderspensjon,
          andelsbroekKap20: 0,
        }
        const { result } = renderHook(() =>
          useBeregningsdetaljer([mock], mockAfp)
        )
        expect(result.current.opptjeningKap19Objekt).not.toContain(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Andelsbrøk', verdi: 0 }),
          ])
        )
      })
    })
  })

  describe('Gitt at brukeren har gammel Afp', () => {
    it('returneres riktige rader for opptjeningPre2025OffentligAfpObjekt', () => {
      const { result } = renderHook(() => useBeregningsdetaljer([], mockAfp))
      expect(result.current.opptjeningPre2025OffentligAfpObjekt).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ tekst: 'AFP grad', verdi: 50 }),
          expect.objectContaining({ tekst: 'Sluttpoengtall', verdi: 2 }),
          expect.objectContaining({ tekst: 'Poengår', verdi: 7 }),
          expect.objectContaining({ tekst: 'Trygdetid', verdi: 5 }),
        ])
      )
    })

    describe('Når det er felter som har verdi 0', () => {
      it('vises Poengår selv om verdien er 0', () => {
        const mock = { ...mockAfp, poengaarTom1991: 0, poengaarFom1992: 0 }
        const { result } = renderHook(() => useBeregningsdetaljer([], mock))
        expect(result.current.opptjeningPre2025OffentligAfpObjekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Poengår', verdi: 0 }),
          ])
        )
      })

      it('vises Trygdetid selv om verdien er 0', () => {
        const mock = { ...mockAfp, trygdetid: 0 }
        const { result } = renderHook(() => useBeregningsdetaljer([], mock))
        expect(result.current.opptjeningPre2025OffentligAfpObjekt).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'Trygdetid', verdi: 0 }),
          ])
        )
      })

      it('skjules andre felter med verdi 0', () => {
        const mock = { ...mockAfp, afpGrad: 0, sluttpoengtall: 0 }
        const { result } = renderHook(() => useBeregningsdetaljer([], mock))
        expect(
          result.current.opptjeningPre2025OffentligAfpObjekt
        ).not.toContain(
          expect.arrayContaining([
            expect.objectContaining({ tekst: 'AFP grad', verdi: 0 }),
            expect.objectContaining({ tekst: 'Sluttpoengtall', verdi: 0 }),
          ])
        )
      })
    })
  })
})

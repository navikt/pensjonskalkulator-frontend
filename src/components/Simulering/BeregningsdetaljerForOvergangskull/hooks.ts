import { useMemo } from 'react'

export interface GrunnpensjonDetaljer {
  grunnpensjon?: number
  tilleggspensjon?: number
  skjermingstillegg?: number
  pensjonstillegg?: number
  inntektspensjonBeloep?: number
  garantipensjonBeloep?: number
}

export interface OpptjeningKap19Detaljer {
  andelsbroekKap19?: number
  sluttpoengtall?: number
  poengaarSum?: number
  trygdetidKap19?: number
}

export interface OpptjeningKap20Detaljer {
  andelsbroekKap20?: number
  trygdetidKap20?: number
  pensjonBeholdningFoerUttakBeloep?: number
}

export interface OpptjeningPre2025OffentligAfpListe {
  afpGrad?: number
  sluttpoengtall?: number
  poengaarSum?: number
  trygdetid?: number
}

export function useBeregningsdetaljer(
  alderspensjonListe?: AlderspensjonPensjonsberegning[][],
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning[]
) {
  return useMemo(() => {
    if (!alderspensjonListe) {
      return {
        grunnpensjonListe: [],
        opptjeningKap19Liste: [],
        opptjeningKap20Liste: [],
      }
    }

    const flatten = alderspensjonListe.flat()

    const grunnpensjonListe: GrunnpensjonDetaljer[] = flatten.map((detalj) => ({
      grunnpensjon: detalj.grunnpensjon,
      tilleggspensjon: detalj.tilleggspensjon,
      skjermingstillegg: detalj.skjermingstillegg,
      pensjonstillegg: detalj.pensjonstillegg,
      inntektspensjonBeloep: detalj.inntektspensjonBeloep,
      garantipensjonBeloep: detalj.garantipensjonBeloep,
    }))

    const opptjeningKap19Liste: OpptjeningKap19Detaljer[] = flatten.map(
      (detalj) => ({
        andelsbroekKap19: detalj.andelsbroekKap19,
        sluttpoengtall: detalj.sluttpoengtall,
        poengaarSum:
          (detalj.poengaarFoer92 ?? 0) + (detalj.poengaarEtter91 ?? 0),
        trygdetidKap19: detalj.trygdetidKap19,
      })
    )

    const opptjeningKap20Liste: OpptjeningKap20Detaljer[] = flatten.map(
      (detalj) => ({
        andelsbroekKap20: detalj.andelsbroekKap20,
        trygdetidKap20: detalj.trygdetidKap20,
        pensjonBeholdningFoerUttakBeloep:
          detalj.pensjonBeholdningFoerUttakBeloep,
      })
    )

    const opptjeningPre2025OffentligAfpListe: OpptjeningPre2025OffentligAfpListe[] =
      pre2025OffentligAfp?.map((detalj) => ({
        afpGrad: detalj.afpGrad,
        sluttpoengtall: detalj.sluttpoengtall,
        poengaarSum:
          (detalj.poengaarTom1991 ?? 0) + (detalj.poengaarFom1992 ?? 0),
        trygdetid: detalj.trygdetid,
      })) ?? []

    return {
      grunnpensjonListe,
      opptjeningKap19Liste,
      opptjeningKap20Liste,
      opptjeningPre2025OffentligAfpListe,
    }
  }, [alderspensjonListe, pre2025OffentligAfp])
}

import { useMemo } from 'react'

import { formatInntekt } from '@/utils/inntekt'

export interface DetaljRad {
  tekst: string
  verdi?: number | string
}

export interface BeregningsdetaljerRader {
  grunnpensjonObjekt: DetaljRad[]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt: DetaljRad[]
}

export function useBeregningsdetaljer(
  alderspensjonListe?: AlderspensjonPensjonsberegning[],
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
): BeregningsdetaljerRader {
  return useMemo(() => {
    const grunnpensjonObjekt: DetaljRad[] = (alderspensjonListe ?? [])
      .map((ap) => [
        {
          tekst: 'Grunnpensjon (kap. 19)',
          verdi: `${formatInntekt(ap.grunnpensjon)} kr`,
        },
        {
          tekst: 'Tilleggspensjon (kap. 19)',
          verdi: `${formatInntekt(ap.tilleggspensjon)} kr`,
        },
        {
          tekst: 'Skjermingstillegg (kap. 19)',
          verdi: `${formatInntekt(ap.skjermingstillegg)} kr`,
        },
        {
          tekst: 'Pensjonstillegg (kap. 19)',
          verdi: `${formatInntekt(ap.pensjonstillegg)} kr`,
        },
        {
          tekst: 'Inntektspensjon (kap. 20)',
          verdi: `${formatInntekt(ap.inntektspensjonBeloep)} kr`,
        },
        {
          tekst: 'Garantipensjon (kap. 20)',
          verdi: `${formatInntekt(ap.garantipensjonBeloep)} kr`,
        },
        {
          tekst: 'Sum månedelig alderspensjon',
          verdi: `${formatInntekt(
            (ap.grunnpensjon ?? 0) +
              (ap.tilleggspensjon ?? 0) +
              (ap.skjermingstillegg ?? 0) +
              (ap.pensjonstillegg ?? 0) +
              (ap.inntektspensjonBeloep ?? 0) +
              (ap.garantipensjonBeloep ?? 0)
          )} kr`,
        },
      ])
      .flat()
      .filter((rad) => rad.verdi !== undefined && rad.verdi !== '0 kr')

    const opptjeningKap19Objekt: DetaljRad[] = (alderspensjonListe ?? [])
      .map((ap) => [
        { tekst: 'Andelsbrøk', verdi: ap.andelsbroekKap19 },
        { tekst: 'Sluttpoengtall', verdi: ap.sluttpoengtall },
        {
          tekst: 'Poengår',
          verdi: (ap.poengaarFoer92 ?? 0) + (ap.poengaarEtter91 ?? 0),
        },
        { tekst: 'Trygdetid', verdi: ap.trygdetidKap19 },
      ])
      .flat()
      .filter(
        (rad) =>
          rad.verdi !== undefined &&
          (rad.tekst === 'Poengår' ||
            rad.tekst === 'Trygdetid' ||
            rad.verdi !== 0)
      )

    const opptjeningKap20Objekt: DetaljRad[] = (alderspensjonListe ?? [])
      .map((ap) => [
        { tekst: 'Andelsbrøk', verdi: ap.andelsbroekKap20 },
        { tekst: 'Trygdetid', verdi: ap.trygdetidKap20 },
        {
          tekst: 'Pensjonbeholdning før uttak',
          verdi: ap.pensjonBeholdningFoerUttakBeloep,
        },
      ])
      .flat()
      .filter(
        (rad) =>
          rad.verdi !== undefined &&
          (rad.tekst === 'Trygdetid' || rad.verdi !== 0)
      )

    const opptjeningPre2025OffentligAfpObjekt: DetaljRad[] = pre2025OffentligAfp
      ? [
          { tekst: 'AFP grad', verdi: pre2025OffentligAfp.afpGrad },
          {
            tekst: 'Sluttpoengtall',
            verdi: pre2025OffentligAfp.sluttpoengtall,
          },
          {
            tekst: 'Poengår',
            verdi:
              (pre2025OffentligAfp.poengaarTom1991 ?? 0) +
              (pre2025OffentligAfp.poengaarFom1992 ?? 0),
          },
          { tekst: 'Trygdetid', verdi: pre2025OffentligAfp.trygdetid },
        ].filter(
          (rad) =>
            rad.verdi !== undefined &&
            (rad.tekst === 'Poengår' ||
              rad.tekst === 'Trygdetid' ||
              rad.verdi !== 0)
        )
      : []

    return {
      grunnpensjonObjekt,
      opptjeningKap19Objekt,
      opptjeningKap20Objekt,
      opptjeningPre2025OffentligAfpObjekt,
    }
  }, [alderspensjonListe, pre2025OffentligAfp])
}

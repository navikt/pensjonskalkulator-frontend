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
    const alderspensjonVedUttak = alderspensjonListe?.[0]
      ? [alderspensjonListe[0]]
      : []

    const grunnpensjonObjekt: DetaljRad[] = alderspensjonVedUttak
      .map((ap) => {
        // Set negative values to 0 for all fields
        const grunnpensjon =
          ap.grunnpensjon && ap.grunnpensjon > 0 ? ap.grunnpensjon : 0
        const tilleggspensjon =
          ap.tilleggspensjon && ap.tilleggspensjon > 0 ? ap.tilleggspensjon : 0
        const skjermingstillegg =
          ap.skjermingstillegg && ap.skjermingstillegg > 0
            ? ap.skjermingstillegg
            : 0
        const pensjonstillegg =
          ap.pensjonstillegg && ap.pensjonstillegg > 0 ? ap.pensjonstillegg : 0
        const inntektspensjonBeloep =
          ap.inntektspensjonBeloep && ap.inntektspensjonBeloep > 0
            ? ap.inntektspensjonBeloep
            : 0
        const garantipensjonBeloep =
          ap.garantipensjonBeloep && ap.garantipensjonBeloep > 0
            ? ap.garantipensjonBeloep
            : 0

        return [
          {
            tekst: 'Grunnpensjon (kap. 19)',
            verdi: `${formatInntekt(Math.round(grunnpensjon / 12))} kr`,
          },
          {
            tekst: 'Tilleggspensjon (kap. 19)',
            verdi: `${formatInntekt(Math.round(tilleggspensjon / 12))} kr`,
          },
          {
            tekst: 'Skjermingstillegg (kap. 19)',
            verdi: `${formatInntekt(Math.round(skjermingstillegg / 12))} kr`,
          },
          {
            tekst: 'Pensjonstillegg (kap. 19)',
            verdi: `${formatInntekt(Math.round(pensjonstillegg / 12))} kr`,
          },
          {
            tekst: 'Inntektspensjon (kap. 20)',
            verdi: `${formatInntekt(Math.round(inntektspensjonBeloep / 12))} kr`,
          },
          {
            tekst: 'Garantipensjon (kap. 20)',
            verdi: `${formatInntekt(Math.round(garantipensjonBeloep / 12))} kr`,
          },
          {
            tekst: 'Sum månedlig alderspensjon',
            verdi: `${formatInntekt(
              Math.round(
                (grunnpensjon +
                  tilleggspensjon +
                  skjermingstillegg +
                  pensjonstillegg +
                  inntektspensjonBeloep +
                  garantipensjonBeloep) /
                  12
              )
            )} kr`,
          },
        ]
      })
      .flat()
      .filter((rad) => rad.verdi !== '0 kr')

    const opptjeningKap19Objekt: DetaljRad[] = (() => {
      if (
        alderspensjonVedUttak.length === 0 ||
        alderspensjonVedUttak[0].andelsbroekKap19 === 0
      ) {
        return []
      }
      return (
        alderspensjonVedUttak
          //TODO: Konvert andelsbroekKap20 til string i følgende format: 1/10
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
      )
    })()

    const opptjeningKap20Objekt: DetaljRad[] = (() => {
      if (
        alderspensjonVedUttak.length === 0 ||
        alderspensjonVedUttak[0].andelsbroekKap20 === 0
      ) {
        return []
      }
      return (
        alderspensjonVedUttak
          //TODO: Konvert andelsbroekKap20 til string i følgende format: 1/10
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
              (rad.tekst === 'Trygdetid' ||
                rad.tekst === 'Pensjonbeholdning før uttak' ||
                rad.verdi !== 0)
          )
      )
    })()

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

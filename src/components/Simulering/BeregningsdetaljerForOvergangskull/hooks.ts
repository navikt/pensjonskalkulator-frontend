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
      .map((ap) => [
        {
          tekst: 'Grunnpensjon (kap. 19)',
          verdi:
            ap.grunnpensjon !== undefined && ap.grunnpensjon >= 0
              ? `${formatInntekt(Math.round(ap.grunnpensjon / 12))} kr`
              : `${formatInntekt(ap.grunnpensjon)} kr`,
        },
        {
          tekst: 'Tilleggspensjon (kap. 19)',
          verdi:
            ap.tilleggspensjon !== undefined && ap.tilleggspensjon >= 0
              ? `${formatInntekt(Math.round(ap.tilleggspensjon / 12))} kr`
              : `${formatInntekt(ap.tilleggspensjon)} kr`,
        },
        {
          tekst: 'Skjermingstillegg (kap. 19)',
          verdi:
            ap.skjermingstillegg !== undefined && ap.skjermingstillegg >= 0
              ? `${formatInntekt(Math.round(ap.skjermingstillegg / 12))} kr`
              : `${formatInntekt(ap.skjermingstillegg)} kr`,
        },
        {
          tekst: 'Pensjonstillegg (kap. 19)',
          verdi:
            ap.pensjonstillegg !== undefined && ap.pensjonstillegg >= 0
              ? `${formatInntekt(Math.round(ap.pensjonstillegg / 12))} kr`
              : `${formatInntekt(ap.pensjonstillegg)} kr`,
        },
        {
          tekst: 'Inntektspensjon (kap. 20)',
          verdi:
            ap.inntektspensjonBeloep !== undefined &&
            ap.inntektspensjonBeloep >= 0
              ? `${formatInntekt(Math.round(ap.inntektspensjonBeloep / 12))} kr`
              : `${formatInntekt(ap.inntektspensjonBeloep)} kr`,
        },
        {
          tekst: 'Garantipensjon (kap. 20)',
          verdi:
            ap.garantipensjonBeloep !== undefined &&
            ap.garantipensjonBeloep >= 0
              ? `${formatInntekt(Math.round(ap.garantipensjonBeloep / 12))} kr`
              : `${formatInntekt(ap.garantipensjonBeloep)} kr`,
        },
        {
          tekst: 'Sum månedlig alderspensjon',
          verdi: (() => {
            const sum =
              (ap.grunnpensjon ?? 0) +
              (ap.tilleggspensjon ?? 0) +
              (ap.skjermingstillegg ?? 0) +
              (ap.pensjonstillegg ?? 0) +
              (ap.inntektspensjonBeloep ?? 0) +
              (ap.garantipensjonBeloep ?? 0)
            return sum >= 0
              ? `${formatInntekt(Math.round(sum / 12))} kr`
              : `${formatInntekt(sum)} kr`
          })(),
        },
      ])
      .flat()
      .filter(
        (rad) =>
          rad.verdi !== '0 kr' &&
          !(typeof rad.verdi === 'string' && rad.verdi.startsWith('-'))
      )

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

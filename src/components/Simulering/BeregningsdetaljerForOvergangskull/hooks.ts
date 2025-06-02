import { useMemo } from 'react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { formatInntekt } from '@/utils/inntekt'

export interface DetaljRad {
  tekst: string
  verdi?: number | string
}

export interface BeregningsdetaljerRader {
  grunnpensjonObjekter: DetaljRad[][]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt: DetaljRad[]
}

export function useBeregningsdetaljer(
  alderspensjonListe?: AlderspensjonPensjonsberegning[],
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
): BeregningsdetaljerRader {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  return useMemo(() => {
    const alderspensjonVedUttak = alderspensjonListe?.[0]
      ? [alderspensjonListe[0]]
      : []

    const indices: number[] = [0]
    if (
      gradertUttaksperiode &&
      uttaksalder &&
      alderspensjonListe &&
      alderspensjonListe.length > 1
    ) {
      const gradertIndex =
        uttaksalder.aar - gradertUttaksperiode.uttaksalder.aar
      if (
        gradertIndex !== 0 &&
        gradertIndex < alderspensjonListe.length &&
        gradertIndex >= 0
      ) {
        indices.push(gradertIndex)
      }
    }

    const grunnpensjonObjekter: DetaljRad[][] = indices.map((index) => {
      const ap = alderspensjonListe?.[index]
      if (!ap) return []
      const grunnpensjon =
        ap.grunnpensjon && ap.grunnpensjon > 0 ? Math.round(ap.grunnpensjon) : 0
      const tilleggspensjon =
        ap.tilleggspensjon && ap.tilleggspensjon > 0
          ? Math.round(ap.tilleggspensjon)
          : 0
      const skjermingstillegg =
        ap.skjermingstillegg && ap.skjermingstillegg > 0
          ? Math.round(ap.skjermingstillegg)
          : 0
      const pensjonstillegg =
        ap.pensjonstillegg && ap.pensjonstillegg > 0
          ? Math.round(ap.pensjonstillegg)
          : 0
      const inntektspensjonBeloep =
        ap.inntektspensjonBeloep && ap.inntektspensjonBeloep > 0
          ? Math.round(ap.inntektspensjonBeloep)
          : 0
      const garantipensjonBeloep =
        ap.garantipensjonBeloep && ap.garantipensjonBeloep > 0
          ? Math.round(ap.garantipensjonBeloep)
          : 0

      return [
        {
          tekst: 'Grunnpensjon (kap. 19)',
          verdi: `${formatInntekt(grunnpensjon / 12)} kr`,
        },
        {
          tekst: 'Tilleggspensjon (kap. 19)',
          verdi: `${formatInntekt(tilleggspensjon / 12)} kr`,
        },
        {
          tekst: 'Skjermingstillegg (kap. 19)',
          verdi: `${formatInntekt(skjermingstillegg / 12)} kr`,
        },
        {
          tekst: 'Pensjonstillegg (kap. 19)',
          verdi: `${formatInntekt(pensjonstillegg / 12)} kr`,
        },
        {
          tekst: 'Inntektspensjon (kap. 20)',
          verdi: `${formatInntekt(inntektspensjonBeloep / 12)} kr`,
        },
        {
          tekst: 'Garantipensjon (kap. 20)',
          verdi: `${formatInntekt(garantipensjonBeloep / 12)} kr`,
        },
        {
          tekst: 'Sum månedlig alderspensjon',
          verdi: `${formatInntekt(
            (grunnpensjon +
              tilleggspensjon +
              skjermingstillegg +
              pensjonstillegg +
              inntektspensjonBeloep +
              garantipensjonBeloep) /
              12
          )} kr`,
        },
      ].filter((rad) => rad.verdi !== '0 kr')
    })

    const opptjeningKap19Objekt: DetaljRad[] = (() => {
      if (
        alderspensjonVedUttak.length === 0 ||
        alderspensjonVedUttak[0].andelsbroekKap19 === 0
      ) {
        return []
      }
      return alderspensjonVedUttak
        .map((ap) => [
          {
            tekst: 'Andelsbrøk',
            verdi: ap.andelsbroekKap19 ? `${ap.andelsbroekKap19 * 10}/10` : 0,
          },
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
    })()

    const opptjeningKap20Objekt: DetaljRad[] = (() => {
      if (
        alderspensjonVedUttak.length === 0 ||
        alderspensjonVedUttak[0].andelsbroekKap20 === 0
      ) {
        return []
      }
      return alderspensjonVedUttak
        .map((ap) => [
          {
            tekst: 'Andelsbrøk',
            verdi: ap.andelsbroekKap20 ? `${ap.andelsbroekKap20 * 10}/10` : 0,
          },
          { tekst: 'Trygdetid', verdi: ap.trygdetidKap20 },
          {
            tekst: 'Pensjonbeholdning før uttak',
            verdi: `${formatInntekt(ap.pensjonBeholdningFoerUttakBeloep)} kr`,
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
      grunnpensjonObjekter,
      opptjeningKap19Objekt,
      opptjeningKap20Objekt,
      opptjeningPre2025OffentligAfpObjekt,
    }
  }, [alderspensjonListe, pre2025OffentligAfp])
}

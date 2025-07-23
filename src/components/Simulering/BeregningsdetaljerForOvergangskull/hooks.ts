import { useMemo } from 'react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { formatDecimalWithComma, formatInntekt } from '@/utils/inntekt'

export interface DetaljRad {
  tekst: string
  verdi?: number | string
}

export interface AlderspensjonDetaljerListe {
  alderspensjon: DetaljRad[]
  opptjeningKap19: DetaljRad[]
  opptjeningKap20: DetaljRad[]
}

export interface AfpDetaljerListe {
  afpPrivat: DetaljRad[]
  afpOffentlig: DetaljRad[]
  pre2025OffentligAfp: DetaljRad[]
  opptjeningPre2025OffentligAfp: DetaljRad[]
}

export interface BeregningsdetaljerRader {
  alderspensjonDetaljerListe: AlderspensjonDetaljerListe[]
  afpDetaljerListe: AfpDetaljerListe[]
}

function getAlderspenListeForValgtUttaksalder(
  uttaksalder: { aar: number; maaneder?: number } | null,
  gradertUttaksperiode: GradertUttak | null,
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
) {
  if (!alderspensjonListe || alderspensjonListe.length === 0 || !uttaksalder) {
    return []
  }
  const filtrertAldersPensjonListe = alderspensjonListe.filter((ap) => {
    const gradertUttak =
      gradertUttaksperiode &&
      ap.alder === gradertUttaksperiode.uttaksalder.aar &&
      gradertUttaksperiode.grad > 0
    if (
      gradertUttak &&
      gradertUttaksperiode.uttaksalder.aar !== uttaksalder.aar
    ) {
      return gradertUttak
    } else {
      // heluttak
      return ap.alder === uttaksalder.aar
    }
  })

  if (!filtrertAldersPensjonListe.length) {
    // Bruker født < 1963, velger AFPOffentlig i simulering med uttaksalder < 67, hente første element fra listen siden den tilhører 67 år
    filtrertAldersPensjonListe.push(alderspensjonListe[0])
  }
  return filtrertAldersPensjonListe
}

function getAlderspensjonDetaljerListe(
  alderspensjonListeForValgtUttaksalder: AlderspensjonPensjonsberegning[]
) {
  const alderspensjonDetaljerListe: AlderspensjonDetaljerListe[] = []

  const getAlderspensjonDetails = (ap: AlderspensjonPensjonsberegning) => {
    const grunnpensjon =
      ap.grunnpensjon && ap.grunnpensjon > 0
        ? Math.round(ap.grunnpensjon / 12)
        : 0
    const tilleggspensjon =
      ap.tilleggspensjon && ap.tilleggspensjon > 0
        ? Math.round(ap.tilleggspensjon / 12)
        : 0
    const skjermingstillegg =
      ap.skjermingstillegg && ap.skjermingstillegg > 0
        ? Math.round(ap.skjermingstillegg / 12)
        : 0
    const pensjonstillegg =
      ap.pensjonstillegg && ap.pensjonstillegg > 0
        ? Math.round(ap.pensjonstillegg / 12)
        : 0
    const inntektspensjonBeloep =
      ap.inntektspensjonBeloep && ap.inntektspensjonBeloep > 0
        ? Math.round(ap.inntektspensjonBeloep / 12)
        : 0
    const garantipensjonBeloep =
      ap.garantipensjonBeloep && ap.garantipensjonBeloep > 0
        ? Math.round(ap.garantipensjonBeloep / 12)
        : 0

    const gjenlevendetillegg =
      ap.kapittel19Gjenlevendetillegg && ap.kapittel19Gjenlevendetillegg > 0
        ? Math.round(ap.kapittel19Gjenlevendetillegg / 12)
        : 0

    return [
      {
        tekst: 'Grunnpensjon (kap. 19)',
        verdi: `${formatInntekt(grunnpensjon)} kr`,
      },
      {
        tekst: 'Tilleggspensjon (kap. 19)',
        verdi: `${formatInntekt(tilleggspensjon)} kr`,
      },
      {
        tekst: 'Skjermingstillegg (kap. 19)',
        verdi: `${formatInntekt(skjermingstillegg)} kr`,
      },
      {
        tekst: 'Pensjonstillegg (kap. 19)',
        verdi: `${formatInntekt(pensjonstillegg)} kr`,
      },
      {
        tekst: 'Gjenlevendetillegg (kap. 19)',
        verdi: `${formatInntekt(gjenlevendetillegg)} kr`,
      },
      {
        tekst: 'Inntektspensjon (kap. 20)',
        verdi: `${formatInntekt(inntektspensjonBeloep)} kr`,
      },
      {
        tekst: 'Garantipensjon (kap. 20)',
        verdi: `${formatInntekt(garantipensjonBeloep)} kr`,
      },
      {
        tekst: 'Sum alderspensjon',
        verdi: `${formatInntekt(
          grunnpensjon +
            tilleggspensjon +
            skjermingstillegg +
            pensjonstillegg +
            inntektspensjonBeloep +
            garantipensjonBeloep +
            gjenlevendetillegg
        )} kr`,
      },
    ].filter((rad) => rad.verdi !== '0 kr')
  }

  const getOpptjeningKap19Details = (ap: AlderspensjonPensjonsberegning) => {
    if (ap.andelsbroekKap19 === 0) {
      return []
    }
    return [
      {
        tekst: 'Andelsbrøk',
        verdi: ap.andelsbroekKap19 ? `${ap.andelsbroekKap19 * 10}/10` : 0,
      },
      {
        tekst: 'Sluttpoengtall',
        verdi: formatDecimalWithComma(ap.sluttpoengtall),
      },
      {
        tekst: 'Poengår',
        verdi: (ap.poengaarFoer92 ?? 0) + (ap.poengaarEtter91 ?? 0),
      },
      { tekst: 'Trygdetid', verdi: ap.trygdetidKap19 },
    ].filter(
      (rad) =>
        rad.verdi !== undefined &&
        (rad.tekst === 'Poengår' ||
          rad.tekst === 'Trygdetid' ||
          (rad.verdi !== 0 && rad.verdi !== '10/10'))
    )
  }

  const getOpptjeningKap20Details = (ap: AlderspensjonPensjonsberegning) => {
    if (ap.andelsbroekKap20 === 0) {
      return []
    }

    return [
      {
        tekst: 'Andelsbrøk',
        verdi: ap.andelsbroekKap20 ? `${ap.andelsbroekKap20 * 10}/10` : 0,
      },
      { tekst: 'Trygdetid', verdi: ap.trygdetidKap20 },
      {
        tekst: 'Pensjonsbeholdning',
        verdi: `${formatInntekt(ap.pensjonBeholdningFoerUttakBeloep)} kr`,
      },
    ].filter(
      (rad) =>
        rad.verdi !== undefined &&
        (rad.tekst === 'Trygdetid' ||
          rad.tekst === 'Pensjonsbeholdning' ||
          (rad.verdi !== 0 && rad.verdi !== '10/10'))
    )
  }

  alderspensjonListeForValgtUttaksalder.forEach((ap) => {
    const obj = {
      alderspensjon: getAlderspensjonDetails(ap),
      opptjeningKap19: getOpptjeningKap19Details(ap),
      opptjeningKap20: getOpptjeningKap20Details(ap),
    }
    alderspensjonDetaljerListe.push(obj)
  })

  return alderspensjonDetaljerListe
}

function getAfpDetaljerListe(
  afpPrivatListe?: AfpPrivatPensjonsberegning[],
  afpOffentligListe?: AfpPensjonsberegning[],
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning,
  uttaksalder?: { aar: number; maaneder?: number } | null,
  gradertUttaksperiode?: GradertUttak | null
): AfpDetaljerListe[] {
  const afpDetaljerListe: AfpDetaljerListe[] = []

  const getAfpPrivatDetails = (afpPrivat: AfpPrivatPensjonsberegning) => {
    return [
      {
        tekst: 'Kompensasjonstillegg',
        verdi: `${formatInntekt(afpPrivat.kompensasjonstillegg)} kr`,
      },
      {
        tekst: 'Kronetillegg',
        verdi: `${formatInntekt(afpPrivat.kronetillegg)} kr`,
      },
      {
        tekst: 'Livsvarig del',
        verdi: `${formatInntekt(afpPrivat.livsvarig)} kr`,
      },
      {
        tekst: 'Sum AFP',
        verdi: `${formatInntekt(afpPrivat.maanedligBeloep)} kr`,
      },
    ].filter((rad) => rad.verdi !== '0 kr')
  }

  const getAfpOffentligDetails = (afpOffentlig: AfpPensjonsberegning) => {
    return [
      {
        tekst: 'Månedlig livsvarig avtalefestet pensjon (AFP)',
        verdi: `${formatInntekt(afpOffentlig.maanedligBeloep)} kr`,
      },
    ]
  }

  const getPre2025OffentligAfpDetails = (
    pre2025OffentligAfpData: pre2025OffentligPensjonsberegning
  ) => {
    const grunnpensjon =
      pre2025OffentligAfpData.grunnpensjon &&
      pre2025OffentligAfpData.grunnpensjon > 0
        ? Math.round(pre2025OffentligAfpData.grunnpensjon)
        : 0
    const tilleggspensjon =
      pre2025OffentligAfpData.tilleggspensjon &&
      pre2025OffentligAfpData.tilleggspensjon > 0
        ? Math.round(pre2025OffentligAfpData.tilleggspensjon)
        : 0
    const afpTillegg =
      pre2025OffentligAfpData.afpTillegg &&
      pre2025OffentligAfpData.afpTillegg > 0
        ? Math.round(pre2025OffentligAfpData.afpTillegg)
        : 0
    const saertillegg =
      pre2025OffentligAfpData.saertillegg &&
      pre2025OffentligAfpData.saertillegg > 0
        ? Math.round(pre2025OffentligAfpData.saertillegg)
        : 0

    return [
      {
        tekst: 'Grunnpensjon (kap. 19)',
        verdi: `${formatInntekt(grunnpensjon)} kr`,
      },
      {
        tekst: 'Tilleggspensjon (kap. 19)',
        verdi: `${formatInntekt(tilleggspensjon)} kr`,
      },
      {
        tekst: 'AFP-tillegg',
        verdi: `${formatInntekt(afpTillegg)} kr`,
      },
      {
        tekst: 'Særtillegg',
        verdi: `${formatInntekt(saertillegg)} kr`,
      },
      {
        tekst: 'Sum AFP',
        verdi: `${formatInntekt(
          grunnpensjon + tilleggspensjon + afpTillegg + saertillegg
        )} kr`,
      },
    ].filter((rad) => rad.verdi !== '0 kr')
  }

  const getOpptjeningPre2025OffentligAfpDetails = (
    pre2025OffentligAfpData: pre2025OffentligPensjonsberegning
  ) => {
    return [
      { tekst: 'AFP grad', verdi: pre2025OffentligAfpData.afpGrad },
      {
        tekst: 'Sluttpoengtall',
        verdi: pre2025OffentligAfpData.sluttpoengtall,
      },
      {
        tekst: 'Poengår',
        verdi:
          (pre2025OffentligAfpData.poengaarTom1991 ?? 0) +
          (pre2025OffentligAfpData.poengaarFom1992 ?? 0),
      },
      { tekst: 'Trygdetid', verdi: pre2025OffentligAfpData.trygdetid },
    ].filter(
      (rad) =>
        rad.verdi !== undefined &&
        (rad.tekst === 'Poengår' ||
          rad.tekst === 'Trygdetid' ||
          rad.verdi !== 0)
    )
  }

  if (afpPrivatListe && afpPrivatListe.length > 0) {
    const gradertUttakAge = gradertUttaksperiode?.uttaksalder?.aar
    const heltUttakAge = uttaksalder?.aar

    // Adder alltid en entry for yngste alder
    const firstAge = gradertUttakAge ?? heltUttakAge

    if (firstAge) {
      // Finner AFP data for yngste alder
      let afpPrivatVedForsteUttak = afpPrivatListe.find(
        (afp) => afp.alder === firstAge
      )
      if (!afpPrivatVedForsteUttak) {
        // Fallback til første element
        afpPrivatVedForsteUttak = afpPrivatListe[0]
      }

      if (afpPrivatVedForsteUttak) {
        afpDetaljerListe.push({
          afpPrivat: getAfpPrivatDetails(afpPrivatVedForsteUttak),
          afpOffentlig: [],
          pre2025OffentligAfp: [],
          opptjeningPre2025OffentligAfp: [],
        })
      }

      // Hvis første alder er mindre enn 67, inkluder også alder 67 data
      if (firstAge < 67) {
        const afp67 = afpPrivatListe.find((afp) => afp.alder === 67)
        if (afp67) {
          afpDetaljerListe.push({
            afpPrivat: getAfpPrivatDetails(afp67),
            afpOffentlig: [],
            pre2025OffentligAfp: [],
            opptjeningPre2025OffentligAfp: [],
          })
        } else {
          // Hvis ikke, bruk den alderen som er nærmeste 67
          const closestAfp67Plus = afpPrivatListe.find((afp) => afp.alder >= 67)
          if (closestAfp67Plus) {
            afpDetaljerListe.push({
              afpPrivat: getAfpPrivatDetails(closestAfp67Plus),
              afpOffentlig: [],
              pre2025OffentligAfp: [],
              opptjeningPre2025OffentligAfp: [],
            })
          }
        }
      }
    }
  }

  // Handle AFP Offentlig
  if (afpOffentligListe && afpOffentligListe.length > 0) {
    const afpAar = Math.min(
      uttaksalder?.aar ?? Infinity,
      gradertUttaksperiode?.uttaksalder.aar ?? Infinity
    )

    const afpOffentligVedUttak = afpOffentligListe.find(
      (it) => it.alder >= afpAar
    )

    if (afpOffentligVedUttak) {
      afpDetaljerListe.push({
        afpPrivat: [],
        afpOffentlig: getAfpOffentligDetails(afpOffentligVedUttak),
        pre2025OffentligAfp: [],
        opptjeningPre2025OffentligAfp: [],
      })
    }
  }

  // Handle Pre-2025 Offentlig AFP
  if (pre2025OffentligAfp) {
    afpDetaljerListe.push({
      afpPrivat: [],
      afpOffentlig: [],
      pre2025OffentligAfp: getPre2025OffentligAfpDetails(pre2025OffentligAfp),
      opptjeningPre2025OffentligAfp:
        getOpptjeningPre2025OffentligAfpDetails(pre2025OffentligAfp),
    })
  }

  return afpDetaljerListe
}

export function useBeregningsdetaljer(
  alderspensjonListe?: AlderspensjonPensjonsberegning[],
  afpPrivatListe?: AfpPrivatPensjonsberegning[],
  afpOffentligListe?: AfpPensjonsberegning[],
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
): BeregningsdetaljerRader {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  return useMemo(() => {
    const alderspensjonListeForValgtUttaksalder =
      getAlderspenListeForValgtUttaksalder(
        uttaksalder,
        gradertUttaksperiode,
        alderspensjonListe
      )
    const alderspensjonDetaljerListe = getAlderspensjonDetaljerListe(
      alderspensjonListeForValgtUttaksalder
    )
    const afpDetaljerListe = getAfpDetaljerListe(
      afpPrivatListe,
      afpOffentligListe,
      pre2025OffentligAfp,
      uttaksalder,
      gradertUttaksperiode
    )

    return {
      alderspensjonDetaljerListe,
      afpDetaljerListe,
    }
  }, [
    alderspensjonListe,
    afpPrivatListe,
    afpOffentligListe,
    pre2025OffentligAfp,
    uttaksalder,
    gradertUttaksperiode,
  ])
}

import { checkHarSamboer } from '@/utils/sivilstand'
import { format, parseISO } from 'date-fns'

// TODO skrive tester
export const generateTidligsteHelUttaksalderRequestBody = (args: {
  afp: AfpRadio | null
  sivilstand?: Sivilstand | null | undefined
  harSamboer: boolean | null
  aarligInntektFoerUttakBeloep: number
  aarligInntektVsaPensjon?: { beloep: number; sluttAlder: Alder }
}): TidligsteHelUttaksalderRequestBody | undefined => {
  const {
    afp,
    sivilstand,
    harSamboer,
    aarligInntektFoerUttakBeloep,
    aarligInntektVsaPensjon,
  } = args

  return {
    simuleringstype:
      afp === 'ja_privat' ? 'ALDERSPENSJON_MED_AFP_PRIVAT' : 'ALDERSPENSJON',
    harEps: harSamboer !== null ? harSamboer : false, // TODO sjekke med Espen om det er riktig
    aarligInntektFoerUttakBeloep,
    sivilstand:
      sivilstand && checkHarSamboer(sivilstand)
        ? sivilstand
        : harSamboer
          ? 'SAMBOER'
          : 'UGIFT',
    aarligInntektVsaPensjon,
  }
}

// TODO denne skal aktiveres ifbm tidligste uttaksalder for avansert fane
// export const generateTidligsteGradertUttaksalderRequestBody = (args: {
//   afp: AfpRadio | null
//   sivilstand?: Sivilstand | null | undefined
//   harSamboer: boolean | null
//   aarligInntektFoerUttakBeloep: number
//   gradertUttak: Omit<GradertUttaksperiode, 'uttaksperiode'>
// }): TidligsteGradertUttaksalderRequestBody | undefined => {
//   const {
//     afp,
//     sivilstand,
//     harSamboer,
//     aarligInntektFoerUttakBeloep,
//     gradertUttak,
//   } = args

//   return {
//     simuleringstype:
//       afp === 'ja_privat' ? 'ALDERSPENSJON_MED_AFP_PRIVAT' : 'ALDERSPENSJON',
//     harEps: harSamboer !== null ? harSamboer : false, // TODO sjekke med Espen om det er riktig
//     aarligInntekt: aarligInntektFoerUttakBeloep,
//     sivilstand:
//       sivilstand && checkHarSamboer(sivilstand)
//         ? sivilstand
//         : harSamboer
//           ? 'SAMBOER'
//           : 'UGIFT',
//     gradertUttak,
//   }
// }

export const generateAlderspensjonRequestBody = (args: {
  afp: AfpRadio | null
  sivilstand?: Sivilstand | null | undefined
  harSamboer: boolean | null
  foedselsdato: string | null | undefined
  aarligInntektFoerUttakBeloep: number
  gradertUttak?: GradertUttaksperiode
  heltUttak?: HeltUttaksperiode
}): AlderspensjonRequestBody | undefined => {
  const {
    afp,
    sivilstand,
    harSamboer,
    foedselsdato,
    aarligInntektFoerUttakBeloep,
    gradertUttak,
    heltUttak,
  } = args

  if (!foedselsdato || !heltUttak) {
    return undefined
  }

  return {
    simuleringstype:
      afp === 'ja_privat' ? 'ALDERSPENSJON_MED_AFP_PRIVAT' : 'ALDERSPENSJON',
    foedselsdato: format(parseISO(foedselsdato), 'yyyy-MM-dd'),
    epsHarInntektOver2G: true, // Fast i MVP1 - Har ektefelle/partner/samboer inntekt over 2 ganger grunnbeløpet
    aarligInntektFoerUttakBeloep,
    sivilstand:
      sivilstand && checkHarSamboer(sivilstand)
        ? sivilstand
        : harSamboer
          ? 'SAMBOER'
          : 'UGIFT',
    gradertUttak,
    heltUttak: {
      ...heltUttak,
    },
  }
}

export const generateAlderspensjonEnkelRequestBody = (args: {
  afp: AfpRadio | null
  sivilstand?: Sivilstand | null | undefined
  harSamboer: boolean | null
  foedselsdato: string | null | undefined
  aarligInntektFoerUttakBeloep: number
  uttaksalder: Alder | null
}): AlderspensjonRequestBody | undefined => {
  const {
    afp,
    sivilstand,
    harSamboer,
    foedselsdato,
    aarligInntektFoerUttakBeloep,
    uttaksalder,
  } = args

  if (!foedselsdato || !uttaksalder) {
    return undefined
  }

  return {
    simuleringstype:
      afp === 'ja_privat' ? 'ALDERSPENSJON_MED_AFP_PRIVAT' : 'ALDERSPENSJON',
    foedselsdato: format(parseISO(foedselsdato), 'yyyy-MM-dd'),
    epsHarInntektOver2G: true, // Fast i MVP1 - Har ektefelle/partner/samboer inntekt over 2 ganger grunnbeløpet
    aarligInntektFoerUttakBeloep,
    sivilstand:
      sivilstand && checkHarSamboer(sivilstand)
        ? sivilstand
        : harSamboer
          ? 'SAMBOER'
          : 'UGIFT',
    heltUttak: {
      uttaksalder,
    },
  }
}

export const generatePensjonsavtalerRequestBody = (args: {
  aarligInntektFoerUttakBeloep: number
  afp: AfpRadio | null
  sivilstand?: Sivilstand
  heltUttak: HeltUttaksperiode
  gradertUttak?: GradertUttaksperiode
}): PensjonsavtalerRequestBody => {
  const {
    aarligInntektFoerUttakBeloep,
    afp,
    sivilstand,
    heltUttak,
    gradertUttak,
  } = args
  return {
    aarligInntektFoerUttakBeloep,
    uttaksperioder: [
      ...(gradertUttak
        ? [
            {
              startAlder: {
                aar: gradertUttak.uttaksalder.aar,
                maaneder:
                  gradertUttak.uttaksalder.maaneder > 0
                    ? gradertUttak.uttaksalder.maaneder
                    : 0,
              },
              grad: gradertUttak.grad,
              aarligInntektVsaPensjon:
                gradertUttak.aarligInntektVsaPensjonBeloep
                  ? {
                      beloep: gradertUttak.aarligInntektVsaPensjonBeloep,
                      sluttAlder: heltUttak.uttaksalder,
                    }
                  : undefined,
            },
          ]
        : []),

      {
        startAlder: {
          aar: heltUttak.uttaksalder.aar ?? 0,
          maaneder:
            heltUttak.uttaksalder.maaneder > 0
              ? heltUttak.uttaksalder.maaneder
              : 0,
        },
        grad: 100,
        aarligInntektVsaPensjon: heltUttak.aarligInntektVsaPensjon,
      },
    ],
    harAfp: afp === 'ja_privat',
    // harEpsPensjon: Bruker kan angi om E/P/S har pensjon (støttes i detaljert kalkulator) – her bruker backend hardkodet false i MVP
    // harEpsPensjonsgivendeInntektOver2G: Bruker kan angi om E/P/S har inntekt >2G (støttes i detaljert kalkulator) – her bruker backend true i MVP hvis samboer/gift
    // antallAarIUtlandetEtter16: Bruker kan angi et antall (støttes i detaljert kalkulator) – her bruker backend hardkodet 0 i MVP
    sivilstand,
  }
}

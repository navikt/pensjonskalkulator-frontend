import { pensjonsavtalerKategoriMapObj } from '@/utils/pensjonsavtaler'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isInntekt = (data?: any): data is Inntekt => {
  if (
    data === null ||
    data === undefined ||
    data.beloep === undefined ||
    data.aar === undefined
  ) {
    return false
  }
  return !!(
    data.beloep >= 0 &&
    typeof data.beloep === 'number' &&
    data.aar >= 0 &&
    typeof data.aar === 'number'
  )
}

export const isPensjonsberegningArray = (
  data?: any
): data is Pensjonsberegning[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (beregning) =>
        typeof beregning.alder === 'number' &&
        typeof beregning.beloep === 'number'
    )
  )
}

export const isVilkaarsproeving = (data?: any): data is Vilkaarsproeving => {
  if (data === null || data === undefined) {
    return false
  }
  if (
    data.vilkaarErOppfylt === null ||
    data.vilkaarErOppfylt === undefined ||
    typeof data.vilkaarErOppfylt !== 'boolean'
  ) {
    return false
  }

  if (data.alternativ === undefined) {
    return true
  } else {
    return (
      typeof data.alternativ === 'object' &&
      (data.alternativ.gradertUttaksalder === undefined ||
        isAlder(data.alternativ.gradertUttaksalder)) &&
      (data.alternativ.uttaksgrad === undefined ||
        typeof data.alternativ.uttaksgrad === 'number') &&
      (data.alternativ.heltUttaksalder === undefined ||
        isAlder(data.alternativ.heltUttaksalder))
    )
  }
}

export const isAlderspensjonSimulering = (
  data?: any
): data is AlderspensjonResponseBody => {
  if (data === undefined || data === null) {
    return false
  }
  if (
    !isPensjonsberegningArray(data.alderspensjon) ||
    (data.afpPrivat && !isPensjonsberegningArray(data?.afpPrivat)) ||
    (data.afpOffentlig && !isPensjonsberegningArray(data?.afpOffentlig))
  ) {
    return false
  }

  return (
    isVilkaarsproeving(data.vilkaarsproeving) &&
    (data.harForLiteTrygdetid === undefined ||
      typeof data.harForLiteTrygdetid === 'boolean')
  )
}

export const isUtbetalingsperiode = (
  data?: any
): data is Utbetalingsperiode => {
  if (data === null || data === undefined) {
    return false
  }

  const hasCorrectSluttAlder =
    data.sluttAlder === undefined ||
    (data.sluttAlder !== undefined && isAlder(data.sluttAlder))

  return (
    data.startAlder !== undefined &&
    isAlder(data.startAlder) &&
    typeof data.grad === 'number' &&
    data.aarligUtbetaling !== undefined &&
    typeof data.aarligUtbetaling === 'number' &&
    hasCorrectSluttAlder
  )
}

export const isPensjonsavtale = (data?: any): data is Pensjonsavtale => {
  if (data === null || data === undefined) {
    return false
  }
  const harFeilUtbetalingsperiode =
    data.utbetalingsperioder !== undefined &&
    Array.isArray(data.utbetalingsperioder) &&
    data.utbetalingsperioder.some(
      (utbetalingsperiode: Utbetalingsperiode) =>
        !isUtbetalingsperiode(utbetalingsperiode)
    )

  const harFeilStartAar =
    data.startAar === undefined ||
    !data.startAar ||
    typeof data.startAar !== 'number'
  const harFeilSluttAar =
    data.sluttAar !== undefined && typeof data.sluttAar !== 'number'
  return (
    !Array.isArray(data) &&
    data.produktbetegnelse &&
    typeof data.produktbetegnelse === 'string' &&
    data.kategori &&
    isSomeEnumKey(pensjonsavtalerKategoriMapObj)(data.kategori) &&
    Array.isArray(data.utbetalingsperioder) &&
    !harFeilUtbetalingsperiode &&
    !harFeilStartAar &&
    !harFeilSluttAar
  )
}

export const isPerson = (data?: any): data is Person => {
  return !!(
    [
      null,
      'UOPPGITT',
      'UGIFT',
      'GIFT',
      'ENKE_ELLER_ENKEMANN',
      'SKILT',
      'SEPARERT',
      'REGISTRERT_PARTNER',
      'SEPARERT_PARTNER',
      'SKILT_PARTNER',
      'GJENLEVENDE_PARTNER',
    ].includes(data?.sivilstand) &&
    data.navn &&
    typeof data.navn === 'string' &&
    data.foedselsdato &&
    data.foedselsdato !== undefined &&
    new Date(data.foedselsdato).toString() !== 'Invalid Date'
  )
}

export const isTpoMedlemskap = (data?: any): data is TpoMedlemskap => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    Array.isArray(data.tpLeverandoerListe) &&
    data.tpLeverandoerListe.every(
      (tpLeverandoer: string) => typeof tpLeverandoer === 'string'
    )
  )
}

export const isUnleashToggle = (data?: any): data is UnleashToggle => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    typeof data.enabled === 'boolean'
  )
}

export const isEkskludertStatus = (data?: any): data is EkskludertStatus => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    typeof data.ekskludert === 'boolean' &&
    ['NONE', 'ER_APOTEKER'].includes(data?.aarsak)
  )
}

export const isOmstillingsstoenadOgGjenlevende = (
  data?: any
): data is OmstillingsstoenadOgGjenlevende => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    typeof data.harLoependeSak === 'boolean'
  )
}

export const isLoependeVedtak = (data?: any): data is LoependeVedtak => {
  if (data === null || data === undefined) {
    return false
  }

  if (
    data.alderspensjon === null ||
    data.ufoeretrygd === null ||
    data.afpPrivat === null ||
    data.afpOffentlig === null
  ) {
    return false
  }

  return (
    typeof data === 'object' &&
    !Array.isArray(data) &&
    typeof data.alderspensjon === 'object' &&
    typeof data.ufoeretrygd === 'object' &&
    typeof data.afpPrivat === 'object' &&
    typeof data.afpOffentlig === 'object' &&
    typeof data.alderspensjon.loepende === 'boolean' &&
    typeof data.ufoeretrygd.loepende === 'boolean' &&
    typeof data.afpPrivat.loepende === 'boolean' &&
    typeof data.afpOffentlig.loepende === 'boolean' &&
    typeof data.alderspensjon.grad === 'number' &&
    typeof data.ufoeretrygd.grad === 'number' &&
    typeof data.afpPrivat.grad === 'number' &&
    typeof data.afpOffentlig.grad === 'number'
  )
}

export const isAlder = (data?: any): data is Alder => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    typeof data.aar === 'number' &&
    typeof data.maaneder === 'number'
  )
}

export const isSomeEnumKey =
  <T extends { [s: string]: unknown }>(e: T) =>
  (token: unknown): token is T[keyof T] => {
    return Object.keys(e).includes(token as string)
  }

export const isAnchorTag = (target?: any): target is HTMLAnchorElement => {
  return target && target?.tagName === 'A' && target?.href
}

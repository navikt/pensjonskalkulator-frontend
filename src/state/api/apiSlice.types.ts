export type PensjonsavtalerRequestBody = {
  aarligInntektFoerUttak?: number
  uttaksperioder: Uttaksperiode[]
  antallInntektsaarEtterUttak: number
}

export type Uttaksperiode = {
  startAlder: number
  startMaaned: number
  grad: number
  aarligInntekt: number
}

export type PensjonsavtalerResponseBody = {
  avtaler: Pensjonsavtale[]
  utilgjengeligeSelskap: UtilgjengeligeSelskap[]
}

export type AlderspensjonRequestBody = {
  simuleringstype: string
  uttaksgrad: number
  foersteUttaksdato: string
  epsHarInntektOver2G: boolean
  forventetInntekt?: number
  sivilstand?: Sivilstand
}

export type AlderspensjonResponseBody = {
  pensjon: Pensjonsberegning[]
}

export type UttaksalderRequestBody = {
  sivilstand?: Sivilstand
  harEps?: boolean
  sisteInntekt?: number
}

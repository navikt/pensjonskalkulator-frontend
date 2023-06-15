export type UttaksalderRequestBody = {
  sivilstand?: Sivilstand
  harEps?: boolean
  sisteInntekt?: number
}

export type SimuleringRequestBody = {
  simuleringstype: string
  uttaksgrad: number
  foersteUttaksdato: string
  epsHarInntektOver2G: boolean
  forventetInntekt?: number
  sivilstand?: Sivilstand
}

export type SimuleringResponseBody = {
  alderspensjon: Pensjonsberegning[]
  afpPrivat: Pensjonsberegning[]
}

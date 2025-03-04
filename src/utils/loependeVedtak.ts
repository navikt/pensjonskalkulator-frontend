export const isLoependeVedtakEndring = (loependeVedtak: LoependeVedtak) => {
  return !!loependeVedtak.alderspensjon
}

export const isVedtakAlderspensjon = (loependeVedtak: LoependeVedtak) => {
  return !!loependeVedtak.alderspensjon
}

export const isVedtakOffentligAFP = (loependeVedtak: LoependeVedtak) => {
  return !!loependeVedtak.afpOffentlig
}

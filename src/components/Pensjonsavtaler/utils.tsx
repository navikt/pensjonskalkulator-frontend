import { pensjonsavtalerKategoriMapObj } from '@/utils/pensjonsavtaler'

export const groupPensjonsavtalerByType = (
  pensjonsavtaler: Pensjonsavtale[]
): Record<
  (typeof pensjonsavtalerKategoriMapObj)[keyof typeof pensjonsavtalerKategoriMapObj],
  Pensjonsavtale[]
> => {
  const record: Record<string, Pensjonsavtale[]> = {}

  for (const avtale of pensjonsavtaler) {
    const avtaleString = pensjonsavtalerKategoriMapObj[avtale.kategori]

    if (!Array.isArray(record[avtaleString])) {
      record[avtaleString] = [avtale]
    } else {
      record[avtaleString]?.push(avtale)
    }
  }
  return record
}

export const finnAllePensjonsavtalerVedUttak = (
  pensjonsavtaler: Pensjonsavtale[],
  uttak: Alder
) => {
  const pensjonsavtalerVedUttak = pensjonsavtaler.filter((pensjonsavtale) => {
    const { utbetalingsperioder } = pensjonsavtale

    const utbetalingsperioderVedUttak = utbetalingsperioder.filter(
      (utbetalingsperiode) => {
        const { startAlder, sluttAlder } = utbetalingsperiode

        return (
          (uttak.aar > startAlder.aar ||
            (uttak.aar === startAlder.aar &&
              uttak.maaneder >= startAlder.maaneder)) &&
          ((sluttAlder && uttak.aar < sluttAlder.aar) ||
            (sluttAlder &&
              uttak.aar === sluttAlder.aar &&
              uttak.maaneder <= sluttAlder.maaneder) ||
            !sluttAlder)
        )
      }
    )
    return utbetalingsperioderVedUttak.length > 0
  })

  return pensjonsavtalerVedUttak
}

export const hentSumPensjonsavtalerVedUttak = (
  pensjonsavtaler: Pensjonsavtale[],
  uttaksalder: Alder
) => {
  return finnAllePensjonsavtalerVedUttak(pensjonsavtaler, uttaksalder)
    .map((avtale) => avtale.utbetalingsperioder)
    .flat()
    .reduce((acc, curr) => acc + Math.round(curr.aarligUtbetaling / 12), 0)
}

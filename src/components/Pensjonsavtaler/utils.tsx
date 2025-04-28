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

export const finnAllePensjonsavtalerVedUttak = <
  T extends { startAlder: Alder; sluttAlder?: Alder },
>(
  utbetalingsperioder: T[],
  uttak: Alder
) => {
  const utbetalingsperioderVedUttak = utbetalingsperioder.filter(
    (utbetalingsperiode) => {
      const { startAlder, sluttAlder } = utbetalingsperiode

      return (
        (uttak.aar > startAlder.aar ||
          (uttak.aar === startAlder.aar &&
            uttak.maaneder >= startAlder.maaneder)) &&
        (!sluttAlder ||
          uttak.aar < sluttAlder.aar ||
          (uttak.aar === sluttAlder.aar &&
            uttak.maaneder <= sluttAlder.maaneder))
      )
    }
  )
  return utbetalingsperioderVedUttak
}

export const hentSumPensjonsavtalerVedUttak = (
  pensjonsavtaler: Pensjonsavtale[],
  uttaksalder: Alder
) => {
  return finnAllePensjonsavtalerVedUttak(
    pensjonsavtaler.map((avtale) => avtale.utbetalingsperioder).flat(),
    uttaksalder
  )
    .flat()
    .reduce((acc, curr) => acc + Math.round(curr.aarligUtbetaling / 12), 0)
}

export const hentSumOffentligTjenestepensjonVedUttak = (
  simulertTjenestepensjon: SimulertTjenestepensjon,
  alder: Alder
) => {
  return finnAllePensjonsavtalerVedUttak(
    simulertTjenestepensjon?.simuleringsresultat.utbetalingsperioder.flat(),
    alder
  )
    .flat()
    .reduce((acc, curr) => acc + Math.round(curr.maanedligUtbetaling ?? 0), 0)
}

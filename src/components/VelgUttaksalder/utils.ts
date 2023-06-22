import { addYears, format } from 'date-fns'

export const formatUttaksalder = (
  { aar, maaned }: Uttaksalder,
  options: { compact: boolean } = { compact: false }
): string => {
  return maaned !== 0
    ? `${aar} år og ${maaned} ${options.compact ? 'md.' : 'måneder'}`
    : `${aar} år`
}

export const getAldere = (
  start: Uttaksalder,
  end: Uttaksalder = { aar: 75, maaned: 0, uttaksdato: start.uttaksdato }
): Uttaksalder[] => {
  if (end.aar < start.aar) {
    return []
  }

  const aldere: Uttaksalder[] = [start]

  for (let i = start.aar + 1; i <= end.aar; i++) {
    aldere.push({
      aar: i,
      maaned: 0,
      uttaksdato: format(
        addYears(new Date(start.uttaksdato), i - start.aar),
        'yyyy-MM-dd'
      ),
    })
  }

  return aldere
}

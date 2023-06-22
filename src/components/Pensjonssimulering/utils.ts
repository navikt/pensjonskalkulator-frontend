export const findTidligsteAlder = (simulering: Simulering): number =>
  Object.values(simulering)
    .filter((beregning) => beregning.length > 0)
    .reduce(
      (start, beregning) =>
        beregning[0].alder < start ? beregning[0].alder : start,
      Number.POSITIVE_INFINITY
    )

export const findSenesteAlder = (simulering: Simulering): number =>
  Object.values(simulering)
    .filter((beregning) => beregning.length > 0)
    .reduce(
      (end, beregning) =>
        beregning[beregning.length - 1].alder > end
          ? beregning[beregning.length - 1].alder
          : end,
      Number.NEGATIVE_INFINITY
    )

export const generateXAxis = (
  startAlder: number,
  endAlder: number
): string[] => {
  if (startAlder < 0 || endAlder < 0) {
    throw Error('Aldere kan ikke være negative')
  }

  if (startAlder > endAlder) {
    throw Error('Siste alder kan ikke være mindre enn første alder')
  }

  const alderArray: string[] = []
  for (let i = startAlder; i <= endAlder; i++) {
    if (i === startAlder) {
      alderArray.push((i - 1).toString())
    }

    if (i === endAlder) {
      alderArray.push(`${i - 1}+`.toString())
    } else {
      alderArray.push(i.toString())
    }
  }

  return alderArray
}

const padBeginning = (beregning: Pensjonsberegning[], start: number): void => {
  const diff = beregning[0].alder - start
  if (diff > 0) {
    const tidligereBeregninger = new Array(diff)
      .fill({ alder: start, belop: 0 })
      .map((it, i) => ({ alder: it.alder + i, belop: 0 }))
    beregning.splice(0, 0, ...tidligereBeregninger)
  }
}

const padEnd = (
  beregning: Pensjonsberegning[],
  end: number,
  livsvarig?: boolean
): void => {
  const lastBeregning = beregning[beregning.length - 1]
  const diff = end - lastBeregning.alder
  if (diff > 0) {
    const senereBeregninger = new Array(diff)
      .fill({
        alder: end,
        belop: livsvarig ? lastBeregning.belop : 0,
      })
      .map((it, i) => ({ alder: it.alder + i, belop: it.belop }))
    beregning.splice(beregning.length, 0, ...senereBeregninger)
  }
}

export const getSeriesData = (
  beregning: Pensjonsberegning[],
  { start, end, livsvarig }: { start: number; end: number; livsvarig?: boolean }
): number[] => {
  if (beregning.length === 0) {
    return []
  }
  const data = [...beregning]
  padBeginning(data, start)
  padEnd(data, end, livsvarig)
  return data.map(({ belop }) => belop)
}

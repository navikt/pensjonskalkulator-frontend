import { Chart, Point, Series } from 'highcharts'
import { IntlShape } from 'react-intl'

import { getAlderMinus1Maaned } from '@/utils/alder'

import {
  COLUMN_WIDTH,
  MAX_UTTAKSALDER,
  SERIES_COLORS,
  highchartsScrollingSelector,
} from './constants'
import {
  ExtendedAxis,
  HighchartsScrollingHTMLDivElement,
} from './utils-highcharts'

export const getChartDefaults = (aarArray: string[]) => {
  return {
    chart: {
      type: 'column',
      scrollablePlotArea: {
        minWidth: aarArray.length * COLUMN_WIDTH * 1.6,
        scrollPositionX: 0,
      },
    },
    xAxis: {
      categories: aarArray,
    },
  }
}

export const processInntektArray = (args: {
  xAxisStartAar: number
  inntektFoerUttakBeloep: number
  gradertUttak:
    | {
        fra: Alder
        til: Alder
        beloep?: number
      }
    | undefined
  heltUttak:
    | {
        fra: Alder
        til?: Alder
        beloep?: number
      }
    | undefined

  xAxisLength: number
}): number[] => {
  const {
    xAxisStartAar,
    inntektFoerUttakBeloep,
    gradertUttak,
    heltUttak,
    xAxisLength,
  } = args

  const utbetalingsperioder = [
    // før uttak
    {
      startAlder: { aar: xAxisStartAar, maaneder: 0 },
      sluttAlder: gradertUttak
        ? getAlderMinus1Maaned(gradertUttak.fra)
        : heltUttak
          ? getAlderMinus1Maaned(heltUttak.fra)
          : undefined,
      aarligUtbetaling: inntektFoerUttakBeloep,
    },
    // gradert
    ...(gradertUttak
      ? [
          {
            startAlder: gradertUttak.fra,
            sluttAlder: gradertUttak.til,
            aarligUtbetaling: gradertUttak.beloep ?? 0,
          },
        ]
      : []),
    // helt
    ...(heltUttak
      ? [
          {
            startAlder: heltUttak.fra,
            sluttAlder: heltUttak.til,
            aarligUtbetaling: heltUttak.beloep ?? 0,
          },
        ]
      : []),
  ]

  const sluttAlder = xAxisStartAar + xAxisLength - 1
  const result = new Array<number>(sluttAlder - xAxisStartAar + 1).fill(0)

  utbetalingsperioder.forEach((utbetalingsperiode) => {
    const periodeStartYear = Math.max(
      xAxisStartAar,
      utbetalingsperiode.startAlder.aar
    )
    const avtaleEndYear = utbetalingsperiode.sluttAlder
      ? Math.min(sluttAlder, utbetalingsperiode.sluttAlder.aar)
      : sluttAlder

    for (let year = periodeStartYear; year <= avtaleEndYear; year++) {
      if (year >= xAxisStartAar) {
        const antallMaanederMedPensjon = getAntallMaanederMedPensjon(
          year,
          utbetalingsperiode.startAlder,
          utbetalingsperiode.sluttAlder
        )

        const allocatedAmount =
          (utbetalingsperiode.aarligUtbetaling *
            Math.max(0, antallMaanederMedPensjon)) /
          12
        result[year - xAxisStartAar] += allocatedAmount
      }
    }
  })

  return result
}

export const processPensjonsberegningArray = (
  pensjonsberegninger: AfpPensjonsberegning[] = [],
  isEndring: boolean,
  xAxisLength: number
): number[] => {
  const arrayLength = Math.max(
    xAxisLength,
    isEndring ? pensjonsberegninger.length + 1 : pensjonsberegninger.length + 2
  )
  const dataArray = isEndring ? [] : new Array<number>(1).fill(0)

  const livsvarigPensjonsbeloep =
    pensjonsberegninger[pensjonsberegninger.length - 1]?.beloep ?? 0

  for (let index = isEndring ? 0 : 1; index < arrayLength; index++) {
    const pensjonsBeregningAtIndex =
      pensjonsberegninger[isEndring ? index : index - 1]
    dataArray.push(
      pensjonsBeregningAtIndex
        ? pensjonsBeregningAtIndex.beloep
        : livsvarigPensjonsbeloep
    )
  }
  return dataArray
}

//TODO: refaktorer processPensjonsberegningArray slik at den også tar hensyn til AFP etterfulgt av AP
export const processPensjonsberegningArrayForKap19 = (
  pensjonsberegninger: AfpPensjonsberegning[] = [],
  isEndring: boolean,
  xAxisLength: number,
  startAlder: number
): number[] => {
  const arrayLength = Math.max(
    xAxisLength,
    isEndring ? pensjonsberegninger.length + 1 : pensjonsberegninger.length + 2
  )

  const filledArrayLength = pensjonsberegninger[0]
    ? Math.max(0, pensjonsberegninger[0].alder - startAlder)
    : 0

  const dataArray = new Array(
    isEndring ? filledArrayLength : filledArrayLength + 1
  ).fill(0)

  const livsvarigPensjonsbeloep =
    pensjonsberegninger[pensjonsberegninger.length - 1]?.beloep ?? 0

  for (
    let index = isEndring ? 0 : 1;
    index < arrayLength - filledArrayLength;
    index++
  ) {
    const pensjonsBeregningAtIndex =
      pensjonsberegninger[isEndring ? index : index - 1]
    dataArray.push(
      pensjonsBeregningAtIndex
        ? pensjonsBeregningAtIndex.beloep
        : livsvarigPensjonsbeloep
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return dataArray
}

//TODO: refaktorer processAfpPensjonsberegningArray. I refaktoreringen burde processPre2025OffentligAfpPensjonsberegningArray bli inkludert
export const processPre2025OffentligAfpPensjonsberegningArray = (
  xAxisLength: number,
  pensjonsberegninger: AfpPensjonsberegning[] = [],
  isEndring: boolean
): number[] => {
  if (pensjonsberegninger.length === 0) {
    return []
  }
  const arrayLength = Math.max(
    xAxisLength,
    isEndring ? pensjonsberegninger.length : pensjonsberegninger.length + 1
  )

  const dataArray = isEndring ? [] : new Array(1).fill(0)
  const startIndex = isEndring ? 0 : 1

  const livsvarigPensjonsbeloep =
    pensjonsberegninger[pensjonsberegninger.length - 1]?.beloep ?? 0

  for (let index = isEndring ? 0 : 1; index < arrayLength; index++) {
    if (startIndex > index) {
      dataArray.push(0)
    } else {
      const pensjonsBeregningAtIndex = pensjonsberegninger[index - startIndex]
      dataArray.push(
        pensjonsBeregningAtIndex
          ? pensjonsBeregningAtIndex.beloep
          : livsvarigPensjonsbeloep
      )
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return dataArray
}

export const processAfpPensjonsberegningArray = (
  xAxisStartAar: number, // uttaksaar, (uttaksaar minus 1 for førstegangsøkere)
  xAxisLength: number,
  pensjonsberegninger: AfpPensjonsberegning[] = [],
  isEndring: boolean
): number[] => {
  if (pensjonsberegninger.length === 0) {
    return []
  }
  const arrayLength = Math.max(
    xAxisLength,
    isEndring ? pensjonsberegninger.length + 1 : pensjonsberegninger.length + 2
  )

  const startYear = pensjonsberegninger[0].alder
  const emptyYearsBeforeStart = startYear - xAxisStartAar
  const dataArray = isEndring ? [] : new Array<number>(1).fill(0)
  const startIndex = emptyYearsBeforeStart ?? (isEndring ? 0 : 1)

  const livsvarigPensjonsbeloep =
    pensjonsberegninger[pensjonsberegninger.length - 1]?.beloep ?? 0

  for (let index = isEndring ? 0 : 1; index < arrayLength; index++) {
    if (startIndex > index) {
      dataArray.push(0)
    } else {
      const pensjonsBeregningAtIndex = pensjonsberegninger[index - startIndex]
      dataArray.push(
        pensjonsBeregningAtIndex
          ? pensjonsBeregningAtIndex.beloep
          : livsvarigPensjonsbeloep
      )
    }
  }
  return dataArray
}

// Antall maaneder i en avtale beregnes "Fra og med" og "Til og med"
export const getAntallMaanederMedPensjon = (
  year: number,
  utbetalingsperiodeStartAlder: Alder,
  utbetalingsperiodeSluttAlder?: Alder
) => {
  // Hvis vi viser første år av avtalen, tar vi høyde for startMaaned, hvis ikke teller avtalen fra måned 0 (fult år)
  const periodStartMonth =
    utbetalingsperiodeStartAlder.aar === year
      ? utbetalingsperiodeStartAlder.maaneder
      : 0

  // Hvis avtalen har en sluttdato og at vi viser siste av avtalen, tar vi høyde for sluttMaaned, hvis ikke teller avtalen til måned 11 (fult år)
  const periodEndMonth =
    utbetalingsperiodeSluttAlder && year === utbetalingsperiodeSluttAlder?.aar
      ? utbetalingsperiodeSluttAlder.maaneder
      : 11

  return periodEndMonth - periodStartMonth + 1
}

export const processPensjonsavtalerArray = (
  xAxisStartAar: number, // uttaksaar, minus 1
  xAxisLength: number,
  privatePensjonsavtaler: Pensjonsavtale[],
  offentligTpUtbetalingsperioder: UtbetalingsperiodeOffentligTP[]
): number[] => {
  const sluttAlder = xAxisStartAar + xAxisLength - 1
  const result = new Array<number>(sluttAlder - xAxisStartAar + 1).fill(0)

  const samledeUtbetalingsperioder = [
    ...privatePensjonsavtaler.flatMap((avtale) => avtale.utbetalingsperioder),
    ...offentligTpUtbetalingsperioder,
  ]

  samledeUtbetalingsperioder.forEach((utbetalingsperiode) => {
    const avtaleStartYear = Math.max(
      xAxisStartAar,
      utbetalingsperiode.startAlder.aar
    )
    const avtaleEndYear = utbetalingsperiode.sluttAlder
      ? Math.min(sluttAlder, utbetalingsperiode.sluttAlder.aar)
      : sluttAlder

    for (let year = avtaleStartYear; year <= avtaleEndYear; year++) {
      if (year >= xAxisStartAar) {
        const antallMaanederMedPensjon = getAntallMaanederMedPensjon(
          year,
          utbetalingsperiode.startAlder,
          utbetalingsperiode.sluttAlder
        )

        const allocatedAmount =
          (utbetalingsperiode.aarligUtbetaling *
            Math.max(0, antallMaanederMedPensjon)) /
          12
        result[year - xAxisStartAar] += allocatedAmount
      }
    }
  })
  return result
}

export const generateXAxis = (
  xAxisStartAar: number,
  isEndring: boolean,
  privatePensjonsavtaler: Pensjonsavtale[],
  offentligTpUtbetalingsperioder: UtbetalingsperiodeOffentligTP[],
  setIsPensjonsavtaleFlagVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let sluttAar = MAX_UTTAKSALDER
  let hasAvtaleBeforeStartAlder = false

  privatePensjonsavtaler.forEach((avtale: Pensjonsavtale) => {
    if (avtale.sluttAar && avtale.sluttAar > sluttAar) {
      sluttAar = avtale.sluttAar
    }
    if (
      !hasAvtaleBeforeStartAlder &&
      avtale.startAar &&
      avtale.startAar < xAxisStartAar
    ) {
      hasAvtaleBeforeStartAlder = true
    }
  })

  offentligTpUtbetalingsperioder.forEach(
    (utbetalingsperiode: UtbetalingsperiodeOffentligTP) => {
      if (utbetalingsperiode.startAlder.aar > sluttAar) {
        sluttAar = utbetalingsperiode.startAlder.aar
      }
      if (
        utbetalingsperiode.sluttAlder &&
        utbetalingsperiode.sluttAlder.aar > sluttAar
      ) {
        sluttAar = utbetalingsperiode.sluttAlder.aar
      }
      if (
        !hasAvtaleBeforeStartAlder &&
        utbetalingsperiode.startAlder.aar < xAxisStartAar
      ) {
        hasAvtaleBeforeStartAlder = true
      }
    }
  )

  const alderArray: string[] = []
  for (let i = xAxisStartAar; i <= sluttAar + 1; i++) {
    if (!isEndring && i === xAxisStartAar) {
      alderArray.push((i - 1).toString())
    }

    if (i === sluttAar + 1) {
      alderArray.push(`${i - 1}+`.toString())
    } else {
      alderArray.push(i.toString())
    }
  }
  setIsPensjonsavtaleFlagVisible(hasAvtaleBeforeStartAlder)
  return alderArray
}

export function getTooltipTitle(
  antallAar: string,
  hasInntekt: boolean,
  hasPensjon: boolean,
  intl: IntlShape
): string {
  if (hasInntekt && hasPensjon) {
    return `${intl.formatMessage({
      id: 'beregning.highcharts.tooltip.inntekt_og_pensjon',
    })} ${antallAar} ${intl.formatMessage({
      id: 'alder.aar',
    })}`
  } else if (hasInntekt && !hasPensjon) {
    return `${intl.formatMessage({
      id: 'beregning.highcharts.tooltip.inntekt',
    })} ${antallAar} ${intl.formatMessage({
      id: 'alder.aar',
    })}`
  } else {
    return `${intl.formatMessage({
      id: 'beregning.highcharts.tooltip.pensjon',
    })} ${antallAar} ${intl.formatMessage({
      id: 'alder.aar',
    })}`
  }
}

export const onVisFaerreAarClick = () => {
  const el = document.querySelector(highchartsScrollingSelector)
  if (el) {
    ;(el as HTMLElement).scrollLeft -= 50
  }
}

export const onVisFlereAarClick = () => {
  const el = document.querySelector(highchartsScrollingSelector)
  if (el) {
    ;(el as HTMLElement).scrollLeft += 50
  }
}

export const getHoverColor = (previousColor: string): string => {
  switch (previousColor) {
    case SERIES_COLORS.SERIE_COLOR_INNTEKT: {
      return SERIES_COLORS.SERIE_COLOR_FADED_INNTEKT
    }
    case SERIES_COLORS.SERIE_COLOR_AFP: {
      return SERIES_COLORS.SERIE_COLOR_FADED_AFP
    }
    case SERIES_COLORS.SERIE_COLOR_TP: {
      return SERIES_COLORS.SERIE_COLOR_FADED_TP
    }
    case SERIES_COLORS.SERIE_COLOR_ALDERSPENSJON: {
      return SERIES_COLORS.SERIE_COLOR_FADED_ALDERSPENSJON
    }
    default: {
      return ''
    }
  }
}

export const getNormalColor = (previousColor: string): string => {
  switch (previousColor) {
    case SERIES_COLORS.SERIE_COLOR_FADED_INNTEKT: {
      return SERIES_COLORS.SERIE_COLOR_INNTEKT
    }
    case SERIES_COLORS.SERIE_COLOR_FADED_AFP: {
      return SERIES_COLORS.SERIE_COLOR_AFP
    }
    case SERIES_COLORS.SERIE_COLOR_FADED_TP: {
      return SERIES_COLORS.SERIE_COLOR_TP
    }
    case SERIES_COLORS.SERIE_COLOR_FADED_ALDERSPENSJON: {
      return SERIES_COLORS.SERIE_COLOR_ALDERSPENSJON
    }
    default: {
      return previousColor
    }
  }
}

export function resetColumnColors(chart: Chart): void {
  if (chart.series) {
    chart.series.forEach(function (serie: Series) {
      serie.data.forEach(function (point: Point) {
        const color = getNormalColor(point.color as string)
        if (point.color !== color) {
          point.update({ color: getNormalColor(point.color as string) }, false)
        }
      })
    })
  }

  if ((chart.xAxis[0] as ExtendedAxis).labelGroup) {
    ;(chart.xAxis[0] as ExtendedAxis).labelGroup.element.childNodes.forEach(
      function (label: HTMLElement) {
        label.style.fontWeight = 'normal'
      }
    )
  }
  chart?.tooltip.update({
    enabled: false,
  })
  chart.redraw()
}

export function handleChartScroll(
  event: Event,
  args: {
    chart?: Chart
    scrollPosition?: number
  }
) {
  if (event.currentTarget) {
    const { chart, scrollPosition } = args
    const el = event.currentTarget as HighchartsScrollingHTMLDivElement
    const elementScrollPosition = el.scrollLeft
    if (chart && scrollPosition !== el.scrollLeft) {
      resetColumnColors(chart)
    }

    const isRightButtonAvailable = el.scrollWidth > el.offsetWidth

    if (elementScrollPosition === 0) {
      el.handleButtonVisibility.showRightButton(isRightButtonAvailable)
      el.handleButtonVisibility.showLeftButton(false)
    } else if (elementScrollPosition + el.offsetWidth === el.scrollWidth) {
      el.handleButtonVisibility.showRightButton(false)
      el.handleButtonVisibility.showLeftButton(true)
    } else {
      el.handleButtonVisibility.showRightButton(isRightButtonAvailable)
      el.handleButtonVisibility.showLeftButton(true)
    }
  }
}

export const navLogo = `
<svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M39.6751 -2.89721e-07H35.5126C35.5126 -2.89721e-07 35.2257 -2.70858e-07 35.1245 0.256962L32.8213 7.40063L30.5201 0.256962C30.4182 0.000632632 30.1301 0.000632651 30.1301 0.000632651H22.1275C22.0435 0.0012869 21.9631 0.0352452 21.9035 0.0952284C21.8439 0.155212 21.8099 0.236446 21.8088 0.321519V2.74747C21.8088 0.823418 19.7881 0.000632651 18.6044 0.000632651C15.9544 0.000632651 14.1806 1.76899 13.6281 4.45823C13.5981 2.67405 13.4519 2.03481 12.9775 1.38038C12.7594 1.05949 12.445 0.790506 12.1025 0.567088C11.3962 0.148101 10.7618 0.000632651 9.39996 0.000632651H7.79995C7.79995 0.000632651 7.5112 0.000632632 7.40933 0.256962L5.95369 3.91139V0.321519C5.95288 0.236778 5.91932 0.155732 5.86021 0.0957491C5.80109 0.0357666 5.72112 0.00162176 5.63744 0.000632651H1.93555C1.93555 0.000632651 1.64992 0.000632632 1.54554 0.256962L0.0330355 4.05696C0.0330355 4.05696 -0.118215 4.43671 0.226787 4.43671H1.64992V11.6772C1.64992 11.857 1.78929 12 1.96742 12H5.63619C5.67797 11.9999 5.71932 11.9915 5.75789 11.9752C5.79645 11.959 5.83147 11.9352 5.86096 11.9052C5.89044 11.8752 5.9138 11.8397 5.92972 11.8005C5.94563 11.7614 5.95377 11.7195 5.95369 11.6772V4.43671H7.38433C8.20496 4.43671 8.37808 4.45949 8.69746 4.61013C8.88996 4.68418 9.06308 4.83291 9.15808 5.00443C9.35184 5.37342 9.39996 5.81646 9.39996 7.12342V11.6772C9.39996 11.857 9.54246 12 9.71871 12H13.235C13.235 12 13.6325 12 13.7894 11.6013L14.5687 9.65C15.605 11.1209 17.3106 11.9994 19.4306 11.9994H19.8938C19.8938 11.9994 20.2938 11.9994 20.4519 11.6019L21.8094 8.1962V11.6772C21.8094 11.7628 21.843 11.8449 21.9028 11.9055C21.9625 11.966 22.0436 12 22.1282 12H25.7175C25.7175 12 26.1138 12 26.2726 11.6013C26.2726 11.6013 27.7082 7.99051 27.7138 7.96329H27.7163C27.7713 7.66266 27.3969 7.66266 27.3969 7.66266H26.1157V1.46582L30.1469 11.6019C30.3038 11.9994 30.7007 11.9994 30.7007 11.9994H34.942C34.942 11.9994 35.3407 11.9994 35.4982 11.6019L39.9676 0.38924C40.122 0.000632614 39.6745 0.000632651 39.6745 0.000632651L39.6751 -2.89721e-07ZM21.8082 7.66329H19.3969C18.9352 7.66329 18.4925 7.47758 18.1661 7.14702C17.8396 6.81646 17.6563 6.36812 17.6563 5.90063C17.6563 5.43315 17.8396 4.98481 18.1661 4.65425C18.4925 4.32368 18.9352 4.13797 19.3969 4.13797H20.0713C20.5324 4.13931 20.9743 4.32573 21.3 4.65636C21.6256 4.987 21.8086 5.4349 21.8088 5.9019L21.8082 7.66329Z" fill="#C30000"/>
</svg>
`

import Highcharts, {
  Chart,
  Point,
  PointerEventObject,
  SeriesOptionsType,
} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { useIntl } from 'react-intl'

import {
  getAlderMinus1Maaned,
  transformFoedselsdatoToAlder,
} from '@/utils/alder'
import { formatInntektToNumber } from '@/utils/inntekt'

import { SERIES_DEFAULT } from './constants'
import {
  generateXAxis,
  getChartDefaults,
  processAfpPensjonsberegningArray,
  processInntektArray,
  processPensjonsavtalerArray,
  processPensjonsberegningArray,
} from './utils'
import { getChartOptions, onPointUnclick } from './utils-highcharts'

import globalClassNames from './Simulering.module.scss'

export const useSimuleringChartLocalState = (initialValues: {
  styles: Partial<typeof globalClassNames>
  chartRef: React.RefObject<HighchartsReact.RefObject | null>
  foedselsdato?: string
  isEndring: boolean
  uttaksalder: Alder | null
  gradertUttaksperiode: GradertUttak | null
  aarligInntektFoerUttakBeloep: string
  aarligInntektVsaHelPensjon?: AarligInntektVsaPensjon
  isLoading: boolean
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  pensjonsavtaler: {
    isLoading: boolean
    data?: {
      avtaler: Pensjonsavtale[]
      partialResponse: boolean
    }
  }
  offentligTp: {
    isLoading: boolean
    data?: OffentligTp
  }
}) => {
  const {
    styles,
    chartRef,
    foedselsdato,
    isEndring,
    uttaksalder,
    gradertUttaksperiode,
    aarligInntektFoerUttakBeloep,
    aarligInntektVsaHelPensjon,
    isLoading,
    alderspensjonListe,
    afpPrivatListe,
    afpOffentligListe,
    pensjonsavtaler,
    offentligTp,
  } = initialValues

  const { isLoading: isPensjonsavtalerLoading, data: pensjonsavtalerData } =
    pensjonsavtaler
  const { isLoading: isOffentligTpLoading, data: offentligTpData } = offentligTp
  const offentligTpUtbetalingsperioder =
    offentligTpData?.simulertTjenestepensjon?.simuleringsresultat
      .utbetalingsperioder
  const intl = useIntl()
  const [xAxis, setXAxis] = React.useState<string[]>([])
  const [showVisFlereAarButton, setShowVisFlereAarButton] =
    React.useState<boolean>(false)
  const [showVisFaerreAarButton, setShowVisFaerreAarButton] =
    React.useState<boolean>(false)
  const [isPensjonsavtaleFlagVisible, setIsPensjonsavtaleFlagVisible] =
    React.useState<boolean>(false)

  const [chartOptions, setChartOptions] = React.useState<Highcharts.Options>(
    getChartOptions(
      styles,
      setShowVisFlereAarButton,
      setShowVisFaerreAarButton,
      intl
    )
  )

  React.useEffect(() => {
    /* c8 ignore next 3 */
    function onPointUnclickEventHandler(e: Event) {
      onPointUnclick(e, chartRef.current?.chart)
    }
    document.addEventListener('click', onPointUnclickEventHandler)
    return () =>
      document.removeEventListener('click', onPointUnclickEventHandler)
  }, [])

  React.useEffect(() => {
    if (chartRef.current) {
      if (isLoading || isPensjonsavtalerLoading || isOffentligTpLoading) {
        chartRef.current.chart.showLoading(
          `<div class="${styles.loader}"><div></div><div></div><div></div><div></div></div>`
        )
      } else {
        chartRef.current.chart.hideLoading()
      }
    }
  }, [isLoading, isPensjonsavtalerLoading, isOffentligTpLoading])

  // Calculates the length of the x-axis, once at first and every time uttakalder or pensjonsavtaler is updated
  React.useEffect(() => {
    const startAar =
      isEndring && foedselsdato
        ? transformFoedselsdatoToAlder(foedselsdato).aar
        : gradertUttaksperiode
          ? gradertUttaksperiode.uttaksalder.aar
          : uttaksalder?.aar

    if (startAar) {
      // recalculates temporary without pensjonsavtaler when alderspensjon is ready but not pensjonsavtaler or offentligTp
      if (!isLoading && (isPensjonsavtalerLoading || isOffentligTpLoading)) {
        setXAxis(
          generateXAxis(
            startAar,
            isEndring,
            [],
            offentligTpUtbetalingsperioder
              ? [...offentligTpUtbetalingsperioder]
              : [],

            setIsPensjonsavtaleFlagVisible
          )
        )
      }
      // recalculates correclty when alderspensjon AND pensjonsavtaler AND offentligTp are done loading
      if (!isLoading && !isPensjonsavtalerLoading && !isOffentligTpLoading) {
        setXAxis(
          generateXAxis(
            startAar,
            isEndring,
            pensjonsavtalerData?.avtaler ?? [],
            offentligTpUtbetalingsperioder
              ? [...offentligTpUtbetalingsperioder]
              : [],
            setIsPensjonsavtaleFlagVisible
          )
        )
      }
    }
  }, [
    alderspensjonListe,
    pensjonsavtalerData,
    isPensjonsavtalerLoading,
    offentligTpUtbetalingsperioder,
    isOffentligTpLoading,
  ])

  // Redraws the graph when the x-axis has changed
  React.useEffect(() => {
    const startAar =
      isEndring && foedselsdato
        ? transformFoedselsdatoToAlder(foedselsdato).aar
        : gradertUttaksperiode
          ? gradertUttaksperiode.uttaksalder.aar
          : uttaksalder?.aar
    const startMaaned = isEndring
      ? 0
      : gradertUttaksperiode
        ? gradertUttaksperiode.uttaksalder.maaneder
        : uttaksalder?.maaneder

    if (startAar && startMaaned !== undefined && alderspensjonListe) {
      setChartOptions({
        ...getChartDefaults(xAxis),
        series: [
          ...(aarligInntektFoerUttakBeloep != '0' ||
          gradertUttaksperiode?.aarligInntektVsaPensjonBeloep ||
          aarligInntektVsaHelPensjon?.beloep
            ? [
                {
                  ...SERIES_DEFAULT.SERIE_INNTEKT,
                  name: intl.formatMessage({
                    id: SERIES_DEFAULT.SERIE_INNTEKT.name,
                  }),
                  data: processInntektArray({
                    xAxisStartAar: isEndring ? startAar : startAar - 1,
                    inntektFoerUttakBeloep: formatInntektToNumber(
                      aarligInntektFoerUttakBeloep
                    ),
                    gradertUttak:
                      gradertUttaksperiode && uttaksalder
                        ? {
                            fra: gradertUttaksperiode?.uttaksalder,
                            til: getAlderMinus1Maaned(uttaksalder),
                            beloep: formatInntektToNumber(
                              gradertUttaksperiode?.aarligInntektVsaPensjonBeloep
                            ),
                          }
                        : undefined,
                    heltUttak: uttaksalder
                      ? {
                          fra: uttaksalder,
                          til: aarligInntektVsaHelPensjon?.sluttAlder
                            ? getAlderMinus1Maaned(
                                aarligInntektVsaHelPensjon?.sluttAlder
                              )
                            : undefined,
                          beloep: formatInntektToNumber(
                            aarligInntektVsaHelPensjon?.beloep
                          ),
                        }
                      : undefined,
                    xAxisLength: xAxis.length,
                  }),
                } as SeriesOptionsType,
              ]
            : []),
          ...(afpPrivatListe && afpPrivatListe.length > 0
            ? [
                {
                  ...SERIES_DEFAULT.SERIE_AFP,
                  name: intl.formatMessage({
                    id: SERIES_DEFAULT.SERIE_AFP.name,
                  }),
                  /* c8 ignore next 1 */
                  data: processAfpPensjonsberegningArray(
                    isEndring ? startAar : startAar - 1,
                    xAxis.length,
                    afpPrivatListe,
                    isEndring
                  ),
                } as SeriesOptionsType,
              ]
            : []),
          ...(afpOffentligListe && afpOffentligListe.length > 0
            ? [
                {
                  ...SERIES_DEFAULT.SERIE_AFP,
                  name: intl.formatMessage({
                    id: SERIES_DEFAULT.SERIE_AFP.name,
                  }),
                  /* c8 ignore next 1 */
                  data: processAfpPensjonsberegningArray(
                    isEndring ? startAar : startAar - 1,
                    xAxis.length,
                    afpOffentligListe,
                    isEndring
                  ),
                } as SeriesOptionsType,
              ]
            : []),
          ...((pensjonsavtalerData &&
            pensjonsavtalerData?.avtaler.length > 0) ||
          (offentligTpData?.simulertTjenestepensjon?.simuleringsresultat
            .utbetalingsperioder &&
            offentligTpData.simulertTjenestepensjon.simuleringsresultat
              .utbetalingsperioder?.length > 0)
            ? [
                {
                  ...SERIES_DEFAULT.SERIE_TP,
                  name: intl.formatMessage({
                    id: SERIES_DEFAULT.SERIE_TP.name,
                  }),
                  /* c8 ignore next 1 */
                  data: processPensjonsavtalerArray(
                    isEndring ? startAar : startAar - 1,
                    xAxis.length,
                    pensjonsavtalerData?.avtaler ?? [],
                    offentligTpData?.simulertTjenestepensjon
                      ?.simuleringsresultat.utbetalingsperioder ?? []
                  ),
                } as SeriesOptionsType,
              ]
            : []),
          {
            ...SERIES_DEFAULT.SERIE_ALDERSPENSJON,
            name: intl.formatMessage({
              id: SERIES_DEFAULT.SERIE_ALDERSPENSJON.name,
            }),
            data: processPensjonsberegningArray(
              alderspensjonListe,
              isEndring,
              xAxis.length
            ),
          } as SeriesOptionsType,
        ],
      })
    }
  }, [xAxis])

  return [
    chartOptions,
    showVisFaerreAarButton,
    showVisFlereAarButton,
    isPensjonsavtaleFlagVisible,
  ] as const
}

// Denne pluginen er nødvendig etter oppgradering av Highcharts til v12 pga. regression bug
// Den kan fjernes når Highcharts har løst bug'en. Saken kan følges opp her: https://github.com/highcharts/highcharts/issues/22489
export const useHighchartsRegressionPlugin = () => {
  React.useEffect(() => {
    type DataLabel = {
      div: { point: ExtendedPoint }
      element: { point: ExtendedPoint }
    }
    type ExtendedPoint = Point & {
      dataLabels: DataLabel[]
      dataLabel: DataLabel
    }
    type ExtendedChart = Chart & {
      scrollablePlotArea?: {
        scrollingContainer: {
          offsetWidth: number
        }
      }
      options: {
        chart: {
          scrollablePlotArea: {
            minWidth: number
          }
        }
      }
      pointer: {
        isDirectTouch: boolean
        getPointFromEvent: (e: PointerEventObject) => ExtendedPoint | undefined
        onTrackerMouseOut: (e: MouseEvent) => void
      }
      isInsidePlot: (
        chartX: number,
        chartY: number,
        options?: { visiblePlotOnly: boolean }
      ) => boolean
    }

    type Series = {
      _hasTracking: boolean
      trackerGroups: string[]
      points: ExtendedPoint[]
      options: {
        enableMouseTracking: boolean
        cursor?: string
      }
      chart: ExtendedChart
    }

    type Column = {
      prototype: Series & {
        drawTracker: (points?: ExtendedPoint[]) => void
      }
    }

    type ExtendedHighchartsType = typeof Highcharts & {
      seriesTypes?: {
        line: () => void
        area: () => void
        spline: () => void
        areaspline: () => void
        column: Column
      }
    }
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    ;(function (H: ExtendedHighchartsType) {
      const { isArray, fireEvent, seriesTypes } = H

      if (seriesTypes) {
        seriesTypes.column.prototype.drawTracker = function (this: Series) {
          /* eslint-disable-next-line @typescript-eslint/no-this-alias */
          const series = this
          const { points, chart } = series
          const pointer = chart.pointer
          const onMouseOver = function (e: PointerEventObject) {
            pointer?.normalize(e)

            const point = pointer?.getPointFromEvent(e),
              // Run point events only for points inside plot area, #21136
              isInsidePlot =
                chart.scrollablePlotArea &&
                chart.scrollablePlotArea.scrollingContainer.offsetWidth <
                  chart.options.chart.scrollablePlotArea.minWidth
                  ? chart.isInsidePlot(
                      e.chartX - chart.plotLeft,
                      e.chartY - chart.plotTop,
                      {
                        visiblePlotOnly: true,
                      }
                    )
                  : true
            // Undefined on graph in scatterchart
            if (
              pointer &&
              point &&
              series.options.enableMouseTracking &&
              isInsidePlot
            ) {
              pointer.isDirectTouch = true
              point.onMouseOver(e)
            }
          }

          let dataLabels: DataLabel[]
          // Add reference to the point
          points.forEach(function (point: ExtendedPoint) {
            dataLabels = isArray(point.dataLabels)
              ? point.dataLabels
              : point.dataLabel
                ? [point.dataLabel]
                : []
            if (point.graphic) {
              // @ts-expect-error
              point.graphic.element.point = point
            }
            dataLabels.forEach(function (dataLabel) {
              ;(dataLabel.div || dataLabel.element).point = point
            })
          })
          // Add the event listeners, we need to do this only once
          if (!series._hasTracking) {
            series.trackerGroups.forEach(function (key) {
              // @ts-expect-error
              if (series[key]) {
                // We don't always have dataLabelsGroup
                // @ts-expect-error
                series[key]
                  .addClass('highcharts-tracker')
                  .on('mouseover', onMouseOver)
                  .on('mouseout', function (e: MouseEvent) {
                    pointer?.onTrackerMouseOut(e)
                  })
                  .on('touchstart', onMouseOver)
                if (!chart.styledMode && series.options.cursor) {
                  // @ts-expect-error
                  series[key].css({ cursor: series.options.cursor })
                }
              }
            })
            series._hasTracking = true
          }
          fireEvent(this, 'afterDrawTracker')
        }
      }
    })(Highcharts)
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  }, [])
}

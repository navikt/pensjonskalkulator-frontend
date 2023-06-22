import React from 'react'

import {
  Axis,
  AxisLabelsFormatterContextObject,
  Options,
  Point,
  SeriesColumnOptions,
  TooltipFormatterContextObject,
} from 'highcharts'

import { formatAsDecimal } from '@/utils/currency'

import globalClassNames from '*.module.scss'

export const highchartsScrollingSelector = '.highcharts-scrolling'
export const COLUMN_WIDTH = 25
const TOOLTIP_YPOS = 35

export function labelFormatter(this: AxisLabelsFormatterContextObject) {
  return this.value > 1000
    ? ((this.value as number) / 1000).toString()
    : this.value.toString()
}

export type ExtendedYAxis = Axis & { height: number; pos: number }
export type ExtendedPoint = Point & { tooltipPos: number[] }

export function tooltipFormatter(
  context: TooltipFormatterContextObject,
  styles: Partial<typeof globalClassNames>
): string {
  const yAxisHeight = (context.points?.[0].series.yAxis as ExtendedYAxis).height
  const lineYpos =
    (context.points?.[0].series.chart.yAxis[0] as ExtendedYAxis).pos -
    TOOLTIP_YPOS
  const columnHeight =
    yAxisHeight - (context.points?.[0].point as ExtendedPoint).tooltipPos[1]
  const scrollPosition =
    document.querySelector(highchartsScrollingSelector)?.scrollLeft ?? 0

  const leftPosition = context.points?.[0].point?.plotX ?? 0
  const tooltipConnectingLine = `<div class="${
    styles.tooltipLine
  }" style="top: ${lineYpos}px; left: ${
    leftPosition + 21 - scrollPosition + COLUMN_WIDTH / 2
  }px; height: ${yAxisHeight - columnHeight}px"></div>`

  const headerFormat =
    `<table class="${styles.tooltipTable}"><thead><tr>` +
    `<th class="${styles.tooltipTableHeaderCell} ${styles.tooltipTableHeaderCell__left}">Pensjon og inntekt det året du er ${context.x} år</th>` +
    `<th class="${styles.tooltipTableHeaderCell} ${
      styles.tooltipTableHeaderCell__right
    }">${formatAsDecimal(context.points?.[0].total)} kr</th>` +
    `</tr></thead><tbody>`

  let pointsFormat = ''
  context?.points?.forEach(function (point) {
    pointsFormat +=
      `<tr>` +
      `<td class="${styles.tooltipTableCell}"><span class="${styles.tooltipTableCellDot}" style="background-color:${point.series.color}"></span>${point.series.name}</td>` +
      `<td class="${styles.tooltipTableCell} ${
        styles.tooltipTableCell__right
      }">${formatAsDecimal(point.y)} kr</td>` +
      `</tr>`
  })

  const footerFormat = '</tbody></table>'
  return `${headerFormat}${pointsFormat}${footerFormat}${tooltipConnectingLine}`
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

type HighchartsScrollingHTMLDivElement = HTMLDivElement & {
  handleButtonVisibility: {
    showRightButton: React.Dispatch<React.SetStateAction<boolean>>
    showLeftButton: React.Dispatch<React.SetStateAction<boolean>>
  }
}

export function handleChartScroll(event: Event) {
  if (event.currentTarget) {
    const el = event.currentTarget as HighchartsScrollingHTMLDivElement
    const elementScrollPosition = el.scrollLeft

    if (elementScrollPosition === 0) {
      el.handleButtonVisibility.showRightButton(true)
      el.handleButtonVisibility.showLeftButton(false)
    } else if (elementScrollPosition + el.offsetWidth === el.scrollWidth) {
      el.handleButtonVisibility.showRightButton(false)
      el.handleButtonVisibility.showLeftButton(true)
    } else {
      el.handleButtonVisibility.showRightButton(true)
      el.handleButtonVisibility.showLeftButton(true)
    }
  }
}

export const getChartOptions = (
  styles: Partial<typeof globalClassNames>,
  showRightButton: React.Dispatch<React.SetStateAction<boolean>>,
  showLeftButton: React.Dispatch<React.SetStateAction<boolean>>
): Options => {
  return {
    chart: {
      type: 'column',
      spacingTop: 0,
      spacingLeft: 0,
      spacingRight: 25,
      scrollablePlotArea: {
        minWidth: 750,
        scrollPositionX: 0,
      },
      events: {
        render() {
          const highchartsScrollingElement = document.querySelector(
            highchartsScrollingSelector
          )

          if (highchartsScrollingElement) {
            const el =
              highchartsScrollingElement as HighchartsScrollingHTMLDivElement
            // Denne setTimeout er nødvendig fordi highcharts tegner scroll container litt etter render callback og har ikke noe eget flag for den
            setTimeout(() => {
              const elementScrollWidth = el.scrollWidth
              const elementWidth = el.offsetWidth
              showRightButton(elementScrollWidth > elementWidth)

              el.addEventListener('scroll', handleChartScroll, false)
              el.handleButtonVisibility = {
                showRightButton,
                showLeftButton,
              }
            }, 0)
          } else {
            showRightButton(false)
            showLeftButton(false)
          }
        },
      },
    },
    title: {
      text: `Beregning`,
      align: 'left',
      margin: 40,
      y: 20,
      style: {
        fontFamily: 'var(--a-font-family)',
        fontWeight: 'bold',
        fontSize: '20px',
      },
    },
    xAxis: {
      categories: [],
    },
    yAxis: {
      gridLineDashStyle: 'Dash',
      minorTickInterval: 200000,
      tickInterval: 200000,
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Tusen kroner',
        align: 'high',
        offset: -55,
        rotation: 0,
        x: -12,
        y: -20,
      },
      labels: {
        formatter: labelFormatter,
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      className: styles.tooltip,
      /* c8 ignore next 3 */
      formatter: function (this: TooltipFormatterContextObject) {
        return tooltipFormatter(this, styles)
      },
      outside: true,
      shadow: false,
      shared: true,
      padding: 0,
      /* c8 ignore next 3 */
      positioner: function () {
        return { x: 0, y: TOOLTIP_YPOS }
      },
    },
    legend: {
      useHTML: true,
      x: 0,
      y: -25,
      padding: 0,
      margin: 50,
      layout: 'horizontal',
      align: 'left',
      verticalAlign: 'top',
      itemDistance: 0,
      itemStyle: {
        fontFamily: 'var(--a-font-family)',
        color: '#000000',
        fontWeight: 'regular',
        fontSize: '14px',
        cursor: 'default',
        zIndex: 0,
      },
      itemHoverStyle: { color: '#000000' },
      itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        states: {
          inactive: {
            enabled: false,
          },
        },
        events: {
          /* c8 ignore next 3 */
          legendItemClick: function (e) {
            e.preventDefault()
          },
        },
      },
    },
    series: [],
  }
}

export const removeHandleChartScrollEventListener = () => {
  const el = document.querySelector(highchartsScrollingSelector)
  el?.removeEventListener('scroll', handleChartScroll)
}

export const getAlderspensjonColumnOptions = (
  data: SeriesColumnOptions['data']
): SeriesColumnOptions => ({
  type: 'column',
  pointWidth: COLUMN_WIDTH,
  name: 'Alderspensjon (NAV)',
  color: 'var(--a-deepblue-500)',
  states: {
    hover: {
      color: 'var(--a-deepblue-200)',
    },
  },
  data,
})

export const getAfpSeriesData = (
  data: SeriesColumnOptions['data']
): SeriesColumnOptions => ({
  type: 'column',
  pointWidth: COLUMN_WIDTH,
  name: 'Avtalefestet pensjon (AFP)',
  color: 'var(--a-purple-400)',
  states: {
    hover: {
      color: 'var(--a-purple-200)',
    },
  },
  data,
})

export const getInntektSeriesData = (
  data: SeriesColumnOptions['data']
): SeriesColumnOptions => ({
  type: 'column',
  pointWidth: COLUMN_WIDTH,
  name: 'Inntekt (lønn m.m.)',
  color: '#868F9C',
  data,
})

export const getPensjonsavtalerSeriesData = (
  data: SeriesColumnOptions['data']
): SeriesColumnOptions => ({
  type: 'column',
  pointWidth: COLUMN_WIDTH,
  name: 'Pensjonsavtaler (arbeidsgiver)',
  color: 'var(--a-green-400)',
  states: {
    hover: {
      color: 'var(--a-green-200)',
    },
  },
  data,
})

export const hasSeriesData = (data: SeriesColumnOptions['data']) => {
  return data?.some((it) => typeof it === 'number' && it > 0)
}

export const isSeriesColumnOptions = (
  options: any
): options is SeriesColumnOptions => {
  return (
    options?.type === 'column' &&
    Array.isArray(options.data) &&
    options.data.length > 0
  )
}

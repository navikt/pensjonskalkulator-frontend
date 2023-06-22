import {
  AxisLabelsFormatterContextObject,
  TooltipFormatterContextObject,
} from 'highcharts'
import { describe, expect, it, vi } from 'vitest'

import {
  ExtendedPoint,
  ExtendedYAxis,
  getChartOptions,
  handleChartScroll,
  highchartsScrollingSelector,
  labelFormatter,
  onVisFaerreAarClick,
  onVisFlereAarClick,
  removeHandleChartScrollEventListener,
  tooltipFormatter,
} from '@/components/Grafvisning/utils'

import globalClassNames from '*.module.scss'

describe('Grafvisning-utils', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  describe('labelFormatter', () => {
    it('returnerer riktig streng når verdien er under 1000', () => {
      const thisIsThat = {
        value: 300,
      } as AxisLabelsFormatterContextObject
      const a = labelFormatter.bind(thisIsThat)
      expect(a()).toBe('300')
    })
    it('returnerer riktig streng når verdien er lik 1000', () => {
      const thisIsThat = {
        value: 1000,
      } as AxisLabelsFormatterContextObject
      const a = labelFormatter.bind(thisIsThat)
      expect(a()).toBe('1000')
    })
    it('returnerer riktig streng når verdien er over 1000', () => {
      const thisIsThat = {
        value: 1000000,
      } as AxisLabelsFormatterContextObject
      const a = labelFormatter.bind(thisIsThat)
      expect(a()).toBe('1000')
    })
  })

  describe('tooltipFormatter', () => {
    it('returnerer formatert tooltip med riktig data og stiler for begge serier', () => {
      const stylesMock = {
        tooltipLine: 'tooltipLine',
        tooltipTable: 'tooltipTable',
        tooltipTableHeaderCell: 'tooltipTableHeaderCell',
        tooltipTableHeaderCell__left: 'tooltipTableHeaderCell__left',
        tooltipTableHeaderCell__right: 'tooltipTableHeaderCell__right',
        tooltipTableCell: 'tooltipTableCell',
        tooltipTableCell__right: 'tooltipTableCell__right',
        tooltipTableCellDot: 'tooltipTableCellDot',
      } as Partial<typeof globalClassNames>

      const alder = 65
      const total = 800000
      const nameSerie1 = 'name of my serie 1'
      const nameSerie2 = 'name of my serie 2'
      const colorSerie1 = 'lime'
      const colorSerie2 = 'salmon'
      const pointSumSerie1 = 200000
      const pointSumSerie2 = 350000
      const beregnetLinePosition = 'top: 265px; left: 162.5px; height: 100px'
      const beregnetLinePositionAfterScroll =
        'top: 265px; left: 112.5px; height: 100px'

      const point = {
        y: pointSumSerie1,
        total,
        series: {
          name: nameSerie1,
          color: colorSerie1,
          chart: { yAxis: [{ pos: 300 } as ExtendedYAxis] },
          yAxis: { height: 400 } as ExtendedYAxis,
        },
        point: { plotX: 129, tooltipPos: [50, 100, 120] } as ExtendedPoint,
      }

      const context = {
        x: alder,
        points: [
          {
            ...point,
          },
          {
            ...point,
            y: pointSumSerie2,
            series: {
              ...point.series,
              name: nameSerie2,
              color: colorSerie2,
            },
          },
        ],
      }
      const tooltipMarkup = tooltipFormatter(
        context as unknown as TooltipFormatterContextObject,
        stylesMock
      )
      expect(tooltipMarkup).toContain(`800 000 kr`)
      expect(tooltipMarkup).toContain(
        `Pensjon og inntekt det året du er ${alder} år`
      )
      expect(tooltipMarkup).toContain(nameSerie1)
      expect(tooltipMarkup).toContain(nameSerie2)
      expect(tooltipMarkup).toContain(`background-color:${colorSerie1}`)
      expect(tooltipMarkup).toContain(`background-color:${colorSerie2}`)
      expect(tooltipMarkup).toContain(`200 000 kr`)
      expect(tooltipMarkup).toContain(`350 000 kr`)
      expect(tooltipMarkup).toContain(beregnetLinePosition)
      expect(tooltipMarkup).toMatchSnapshot()

      const div = document.createElement('div')
      div.innerHTML = '<div class="highcharts-scrolling">SPAN</div>'
      document.body.appendChild(div)

      onVisFlereAarClick()

      const tooltipMarkupAfterScroll = tooltipFormatter(
        context as unknown as TooltipFormatterContextObject,
        stylesMock
      )
      expect(tooltipMarkupAfterScroll).toContain(
        beregnetLinePositionAfterScroll
      )
    })
  })
  describe('getChartOptions', () => {
    it('returnerer riktig default options', () => {
      const options = getChartOptions(
        {} as Partial<typeof globalClassNames>,
        vi.fn(),
        vi.fn()
      )
      expect(options).toMatchSnapshot()
    })
  })

  describe('onVisFlereAarClick og onVisFaerreAarClick', () => {
    it('finner riktig element og øker scrollLeft', () => {
      const div = document.createElement('div')
      div.innerHTML = '<div class="highcharts-scrolling">SPAN</div>'
      document.body.appendChild(div)
      expect(div.scrollLeft).toBe(0)
      onVisFlereAarClick()
      expect(
        (document.querySelector(highchartsScrollingSelector) as HTMLElement)
          .scrollLeft
      ).toBe(50)
      onVisFlereAarClick()
      expect(
        (document.querySelector(highchartsScrollingSelector) as HTMLElement)
          .scrollLeft
      ).toBe(100)
      onVisFaerreAarClick()
      expect(
        (document.querySelector(highchartsScrollingSelector) as HTMLElement)
          .scrollLeft
      ).toBe(50)
      onVisFaerreAarClick()
      expect(
        (document.querySelector(highchartsScrollingSelector) as HTMLElement)
          .scrollLeft
      ).toBe(0)
    })
  })

  describe('handleChartScroll', () => {
    it('Viser Vis flere år knapp og skjuler Vis færre år knapp når graffens scroll posisjon er på 0', () => {
      const showRightButtonMock = vi.fn()
      const showLeftButtonMock = vi.fn()

      const mockedEvent = {
        currentTarget: {
          scrollLeft: 0,
          handleButtonVisibility: {
            showRightButton: showRightButtonMock,
            showLeftButton: showLeftButtonMock,
          },
        },
      }
      handleChartScroll(mockedEvent as unknown as Event)
      expect(showRightButtonMock).toHaveBeenCalledWith(true)
      expect(showLeftButtonMock).toHaveBeenCalledWith(false)
    })

    it('Skjuler Vis flere år knapp og viser Vis færre år knapp når graffens scroll posisjon er på maks', () => {
      const showRightButtonMock = vi.fn()
      const showLeftButtonMock = vi.fn()

      const mockedEvent = {
        currentTarget: {
          scrollLeft: 50,
          offsetWidth: 450,
          scrollWidth: 500,
          handleButtonVisibility: {
            showRightButton: showRightButtonMock,
            showLeftButton: showLeftButtonMock,
          },
        },
      }
      handleChartScroll(mockedEvent as unknown as Event)
      expect(showRightButtonMock).toHaveBeenCalledWith(false)
      expect(showLeftButtonMock).toHaveBeenCalledWith(true)
    })

    it('Viser både  Vis flere år knapp og Vis færre år knapp når graffens scroll posisjon er et sted i midten', () => {
      const showRightButtonMock = vi.fn()
      const showLeftButtonMock = vi.fn()

      const mockedEvent = {
        currentTarget: {
          scrollLeft: 50,
          offsetWidth: 100,
          scrollWidth: 500,
          handleButtonVisibility: {
            showRightButton: showRightButtonMock,
            showLeftButton: showLeftButtonMock,
          },
        },
      }
      handleChartScroll(mockedEvent as unknown as Event)
      expect(showRightButtonMock).toHaveBeenCalledWith(true)
      expect(showLeftButtonMock).toHaveBeenCalledWith(true)
    })
  })

  describe('removeHandleChartScrollEventListener', () => {
    it('Fjerner listener når elementet finnes i dom1en', () => {
      const fnMock = vi.fn()
      const div = document.createElement('div')
      div.innerHTML = '<div class="highcharts-scrolling">SPAN</div>'
      document.body.appendChild(div)
      const el = document.querySelector('.highcharts-scrolling')
      ;(el as Element).removeEventListener = fnMock
      removeHandleChartScrollEventListener()
      expect(fnMock).toHaveBeenCalled()
    })
  })
})

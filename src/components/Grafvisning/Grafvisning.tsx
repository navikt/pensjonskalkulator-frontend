import React, { useEffect, useState } from 'react'

import { ChevronLeftCircle, ChevronRightCircle } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import {
  COLUMN_WIDTH,
  getAfpSeriesData,
  getAlderspensjonColumnOptions,
  getChartOptions,
  getInntektSeriesData,
  getPensjonsavtalerSeriesData,
  hasSeriesData,
  isSeriesColumnOptions,
  onVisFaerreAarClick,
  onVisFlereAarClick,
  removeHandleChartScrollEventListener,
} from './utils'

import styles from './Grafvisning.module.scss'
import clsx from 'clsx'

interface Props {
  aldere: string[]
  data: {
    alderspensjon: number[]
    afpPrivat: number[]
    inntekt: number[]
    pensjonsavtaler: number[]
  }
}

export const Grafvisning: React.FC<Props> = ({
  aldere,
  data: { alderspensjon, afpPrivat, inntekt, pensjonsavtaler },
}) => {
  const [showVisFlereAarButton, setShowVisFlereAarButton] = useState(false)
  const [showVisFaerreAarButton, setShowVisFaerreAarButton] = useState(false)

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(
    getChartOptions(styles, setShowVisFlereAarButton, setShowVisFaerreAarButton)
  )

  useEffect(() => {
    return removeHandleChartScrollEventListener
  }, [])

  useEffect(() => {
    setChartOptions({
      chart: {
        type: 'column',
        scrollablePlotArea: {
          minWidth: aldere.length * COLUMN_WIDTH * 1.6,
          scrollPositionX: 0,
        },
      },
      xAxis: {
        categories: aldere,
      },
      series: [
        hasSeriesData(inntekt) && getInntektSeriesData(inntekt),
        hasSeriesData(afpPrivat) && getAfpSeriesData(afpPrivat),
        hasSeriesData(alderspensjon) &&
          getAlderspensjonColumnOptions(alderspensjon),
        hasSeriesData(pensjonsavtaler) &&
          getPensjonsavtalerSeriesData(pensjonsavtaler),
      ].filter(isSeriesColumnOptions),
    })
  }, [alderspensjon, afpPrivat, inntekt, aldere])

  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div className={styles.buttons}>
        <div className={clsx(!showVisFaerreAarButton && styles.hidden)}>
          <Button
            icon={<ChevronLeftCircle aria-hidden />}
            iconPosition="left"
            size="xsmall"
            variant="tertiary"
            onClick={onVisFaerreAarClick}
          >
            Vis færre år
          </Button>
        </div>
        <div
          className={clsx(
            styles.rightAligned,
            !showVisFlereAarButton && styles.hidden
          )}
        >
          <Button
            icon={<ChevronRightCircle aria-hidden />}
            iconPosition="right"
            size="xsmall"
            variant="tertiary"
            onClick={onVisFlereAarClick}
          >
            Vis flere år
          </Button>
        </div>
      </div>
    </section>
  )
}

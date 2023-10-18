export const MAX_UTTAKSALDER = 77
export const COLUMN_WIDTH = 25
export const TOOLTIP_YPOS = 35

export const SERIES_COLORS = {
  SERIE_COLOR_INNTEKT: 'var(--a-gray-500)',
  SERIE_COLOR_AFP: 'var(--a-purple-400)',
  SERIE_COLOR_TP: 'var(--a-green-400)',
  SERIE_COLOR_ALDERSPENSJON: 'var(--a-deepblue-500)',
  SERIE_COLOR_FADED_INNTEKT: 'var(--a-gray-300)',
  SERIE_COLOR_FADED_AFP: 'var(--a-purple-200)',
  SERIE_COLOR_FADED_TP: 'var(--a-green-200)',
  SERIE_COLOR_FADED_ALDERSPENSJON: 'var(--a-deepblue-200)',
}

export const SERIES_DEFAULT = {
  SERIE_INNTEKT: {
    type: 'column',
    pointWidth: COLUMN_WIDTH,
    name: 'Pensjonsgivende inntekt',
    color: SERIES_COLORS.SERIE_COLOR_INNTEKT,
  },
  SERIE_TP: {
    type: 'column',
    pointWidth: COLUMN_WIDTH,
    name: 'Pensjonsavtaler (arbeidsgivere m.m.)',
    color: SERIES_COLORS.SERIE_COLOR_TP,
  },
  SERIE_AFP: {
    type: 'column',
    pointWidth: COLUMN_WIDTH,
    name: 'AFP (Avtalefestet pensjon)',
    color: SERIES_COLORS.SERIE_COLOR_AFP,
  },
  SERIE_ALDERSPENSJON: {
    type: 'column',
    pointWidth: COLUMN_WIDTH,
    name: 'Alderspensjon (NAV)',
    color: SERIES_COLORS.SERIE_COLOR_ALDERSPENSJON,
  },
}

export const highchartsScrollingSelector = '.highcharts-scrolling'

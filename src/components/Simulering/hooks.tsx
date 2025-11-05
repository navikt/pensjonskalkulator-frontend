import Highcharts, { SeriesOptionsType } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  useAlderspensjonQuery,
  useGetPersonQuery,
  useOffentligTpFoer1963Query,
  useOffentligTpQuery,
} from '@/state/api/apiSlice'
import { isOffentligTpFoer1963 } from '@/state/api/typeguards'
import {
  generateAlderspensjonRequestBody,
  generateOffentligTpFoer1963RequestBody,
  generateOffentligTpRequestBody,
} from '@/state/api/utils'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloep,
  selectAfp,
  selectAfpInntektMaanedFoerUttak,
  selectCurrentSimulation,
  selectEpsHarInntektOver2G,
  selectEpsHarPensjon,
  selectErApoteker,
  selectFoedselsdato,
  selectLoependeVedtak,
  selectSamtykke,
  selectSamtykkeOffentligAFP,
  selectSivilstand,
  selectSkalBeregneAfpKap19,
  selectUtenlandsperioder,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import {
  getAlderMinus1Maaned,
  isAlderLikEllerOverAnnenAlder,
  isAlderOver,
  transformFoedselsdatoToAlder,
} from '@/utils/alder'
import { formatInntektToNumber } from '@/utils/inntekt'

import { finnAllePensjonsavtalerVedUttak } from './MaanedsbeloepAvansertBeregning/utils'
import { SERIES_DEFAULT } from './constants'
import {
  generateXAxis,
  getChartDefaults,
  processAfpPensjonsberegningArray,
  processInntektArray,
  processPensjonsavtalerArray,
  processPensjonsberegningArray,
  processPensjonsberegningArrayForKap19,
  processPre2025OffentligAfpPensjonsberegningArray,
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
  pre2025OffentligAfp?: AfpEtterfulgtAvAlderspensjon
  afpPrivatListe?: AfpPensjonsberegning[]
  afpOffentligListe?: AfpPensjonsberegning[]
  pensjonsavtaler: {
    isLoading: boolean
    data?: {
      avtaler: Pensjonsavtale[]
      partialResponse: boolean
    }
  }
  offentligTp: {
    isLoading: boolean
    data?: OffentligTp | OffentligTpFoer1963
  }
}) => {
  const dispatch = useAppDispatch()
  const xAxis = useAppSelector((state) => state.userInput.xAxis)
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
    pre2025OffentligAfp,
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

  const [showVisFlereAarButton, setShowVisFlereAarButton] =
    React.useState<boolean>(false)
  const [showVisFaerreAarButton, setShowVisFaerreAarButton] =
    React.useState<boolean>(false)
  const [isPensjonsavtaleFlagVisible, setIsPensjonsavtaleFlagVisible] =
    React.useState<boolean>(false)

  const pre2025OffentligAfpListe: AfpPensjonsberegning[] = pre2025OffentligAfp
    ? Array.from(
        Array(67 - pre2025OffentligAfp.alderAar).keys(),
        (_, index) => ({
          alder: pre2025OffentligAfp.alderAar + index,
          beloep:
            index === 0
              ? pre2025OffentligAfp.totaltAfpBeloep *
                (12 - (uttaksalder?.maaneder ?? 0))
              : pre2025OffentligAfp.totaltAfpBeloep * 12,
        })
      )
    : []

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

  // Update the useEffect that calculates x-axis length
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
        const newXAxis = generateXAxis(
          startAar,
          isEndring,
          [],
          offentligTpUtbetalingsperioder
            ? [...offentligTpUtbetalingsperioder]
            : [],
          setIsPensjonsavtaleFlagVisible
        )
        dispatch(userInputActions.setXAxis(newXAxis))
      }
      // recalculates correctly when alderspensjon AND pensjonsavtaler AND offentligTp are done loading
      if (!isLoading && !isPensjonsavtalerLoading && !isOffentligTpLoading) {
        const newXAxis = generateXAxis(
          startAar,
          isEndring,
          pensjonsavtalerData?.avtaler ?? [],
          offentligTpUtbetalingsperioder
            ? [...offentligTpUtbetalingsperioder]
            : [],
          setIsPensjonsavtaleFlagVisible
        )
        dispatch(userInputActions.setXAxis(newXAxis))
      }
    }
  }, [
    alderspensjonListe,
    pensjonsavtalerData,
    isPensjonsavtalerLoading,
    offentligTpUtbetalingsperioder,
    isOffentligTpLoading,
  ])

  // Maintain x-axis values during loading states
  React.useEffect(() => {
    if (
      (isLoading || isPensjonsavtalerLoading || isOffentligTpLoading) &&
      xAxis.length > 0
    ) {
      dispatch(userInputActions.setXAxis(xAxis))
    }
  }, [isLoading, isPensjonsavtalerLoading, isOffentligTpLoading])

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
                            til:
                              // Vis inntekt ved siden av pre2025 offentlig AFP frem til 67
                              pre2025OffentligAfp &&
                              gradertUttaksperiode.aarligInntektVsaPensjonBeloep
                                ? getAlderMinus1Maaned({ aar: 67, maaneder: 0 })
                                : getAlderMinus1Maaned(uttaksalder),
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

          ...(pre2025OffentligAfp
            ? [
                {
                  ...SERIES_DEFAULT.SERIE_AFP,
                  name: intl.formatMessage({
                    id: SERIES_DEFAULT.SERIE_AFP.name,
                  }),
                  /* c8 ignore next 1 */
                  data: processPre2025OffentligAfpPensjonsberegningArray(
                    pre2025OffentligAfpListe.length - 1,
                    pre2025OffentligAfpListe,
                    isEndring
                  ),
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
            data: pre2025OffentligAfpListe
              ? processPensjonsberegningArrayForKap19(
                  alderspensjonListe,
                  isEndring,
                  xAxis.length,
                  startAar
                )
              : processPensjonsberegningArray(
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

export const useOffentligTpData = () => {
  const harSamtykket = useAppSelector(selectSamtykke)
  const harSamtykketOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const afp = useAppSelector(selectAfp)
  const sivilstand = useAppSelector(selectSivilstand)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const epsHarInntektOver2G = useAppSelector(selectEpsHarInntektOver2G)
  const epsHarPensjon = useAppSelector(selectEpsHarPensjon)
  const erApoteker = useAppSelector(selectErApoteker)
  const utenlandsperioder = useAppSelector(selectUtenlandsperioder)
  const aarligInntektFoerUttakBeloep = useAppSelector(
    selectAarligInntektFoerUttakBeloep
  )
  const {
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    beregningsvalg,
  } = useAppSelector(selectCurrentSimulation)
  const skalBeregneAfpKap19 = useAppSelector(selectSkalBeregneAfpKap19)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const afpInntektMaanedFoerUttak = useAppSelector(
    selectAfpInntektMaanedFoerUttak
  )
  const { data: person } = useGetPersonQuery()

  const [offentligTpRequestBody, setOffentligTpRequestBody] = useState<
    OffentligTpRequestBody | undefined
  >(undefined)

  const [offentligTpFoer1963RequestBody, setOffentligTpFoer1963RequestBody] =
    useState<OffentligTpFoer1963RequestBody | undefined>(undefined)

  const alderspensjonRequestBody: AlderspensjonRequestBody | undefined =
    useMemo(() => {
      if (uttaksalder) {
        return generateAlderspensjonRequestBody({
          loependeVedtak,
          afp: afp === 'ja_offentlig' && !harSamtykketOffentligAFP ? null : afp,
          skalBeregneAfpKap19: skalBeregneAfpKap19,
          sivilstand: sivilstand,
          epsHarPensjon: epsHarPensjon,
          epsHarInntektOver2G: epsHarInntektOver2G,
          foedselsdato: person?.foedselsdato,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode,
          heltUttak: uttaksalder && {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          utenlandsperioder,
          beregningsvalg,
          afpInntektMaanedFoerUttak: afpInntektMaanedFoerUttak,
        })
      }
    }, [
      afp,
      harSamtykketOffentligAFP,
      person,
      aarligInntektFoerUttakBeloep,
      sivilstand,
      uttaksalder,
      epsHarPensjon,
      epsHarInntektOver2G,
      gradertUttaksperiode,
      aarligInntektVsaHelPensjon,
      utenlandsperioder,
      beregningsvalg,
      skalBeregneAfpKap19,
      loependeVedtak,
      afpInntektMaanedFoerUttak,
    ])

  const alderspensjonQuery = useAlderspensjonQuery(
    alderspensjonRequestBody as AlderspensjonRequestBody,
    { skip: !alderspensjonRequestBody }
  )

  const offentligTpFoer1963Query = useOffentligTpFoer1963Query(
    offentligTpFoer1963RequestBody as OffentligTpFoer1963RequestBody,
    {
      skip:
        !skalBeregneAfpKap19 ||
        !offentligTpFoer1963RequestBody ||
        !harSamtykket ||
        !uttaksalder,
    }
  )

  const offentligTpQuery = useOffentligTpQuery(
    offentligTpRequestBody as OffentligTpRequestBody,
    {
      skip:
        skalBeregneAfpKap19 ||
        !offentligTpRequestBody ||
        !harSamtykket ||
        !uttaksalder,
    }
  )

  useEffect(() => {
    if (harSamtykket && uttaksalder) {
      if (skalBeregneAfpKap19) {
        const requestBody = generateOffentligTpFoer1963RequestBody({
          foedselsdato,
          sivilstand,
          epsHarInntektOver2G,
          epsHarPensjon,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          utenlandsperioder,
        })
        setOffentligTpFoer1963RequestBody(requestBody)
      } else {
        const requestBody = generateOffentligTpRequestBody({
          afp,
          foedselsdato,
          sivilstand,
          epsHarInntektOver2G,
          epsHarPensjon,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          utenlandsperioder,
          erApoteker,
        })
        setOffentligTpRequestBody(requestBody)
      }
    }
  }, [
    harSamtykket,
    uttaksalder,
    skalBeregneAfpKap19,
    afp,
    foedselsdato,
    sivilstand,
    epsHarInntektOver2G,
    epsHarPensjon,
    aarligInntektFoerUttakBeloep,
    gradertUttaksperiode,
    aarligInntektVsaHelPensjon,
    utenlandsperioder,
    erApoteker,
  ])

  const data = skalBeregneAfpKap19
    ? offentligTpFoer1963Query.data
    : offentligTpQuery.data

  const isLoading = skalBeregneAfpKap19
    ? offentligTpFoer1963Query.isLoading
    : offentligTpQuery.isLoading

  const isFetching = skalBeregneAfpKap19
    ? offentligTpFoer1963Query.isFetching
    : offentligTpQuery.isFetching

  const isError = skalBeregneAfpKap19
    ? offentligTpFoer1963Query.isError
    : offentligTpQuery.isError

  let erSpkBesteberegning = false
  let tpAfpPeriode = undefined

  if (
    !isError &&
    !isFetching &&
    isOffentligTpFoer1963((skalBeregneAfpKap19 && harSamtykket) || false, data!)
  ) {
    const navAfp = alderspensjonQuery.data?.pre2025OffentligAfp?.totaltAfpBeloep
    const tpAfpPerioder =
      data?.simulertTjenestepensjon?.simuleringsresultat.utbetalingsperioder.filter(
        (periode) => periode.ytelsekode === 'AFP'
      )

    const minsteAlderForAfp: Alder = { aar: 65, maaneder: 0 }

    tpAfpPeriode = finnAllePensjonsavtalerVedUttak(
      tpAfpPerioder || [],
      isAlderLikEllerOverAnnenAlder(uttaksalder!, minsteAlderForAfp)
        ? uttaksalder!
        : minsteAlderForAfp // Minimum 65 år for AFP fra SPK
    )[0]

    erSpkBesteberegning =
      navAfp !== undefined && tpAfpPeriode !== undefined
        ? tpAfpPeriode.aarligUtbetaling > navAfp
        : false
  }

  return {
    data,
    isLoading,
    isFetching,
    isError,
    erOffentligTpFoer1963: (skalBeregneAfpKap19 && harSamtykket) || false,
    erSpkBesteberegning: erSpkBesteberegning,
    tpAfpPeriode,
  }
}

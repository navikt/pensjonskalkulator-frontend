import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Heading, HeadingProps } from '@navikt/ds-react'
import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { TabellVisning } from '@/components/TabellVisning'
import {
  usePensjonsavtalerQuery,
  useGetTpoMedlemskapQuery,
  useGetUtvidetSimuleringsresultatFeatureToggleQuery,
} from '@/state/api/apiSlice'
import { generatePensjonsavtalerRequestBody } from '@/state/api/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectSamtykke,
  selectUfoeregrad,
  selectSivilstand,
  selectAfp,
  selectIsEndring,
  selectFoedselsdato,
} from '@/state/userInput/selectors'

import {
  useSimuleringChartLocalState,
  useSimuleringPensjonsavtalerLocalState,
} from './hooks'
import { SimuleringEndringBanner } from './SimuleringEndringBanner/SimuleringEndringBanner'
import { SimuleringGrafNavigation } from './SimuleringGrafNavigation/SimuleringGrafNavigation'
import { SimuleringPensjonsavtalerAlert } from './SimuleringPensjonsavtalerAlert/SimuleringPensjonsavtalerAlert'
import { Simuleringsdetaljer } from './Simuleringsdetaljer/Simuleringsdetaljer'

import styles from './Simulering.module.scss'

export function Simulering(props: {
  isLoading: boolean
  headingLevel: HeadingProps['level']
  aarligInntektFoerUttakBeloep: string
  alderspensjonListe?: PensjonsberegningMedDetaljer[]
  afpPrivatListe?: Pensjonsberegning[]
  afpOffentligListe?: Pensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  showButtonsAndTable?: boolean
  detaljer?: {
    trygdetid?: number
    opptjeningsgrunnlag?: SimulertOpptjeningGrunnlag[]
  }
}) {
  const {
    isLoading,
    headingLevel,
    aarligInntektFoerUttakBeloep,
    alderspensjonListe,
    afpPrivatListe,
    afpOffentligListe,
    alderspensjonMaanedligVedEndring,
    showButtonsAndTable,
    detaljer,
  } = props

  const harSamtykket = useAppSelector(selectSamtykke)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)
  const sivilstand = useAppSelector(selectSivilstand)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const isEndring = useAppSelector(selectIsEndring)
  const {
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    utenlandsperioder,
  } = useAppSelector(selectCurrentSimulation)
  const { data: utvidetSimuleringsresultatFeatureToggle } =
    useGetUtvidetSimuleringsresultatFeatureToggleQuery()

  const chartRef = React.useRef<HighchartsReact.RefObject>(null)

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] =
    React.useState<PensjonsavtalerRequestBody | undefined>(undefined)

  const {
    data: pensjonsavtaler,
    isFetching: isPensjonsavtalerLoading,
    isSuccess: isPensjonsavtalerSuccess,
    isError: isPensjonsavtalerError,
  } = usePensjonsavtalerQuery(
    pensjonsavtalerRequestBody as PensjonsavtalerRequestBody,
    {
      skip: !pensjonsavtalerRequestBody || !harSamtykket || !uttaksalder,
    }
  )

  const { data: tpo, isError: isTpoError } = useGetTpoMedlemskapQuery(
    undefined,
    {
      skip: !harSamtykket,
    }
  )

  React.useEffect(() => {
    if (harSamtykket && uttaksalder) {
      const requestBody = generatePensjonsavtalerRequestBody({
        aarligInntektFoerUttakBeloep,
        ufoeregrad,
        afp,
        sivilstand,
        heltUttak: {
          uttaksalder,
          aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
        },
        gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
        utenlandsperioder,
      })
      setPensjonsavtalerRequestBody(requestBody)
    }
  }, [harSamtykket, uttaksalder])

  const [
    chartOptions,
    showVisFaerreAarButton,
    showVisFlereAarButton,
    isPensjonsavtaleFlagVisible,
  ] = useSimuleringChartLocalState({
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
    pensjonsavtaler: {
      isLoading: isPensjonsavtalerLoading,
      isSuccess: isPensjonsavtalerSuccess,
      isError: isPensjonsavtalerError,
      data: pensjonsavtaler,
    },
  })

  const [pensjonsavtalerAlert] = useSimuleringPensjonsavtalerLocalState({
    isEndring,
    isPensjonsavtaleFlagVisible,
    pensjonsavtaler: {
      isLoading: isPensjonsavtalerLoading,
      isSuccess: isPensjonsavtalerSuccess,
      isError: isPensjonsavtalerError,
      data: pensjonsavtaler,
    },
    tpo: {
      isError: isTpoError,
      data: tpo,
    },
  })

  return (
    <section className={styles.section}>
      <Heading level={headingLevel} size="medium" className={styles.title}>
        <FormattedMessage id="beregning.highcharts.title" />
      </Heading>

      <SimuleringEndringBanner
        heltUttaksalder={uttaksalder}
        gradertUttaksperiode={gradertUttaksperiode ?? undefined}
        alderspensjonMaanedligVedEndring={alderspensjonMaanedligVedEndring}
      />

      <div role="img" aria-labelledby="alt-chart-title">
        <div id="alt-chart-title" hidden>
          <FormattedMessage id="beregning.alt_tekst" />
        </div>
        <div data-testid="highcharts-aria-wrapper" aria-hidden={true}>
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
          />
        </div>
      </div>
      {showButtonsAndTable && (
        <SimuleringGrafNavigation
          showVisFaerreAarButton={showVisFaerreAarButton}
          showVisFlereAarButton={showVisFlereAarButton}
        />
      )}
      <SimuleringPensjonsavtalerAlert
        variant={pensjonsavtalerAlert?.variant}
        text={pensjonsavtalerAlert?.text}
      />

      {showButtonsAndTable && (
        <TabellVisning
          series={chartOptions.series as SeriesColumnOptions[]}
          aarArray={(chartOptions?.xAxis as XAxisOptions).categories}
        />
      )}
      {/* c8 ignore next 6 - detaljer skal kun vises i dev for test formål */}
      {utvidetSimuleringsresultatFeatureToggle?.enabled && detaljer && (
        <Simuleringsdetaljer
          alderspensjonListe={alderspensjonListe}
          detaljer={detaljer}
        />
      )}
    </section>
  )
}

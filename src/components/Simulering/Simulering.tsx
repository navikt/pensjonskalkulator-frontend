import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Heading, HeadingProps } from '@navikt/ds-react'
import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { TabellVisning } from '@/components/TabellVisning'
import {
  usePensjonsavtalerQuery,
  useOffentligTpQuery,
  useGetUtvidetSimuleringsresultatFeatureToggleQuery,
} from '@/state/api/apiSlice'
import {
  generateOffentligTpRequestBody,
  generatePensjonsavtalerRequestBody,
} from '@/state/api/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectSamtykke,
  selectUfoeregrad,
  selectSivilstand,
  selectSamboer,
  selectAfp,
  selectIsEndring,
  selectFoedselsdato,
} from '@/state/userInput/selectors'

import { useSimuleringChartLocalState } from './hooks'
import { SimuleringEndringBanner } from './SimuleringEndringBanner/SimuleringEndringBanner'
import { SimuleringGrafNavigation } from './SimuleringGrafNavigation/SimuleringGrafNavigation'
import { SimuleringPensjonsavtalerAlert } from './SimuleringPensjonsavtalerAlert/SimuleringPensjonsavtalerAlert'
import { Simuleringsdetaljer } from './Simuleringsdetaljer/Simuleringsdetaljer'

import styles from './Simulering.module.scss'

export function Simulering(props: {
  isLoading: boolean
  headingLevel: HeadingProps['level']
  aarligInntektFoerUttakBeloep: string
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
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
  const harSamboer = useAppSelector(selectSamboer)
  const {
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    utenlandsperioder,
  } = useAppSelector(selectCurrentSimulation)
  const { data: utvidetSimuleringsresultatFeatureToggle } =
    useGetUtvidetSimuleringsresultatFeatureToggleQuery()

  const chartRef = React.useRef<HighchartsReact.RefObject>(null)

  const [offentligTpRequestBody, setOffentligTpRequestBody] = React.useState<
    OffentligTpRequestBody | undefined
  >(undefined)

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] =
    React.useState<PensjonsavtalerRequestBody | undefined>(undefined)

  const {
    data: offentligTpData,
    isFetching: isOffentligTpLoading,
    isError: isOffentligTpError,
  } = useOffentligTpQuery(offentligTpRequestBody as OffentligTpRequestBody, {
    skip: !offentligTpRequestBody || !harSamtykket || !uttaksalder,
  })

  const {
    data: pensjonsavtalerData,
    isFetching: isPensjonsavtalerLoading,
    isSuccess: isPensjonsavtalerSuccess,
    isError: isPensjonsavtalerError,
  } = usePensjonsavtalerQuery(
    pensjonsavtalerRequestBody as PensjonsavtalerRequestBody,
    {
      skip: !pensjonsavtalerRequestBody || !harSamtykket || !uttaksalder,
    }
  )

  React.useEffect(() => {
    if (harSamtykket && uttaksalder) {
      setOffentligTpRequestBody(
        generateOffentligTpRequestBody({
          afp,
          foedselsdato,
          harSamboer,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          utenlandsperioder,
        })
      )
      setPensjonsavtalerRequestBody(
        generatePensjonsavtalerRequestBody({
          ufoeregrad,
          afp,
          sivilstand,
          harSamboer,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
        })
      )
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
      data: pensjonsavtalerData,
    },
    offentligTp: {
      isLoading: isOffentligTpLoading,
      data: offentligTpData,
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
        isPensjonsavtaleFlagVisible={isPensjonsavtaleFlagVisible}
        pensjonsavtaler={{
          isLoading: isPensjonsavtalerLoading,
          isError: isPensjonsavtalerError,
          isSuccess: isPensjonsavtalerSuccess,
          data: pensjonsavtalerData,
        }}
        offentligTp={{
          isError: isOffentligTpError,
          data: offentligTpData,
        }}
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

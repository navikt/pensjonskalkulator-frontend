import { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { HandFingerIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Heading, HeadingProps } from '@navikt/ds-react'
import clsx from 'clsx'
import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { MaanedsbloepAvansertBeregning } from '../MaanedsbloepAvansertBeregning'
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
  selectAfp,
  selectIsEndring,
  selectFoedselsdato,
  selectEpsHarPensjon,
  selectEpsHarInntektOver2G,
  selectUtenlandsperioder,
} from '@/state/userInput/selectors'

import {
  useSimuleringChartLocalState,
  useHighchartsRegressionPlugin,
} from './hooks'
import { SimuleringEndringBanner } from './SimuleringEndringBanner/SimuleringEndringBanner'
import { SimuleringGrafNavigation } from './SimuleringGrafNavigation/SimuleringGrafNavigation'
import { SimuleringPensjonsavtalerAlert } from './SimuleringPensjonsavtalerAlert/SimuleringPensjonsavtalerAlert'
import { Simuleringsdetaljer } from './Simuleringsdetaljer/Simuleringsdetaljer'

import styles from './Simulering.module.scss'

interface Props {
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
  type?: 'enkel' | 'avansert'
}

export const Simulering = ({
  isLoading,
  headingLevel,
  aarligInntektFoerUttakBeloep,
  alderspensjonListe,
  afpPrivatListe,
  afpOffentligListe,
  alderspensjonMaanedligVedEndring,
  showButtonsAndTable,
  detaljer,
  type,
}: Props) => {
  const harSamtykket = useAppSelector(selectSamtykke)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)
  const sivilstand = useAppSelector(selectSivilstand)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const isEndring = useAppSelector(selectIsEndring)
  const epsHarPensjon = useAppSelector(selectEpsHarPensjon)
  const epsHarInntektOver2G = useAppSelector(selectEpsHarInntektOver2G)
  const utenlandsperioder = useAppSelector(selectUtenlandsperioder)
  const { uttaksalder, aarligInntektVsaHelPensjon, gradertUttaksperiode } =
    useAppSelector(selectCurrentSimulation)
  const { data: utvidetSimuleringsresultatFeatureToggle } =
    useGetUtvidetSimuleringsresultatFeatureToggleQuery()

  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const [offentligTpRequestBody, setOffentligTpRequestBody] = useState<
    OffentligTpRequestBody | undefined
  >(undefined)

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] = useState<
    PensjonsavtalerRequestBody | undefined
  >(undefined)

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

  useEffect(() => {
    if (harSamtykket && uttaksalder) {
      setOffentligTpRequestBody(
        generateOffentligTpRequestBody({
          afp,
          foedselsdato,
          sivilstand,
          epsHarPensjon,
          epsHarInntektOver2G,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ?? undefined,
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
          epsHarPensjon,
          epsHarInntektOver2G,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ?? undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
        })
      )
    }
  }, [harSamtykket, uttaksalder])

  useHighchartsRegressionPlugin()

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
      <div className={clsx({ [styles.intro]: type === 'enkel' })}>
        <Heading
          className={clsx({ [styles.introTitle]: type === 'enkel' })}
          level={headingLevel}
          size={headingLevel === '2' ? 'medium' : 'small'}
        >
          <FormattedMessage id="beregning.highcharts.title" />
        </Heading>

        {type === 'enkel' && (
          <BodyLong>
            <FormattedMessage id="beregning.highcharts.ingress" />
          </BodyLong>
        )}
      </div>

      {showButtonsAndTable && (
        <SimuleringEndringBanner
          isLoading={isLoading}
          heltUttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode ?? undefined}
          alderspensjonMaanedligVedEndring={alderspensjonMaanedligVedEndring}
        />
      )}

      <div role="img" aria-labelledby="alt-chart-title">
        <div id="alt-chart-title" hidden>
          <FormattedMessage id="beregning.highcharts.alt_tekst" />
        </div>

        <div
          className={styles.highchartsWrapper}
          data-testid="highcharts-aria-wrapper"
          aria-hidden={true}
        >
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
          />

          <BodyShort
            size="small"
            textColor="subtle"
            className={styles.infoClick}
          >
            <HandFingerIcon />
            <FormattedMessage id="beregning.highcharts.informasjon_klikk" />
          </BodyShort>
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

      {!(isOffentligTpLoading || isLoading || isPensjonsavtalerLoading) &&
        type === 'avansert' && (
          <MaanedsbloepAvansertBeregning
            alderspensjonMaanedligVedEndring={alderspensjonMaanedligVedEndring}
            afpPrivatListe={afpPrivatListe}
            afpOffentligListe={afpOffentligListe}
            pensjonsavtaler={pensjonsavtalerData?.avtaler}
            offentligTp={offentligTpData}
          />
        )}
    </section>
  )
}

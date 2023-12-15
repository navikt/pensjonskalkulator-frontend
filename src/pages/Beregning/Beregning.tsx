import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { Heading, ToggleGroup } from '@navikt/ds-react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import clsx from 'clsx'
import Highcharts from 'highcharts'
import HighchartsAccessibility from 'highcharts/modules/accessibility'

import { AccordionContext as PensjonsavtalerAccordionContext } from '@/components/common/AccordionItem'
import { Alert } from '@/components/common/Alert'
import { Loader } from '@/components/common/Loader'
import { Grunnlag } from '@/components/Grunnlag'
import { Simulering } from '@/components/Simulering'
import { TidligstMuligUttaksalder } from '@/components/TidligstMuligUttaksalder'
import { TilbakeEllerAvslutt } from '@/components/TilbakeEllerAvslutt'
import { VelgUttaksalder } from '@/components/VelgUttaksalder'
import { paths } from '@/router/constants'
import {
  apiSlice,
  useAlderspensjonQuery,
  useGetPersonQuery,
  useTidligsteUttaksalderQuery,
} from '@/state/api/apiSlice'
import {
  useGetHighchartsAccessibilityPluginFeatureToggleQuery,
  useGetDetaljertFaneFeatureToggleQuery,
} from '@/state/api/apiSlice'
import { generateAlderspensjonRequestBody } from '@/state/api/utils'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectSamboer,
  selectCurrentSimulation,
  selectFormatertUttaksalder,
  selectAarligInntektFoerUttak,
} from '@/state/userInput/selectors'
import { logger } from '@/utils/logging'

import styles from './Beregning.module.scss'

type BeregningVisning = 'enkel' | 'avansert'
interface Props {
  visning: BeregningVisning
}

export const Beregning: React.FC<Props> = ({ visning }) => {
  const navigate = useNavigate()

  const isAlderValgt = useAppSelector(selectFormatertUttaksalder) !== null
  const harSamboer = useAppSelector(selectSamboer)
  const [alderspensjonRequestBody, setAlderspensjonRequestBody] =
    React.useState<AlderspensjonRequestBody | undefined>(undefined)
  const [tidligsteUttaksalderRequestBody, setTidligsteUttaksalderRequestBody] =
    React.useState<TidligsteUttaksalderRequestBody | undefined>(undefined)
  const [
    isPensjonsavtalerAccordionItemOpen,
    setIslePensjonsavtalerAccordionItem,
  ] = React.useState<boolean>(false)
  const grunnlagPensjonsavtalerRef = React.useRef<HTMLSpanElement>(null)
  /* c8 ignore next 3 */
  const togglePensjonsavtalerAccordionItem = () => {
    setIslePensjonsavtalerAccordionItem((prevState) => !prevState)
  }
  const { data: highchartsAccessibilityFeatureToggle } =
    useGetHighchartsAccessibilityPluginFeatureToggleQuery()
  const { data: detaljertFaneFeatureToggle } =
    useGetDetaljertFaneFeatureToggleQuery()

  const { data: person } = useGetPersonQuery()
  const afp = useAppSelector(selectAfp)
  const aarligInntektFoerUttak = useAppSelector(selectAarligInntektFoerUttak)
  const { startAar, startMaaned, uttaksgrad } = useAppSelector(
    selectCurrentSimulation
  )

  const intl = useIntl()
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    /* c8 ignore next 3 */
    if (highchartsAccessibilityFeatureToggle?.enabled) {
      HighchartsAccessibility(Highcharts)
    }
    document.title = intl.formatMessage({
      id: 'application.title.beregning',
    })
  }, [])

  React.useEffect(() => {
    const requestBody = generateAlderspensjonRequestBody({
      afp,
      sivilstand: person?.sivilstand,
      harSamboer,
      foedselsdato: person?.foedselsdato,
      aarligInntektFoerUttak: aarligInntektFoerUttak ?? 0,
      startAlder: startAar,
      startMaaned,
      uttaksgrad,
    })
    setAlderspensjonRequestBody(requestBody)
  }, [
    afp,
    person,
    aarligInntektFoerUttak,
    harSamboer,
    startAar,
    startMaaned,
    uttaksgrad,
  ])

  React.useEffect(() => {
    setTidligsteUttaksalderRequestBody({
      sivilstand: person?.sivilstand,
      harEps: harSamboer !== null ? harSamboer : undefined,
      sisteInntekt: aarligInntektFoerUttak ?? 0,
      simuleringstype:
        afp === 'ja_privat' ? 'ALDERSPENSJON_MED_AFP_PRIVAT' : 'ALDERSPENSJON',
    })
  }, [afp, person, aarligInntektFoerUttak, harSamboer])

  // Hent tidligst mulig uttaksalder
  const {
    data: tidligstMuligUttak,
    isLoading: isTidligstMuligUttaksalderLoading,
    isError: isTidligstMuligUttaksalderError,
  } = useTidligsteUttaksalderQuery(tidligsteUttaksalderRequestBody, {
    skip: !tidligsteUttaksalderRequestBody,
  })

  // Hent alderspensjon + AFP
  const {
    data: alderspensjon,
    isFetching,
    isError,
    error,
  } = useAlderspensjonQuery(
    alderspensjonRequestBody as AlderspensjonRequestBody,
    {
      skip: !alderspensjonRequestBody,
    }
  )

  React.useEffect(() => {
    if (error && (error as FetchBaseQueryError).status === 503) {
      throw new Error((error as FetchBaseQueryError).data as string)
    }
  }, [error])

  const onRetry = (): void => {
    dispatch(apiSlice.util.invalidateTags(['Alderspensjon']))
    if (alderspensjonRequestBody) {
      dispatch(
        apiSlice.endpoints.alderspensjon.initiate(alderspensjonRequestBody)
      )
    }
  }

  React.useEffect(() => {
    if (isAlderValgt) {
      if (alderspensjon && !alderspensjon?.vilkaarErOppfylt) {
        logger('alert', { teskt: 'Beregning: Ikke høy nok opptjening' })
      } else if (isError) {
        logger('alert', { teskt: 'Beregning: Klarte ikke beregne pensjon' })
      }
    }
  }, [isAlderValgt, isError, alderspensjon])

  if (isTidligstMuligUttaksalderLoading) {
    return (
      <Loader
        data-testid="uttaksalder-loader"
        size="3xlarge"
        title={intl.formatMessage({
          id: 'beregning.loading',
        })}
      />
    )
  }

  return (
    <div className={styles.beregning}>
      {detaljertFaneFeatureToggle?.enabled && (
        <div className={styles.container}>
          <div className={styles.toggle}>
            <ToggleGroup
              defaultValue={visning}
              variant="neutral"
              onChange={(v) => {
                navigate(
                  v === 'enkel'
                    ? paths.beregningEnkel
                    : paths.beregningDetaljert
                )
              }}
            >
              <ToggleGroup.Item value="enkel">Enkel</ToggleGroup.Item>
              <ToggleGroup.Item value="avansert">Avansert</ToggleGroup.Item>
            </ToggleGroup>
          </div>
        </div>
      )}
      {visning === 'enkel' && (
        <>
          {!isTidligstMuligUttaksalderError && tidligstMuligUttak && (
            <div className={styles.container}>
              <TidligstMuligUttaksalder
                tidligstMuligUttak={tidligstMuligUttak}
                hasAfpOffentlig={afp === 'ja_offentlig'}
              />
            </div>
          )}
          <div
            className={clsx(styles.background, styles.background__hasMargin, {
              [styles.background__white]: isAlderValgt,
            })}
          >
            <div className={styles.container}>
              <VelgUttaksalder tidligstMuligUttak={tidligstMuligUttak} />
            </div>

            {isAlderValgt && (
              <div
                className={`${styles.container} ${styles.container__hasPadding}`}
              >
                {isError ||
                (alderspensjon && !alderspensjon?.vilkaarErOppfylt) ? (
                  <>
                    <Heading level="2" size="small">
                      <FormattedMessage id="beregning.title" />
                    </Heading>
                    <Alert onRetry={isError ? onRetry : undefined}>
                      {startAar && startAar < 67 && (
                        <FormattedMessage
                          id="beregning.lav_opptjening"
                          values={{ startAar }}
                        />
                      )}
                      {isError && <FormattedMessage id="beregning.error" />}
                    </Alert>
                  </>
                ) : (
                  <>
                    <PensjonsavtalerAccordionContext.Provider
                      value={{
                        ref: grunnlagPensjonsavtalerRef,
                        isOpen: isPensjonsavtalerAccordionItemOpen,
                        toggleOpen: togglePensjonsavtalerAccordionItem,
                      }}
                    >
                      <Simulering
                        isLoading={isFetching}
                        hasHighchartsAccessibilityPlugin={
                          highchartsAccessibilityFeatureToggle?.enabled
                        }
                        aarligInntektFoerUttak={aarligInntektFoerUttak ?? 0}
                        alderspensjon={alderspensjon}
                        showAfp={afp === 'ja_privat'}
                        showButtonsAndTable={
                          !isError && alderspensjon?.vilkaarErOppfylt
                        }
                      />
                      <Grunnlag tidligstMuligUttak={tidligstMuligUttak} />
                    </PensjonsavtalerAccordionContext.Provider>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {visning === 'avansert' && <p>avansert visning</p>}
      <div className={`${styles.background} ${styles.background__lightblue}`}>
        <div className={styles.container}>
          <TilbakeEllerAvslutt />
        </div>
      </div>
    </div>
  )
}

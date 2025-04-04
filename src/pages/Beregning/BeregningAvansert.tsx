import { useContext, useEffect, useMemo } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router'

import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading, Link } from '@navikt/ds-react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import clsx from 'clsx'

import { Alert as AlertDashBorder } from '@/components/common/Alert'
import { SanityGuidePanel } from '@/components/common/SanityGuidePanel'
import { Grunnlag } from '@/components/Grunnlag'
import { GrunnlagForbehold } from '@/components/GrunnlagForbehold'
import { InfoOmLoependeVedtak } from '@/components/InfoOmLoependeVedtak'
import { MaanedsbloepAvansertBeregning } from '@/components/MaanedsbloepAvansertBeregning'
import { Pensjonsavtaler } from '@/components/Pensjonsavtaler'
import { RedigerAvansertBeregning } from '@/components/RedigerAvansertBeregning'
import { ResultatkortAvansertBeregning } from '@/components/ResultatkortAvansertBeregning'
import { SavnerDuNoe } from '@/components/SavnerDuNoe'
import { Simulering } from '@/components/Simulering'
import { BeregningContext } from '@/pages/Beregning/context'
import { paths } from '@/router/constants'
import {
  useGetPersonQuery,
  apiSlice,
  useAlderspensjonQuery,
} from '@/state/api/apiSlice'
import { generateAlderspensjonRequestBody } from '@/state/api/utils'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectCurrentSimulation,
  selectSamtykkeOffentligAFP,
  selectAarligInntektFoerUttakBeloep,
  selectIsEndring,
  selectLoependeVedtak,
  selectEpsHarPensjon,
  selectEpsHarInntektOver2G,
  selectSivilstand,
  selectUtenlandsperioder,
  selectNormertPensjonsalder,
} from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './BeregningAvansert.module.scss'

export const BeregningAvansert = () => {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { avansertSkjemaModus, setAvansertSkjemaModus } =
    useContext(BeregningContext)

  const harSamtykketOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const afp = useAppSelector(selectAfp)
  const isEndring = useAppSelector(selectIsEndring)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const aarligInntektFoerUttakBeloep = useAppSelector(
    selectAarligInntektFoerUttakBeloep
  )

  const epsHarPensjon = useAppSelector(selectEpsHarPensjon)
  const epsHarInntektOver2G = useAppSelector(selectEpsHarInntektOver2G)
  const sivilstand = useAppSelector(selectSivilstand)
  const { data: person } = useGetPersonQuery()

  const normertPensjonsalder = useAppSelector(selectNormertPensjonsalder)
  const utenlandsperioder = useAppSelector(selectUtenlandsperioder)
  const {
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    beregningsvalg,
  } = useAppSelector(selectCurrentSimulation)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const alderspensjonRequestBody: AlderspensjonRequestBody | undefined =
    useMemo(() => {
      if (uttaksalder) {
        return generateAlderspensjonRequestBody({
          loependeVedtak,
          afp: afp === 'ja_offentlig' && !harSamtykketOffentligAFP ? null : afp,
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
        })
      }
    }, [
      afp,
      person,
      aarligInntektFoerUttakBeloep,
      sivilstand,
      uttaksalder,
      epsHarPensjon,
      epsHarInntektOver2G,
      beregningsvalg,
    ])

  // Hent alderspensjon + AFP
  const {
    data: alderspensjon,
    isFetching,
    isError,
    error,
  } = useAlderspensjonQuery(
    alderspensjonRequestBody as AlderspensjonRequestBody,
    { skip: !alderspensjonRequestBody }
  )

  useEffect(() => {
    if (uttaksalder) {
      if (alderspensjon && !alderspensjon?.vilkaarsproeving.vilkaarErOppfylt) {
        logger('alert vist', {
          tekst: 'Beregning avansert: Ikke høy nok opptjening',
          variant: 'warning',
        })
      } else if (isError) {
        logger('alert vist', {
          tekst: 'Beregning avansert: Klarte ikke beregne pensjon',
          variant: 'error',
        })
      }
    }
  }, [uttaksalder, isError, alderspensjon])

  useEffect(() => {
    if (
      (error &&
        ((error as FetchBaseQueryError).status === 503 ||
          (error as FetchBaseQueryError).status === 'PARSING_ERROR')) ||
      (alderspensjon?.afpOffentlig?.length === 0 &&
        alderspensjonRequestBody?.simuleringstype ===
          'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG')
    ) {
      navigate(paths.uventetFeil)
      logger('info', {
        tekst: 'Redirect til /uventet-feil',
        data: 'fra Beregning Avansert',
      })
    }
  }, [error, alderspensjon])

  // Skal redigerer tilbake når alderspensjon er refetchet ferdig, og
  useEffect(() => {
    if (alderspensjon && !alderspensjon.vilkaarsproeving.vilkaarErOppfylt) {
      setAvansertSkjemaModus('redigering')
    }
    if (alderspensjon?.vilkaarsproeving.vilkaarErOppfylt) {
      logger('resultat vist', { tekst: 'Beregning avansert' })
      logger('grunnlag for beregningen', {
        tekst: 'antall opphold',
        data: utenlandsperioder?.length ?? 0,
      })
    }
  }, [alderspensjon])

  const onRetry = (): void => {
    dispatch(apiSlice.util.invalidateTags(['Alderspensjon']))
    if (alderspensjonRequestBody) {
      dispatch(
        apiSlice.endpoints.alderspensjon.initiate(alderspensjonRequestBody)
      )
    }
  }

  const maanedtligbeloep = alderspensjon?.afpOffentlig?.at(0)?.beloep

  if (avansertSkjemaModus === 'redigering')
    return (
      <RedigerAvansertBeregning
        vilkaarsproeving={alderspensjon?.vilkaarsproeving}
      />
    )

  const harHelUT = loependeVedtak?.ufoeretrygd.grad === 100
  const harGradertUT =
    loependeVedtak?.ufoeretrygd.grad > 0 &&
    loependeVedtak?.ufoeretrygd.grad < 100

  return (
    <>
      <InfoOmLoependeVedtak loependeVedtak={loependeVedtak} />

      <div
        className={clsx(
          styles.container,
          styles.container__hasMobilePadding,
          styles.container__hasTopMargin
        )}
      >
        {isError ? (
          <>
            <Heading level="2" size="medium">
              <FormattedMessage id="beregning.title" />
            </Heading>

            <AlertDashBorder onRetry={isError ? onRetry : undefined}>
              {isError && <FormattedMessage id="beregning.error" />}
            </AlertDashBorder>

            <ResultatkortAvansertBeregning
              onButtonClick={() => setAvansertSkjemaModus('redigering')}
            />
          </>
        ) : (
          <>
            <Link
              href="#"
              className={styles.link}
              onClick={(e) => {
                e?.preventDefault()
                logger('button klikk', {
                  tekst: isEndring
                    ? 'Beregning avansert: Endre valgene dine'
                    : 'Beregning avansert: Endre avanserte valg',
                })
                setAvansertSkjemaModus('redigering')
              }}
            >
              <ArrowLeftIcon aria-hidden fontSize="1.5rem" />
              <FormattedMessage
                id={
                  isEndring
                    ? 'beregning.avansert.link.endre_valgene_dine'
                    : 'beregning.avansert.link.endre_avanserte_valg'
                }
              />
            </Link>

            <div className={styles.intro}>
              <Heading level="2" size="medium" className={styles.introTitle}>
                <FormattedMessage id="beregning.intro.title" />
              </Heading>

              <BodyShort>
                <FormattedMessage id="beregning.intro.description_1" />

                {beregningsvalg === 'med_afp' ? (
                  <FormattedMessage
                    id="beregning.intro.description_2.med_afp"
                    values={{
                      ...getFormatMessageValues(),
                    }}
                  />
                ) : (
                  <>
                    {harHelUT && (
                      <FormattedMessage
                        id="beregning.intro.description_2.uten_afp.hel"
                        values={{
                          ...getFormatMessageValues(),
                        }}
                      />
                    )}
                    {harGradertUT && (
                      <FormattedMessage
                        id="beregning.intro.description_2.uten_afp.gradert"
                        values={{
                          ...getFormatMessageValues(),
                          grad: loependeVedtak.ufoeretrygd.grad,
                          normertPensjonsalder: formatUttaksalder(
                            intl,
                            normertPensjonsalder
                          ),
                        }}
                      />
                    )}
                  </>
                )}
              </BodyShort>
            </div>

            <Simulering
              type="avansert"
              isLoading={isFetching}
              headingLevel="3"
              aarligInntektFoerUttakBeloep={aarligInntektFoerUttakBeloep ?? '0'}
              alderspensjonListe={alderspensjon?.alderspensjon}
              afpPrivatListe={
                (afp === 'ja_privat' || loependeVedtak.afpPrivat) &&
                alderspensjon?.afpPrivat
                  ? alderspensjon?.afpPrivat
                  : undefined
              }
              afpOffentligListe={
                afp === 'ja_offentlig' &&
                harSamtykketOffentligAFP &&
                alderspensjon?.afpOffentlig
                  ? alderspensjon?.afpOffentlig
                  : undefined
              }
              alderspensjonMaanedligVedEndring={
                alderspensjon?.alderspensjonMaanedligVedEndring
              }
              showButtonsAndTable={
                !isError && alderspensjon?.vilkaarsproeving.vilkaarErOppfylt
              }
              detaljer={
                alderspensjon?.trygdetid ||
                alderspensjon?.opptjeningGrunnlagListe
                  ? {
                      trygdetid: alderspensjon?.trygdetid,
                      opptjeningsgrunnlag:
                        alderspensjon?.opptjeningGrunnlagListe,
                    }
                  : undefined
              }
            />

            <MaanedsbloepAvansertBeregning
              alderpensjonHel={
                alderspensjon?.alderspensjonMaanedligVedEndring
                  ?.heltUttakMaanedligBeloep ?? 0
              }
              afp={
                maanedtligbeloep ? Math.round(maanedtligbeloep / 12) : undefined
              }
            />
            {beregningsvalg === 'med_afp' && (
              <SanityGuidePanel
                id="vurderer_du_a_velge_afp"
                className={styles.guidePanel}
              />
            )}

            {!isEndring && <Pensjonsavtaler headingLevel="2" />}

            <Grunnlag
              visning="avansert"
              headingLevel="2"
              harForLiteTrygdetid={alderspensjon?.harForLiteTrygdetid}
              trygdetid={alderspensjon?.trygdetid}
              pensjonsbeholdning={
                alderspensjon?.alderspensjon &&
                alderspensjon?.alderspensjon.length > 0
                  ? alderspensjon?.alderspensjon[0]
                      .pensjonBeholdningFoerUttakBeloep
                  : undefined
              }
            />
          </>
        )}
      </div>

      {!isError && (
        <>
          <div
            className={clsx(styles.background, styles.background__lightblue)}
          >
            <div className={styles.container}>
              <SavnerDuNoe headingLevel="3" isEndring={isEndring} />
            </div>
          </div>

          <div className={styles.container}>
            <GrunnlagForbehold headingLevel="3" />
          </div>
        </>
      )}
    </>
  )
}

import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import { BodyLong, Heading, HeadingProps, Link } from '@navikt/ds-react'

import ShowMore from '../common/ShowMore/ShowMore'
import { BeregningContext } from '@/pages/Beregning/context'
import { paths } from '@/router/constants'
import {
  useOffentligTpQuery,
  usePensjonsavtalerQuery,
} from '@/state/api/apiSlice'
import {
  generateOffentligTpRequestBody,
  generatePensjonsavtalerRequestBody,
} from '@/state/api/utils'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectSamtykke,
  selectAarligInntektFoerUttakBeloep,
  selectAfp,
  selectFoedselsdato,
  selectSamboer,
  selectUfoeregrad,
  selectSivilstand,
  selectCurrentSimulation,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'
import { getFormatMessageValues } from '@/utils/translations'

import { OffentligTjenestepensjon } from './OffentligTjenestePensjon/OffentligTjenestepensjon'
import { PensjonsavtalerInlineAlert } from './PensjonsavtalerInlineAlert'
import { PrivatePensjonsavtaler } from './PrivatePensjonsavtaler'

import styles from './Pensjonsavtaler.module.scss'

export const Pensjonsavtaler = (props: {
  headingLevel: HeadingProps['level']
}) => {
  const { headingLevel } = props
  const { pensjonsavtalerShowMoreRef } = React.useContext(BeregningContext)
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const harSamtykket = useAppSelector(selectSamtykke)
  const sivilstand = useAppSelector(selectSivilstand)
  const aarligInntektFoerUttakBeloep = useAppSelector(
    selectAarligInntektFoerUttakBeloep
  )
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const harSamboer = useAppSelector(selectSamboer)
  const {
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    utenlandsperioder,
  } = useAppSelector(selectCurrentSimulation)

  const [offentligTpRequestBody, setOffentligTpRequestBody] = React.useState<
    OffentligTpRequestBody | undefined
  >(undefined)

  const {
    data: offentligTp,
    isLoading: isOffentligTpLoading,
    isError: isOffentligTpError,
  } = useOffentligTpQuery(offentligTpRequestBody as OffentligTpRequestBody, {
    skip: !offentligTpRequestBody || !harSamtykket || !uttaksalder,
  })

  // Hent Offentlig Tjenestepensjon
  React.useEffect(() => {
    if (harSamtykket && uttaksalder) {
      const requestBody = generateOffentligTpRequestBody({
        afp,
        foedselsdato,
        harSamboer,
        aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
        uttaksalder: gradertUttaksperiode
          ? gradertUttaksperiode.uttaksalder
          : uttaksalder,
        utenlandsperioder,
      })
      setOffentligTpRequestBody(requestBody)
    }
  }, [harSamtykket, uttaksalder])

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] =
    React.useState<PensjonsavtalerRequestBody | undefined>(undefined)

  // Hent Private Pensjonsavtaler
  React.useEffect(() => {
    if (harSamtykket && uttaksalder) {
      const requestBody = generatePensjonsavtalerRequestBody({
        aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
        ufoeregrad,
        afp,
        sivilstand,
        harSamboer,
        heltUttak: {
          uttaksalder,
          aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
        },
        gradertUttak: gradertUttaksperiode ? gradertUttaksperiode : undefined,
      })
      setPensjonsavtalerRequestBody(requestBody)
    }
  }, [harSamtykket, uttaksalder])

  const subHeadingLevel = React.useMemo(() => {
    return headingLevel
      ? ((
          parseInt(headingLevel as string, 10) + 1
        ).toString() as HeadingProps['level'])
      : '4'
  }, [headingLevel])

  const {
    data: pensjonsavtaler,
    isError: isPensjonsavtalerError,
    isSuccess: isPensjonsavtalerSuccess,
  } = usePensjonsavtalerQuery(
    pensjonsavtalerRequestBody as PensjonsavtalerRequestBody,
    {
      skip: !pensjonsavtalerRequestBody || !harSamtykket || !uttaksalder,
    }
  )

  const onCancel = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    dispatch(userInputActions.flush())
    navigate(paths.start)
  }

  const fastText = (
    <>
      <BodyLong className={styles.paragraph} size="small">
        <FormattedMessage
          id="pensjonsavtaler.ingress.norsk_pensjon"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
      </BodyLong>
      <OffentligTjenestepensjon
        isLoading={isOffentligTpLoading}
        isError={isOffentligTpError}
        offentligTp={offentligTp}
        headingLevel={subHeadingLevel}
        showDivider
      />
      <BodyLong className={styles.footnote}>
        <FormattedMessage id="pensjonsavtaler.fra_og_med_forklaring" />
      </BodyLong>
    </>
  )

  return (
    <section className={styles.section}>
      <Heading id="pensjonsavtaler-heading" level={headingLevel} size="medium">
        {intl.formatMessage({ id: 'pensjonsavtaler.title' })}
      </Heading>
      <>
        {!harSamtykket ? (
          <BodyLong>
            <FormattedMessage id="pensjonsavtaler.ingress.error.samtykke_ingress" />
            <Link href={paths.start} onClick={onCancel}>
              {intl.formatMessage({
                id: 'pensjonsavtaler.ingress.error.samtykke_link_1',
              })}
            </Link>{' '}
            <FormattedMessage
              id="pensjonsavtaler.ingress.error.samtykke_link_2"
              values={{
                ...getFormatMessageValues(intl),
              }}
            />
          </BodyLong>
        ) : (
          <>
            <PensjonsavtalerInlineAlert
              isPartialResponse={!!pensjonsavtaler?.partialResponse}
              isError={
                isPensjonsavtalerError ||
                (pensjonsavtaler?.partialResponse &&
                  pensjonsavtaler?.avtaler.length === 0)
              }
              isSuccess={
                isPensjonsavtalerSuccess &&
                !pensjonsavtaler?.partialResponse &&
                pensjonsavtaler?.avtaler.length === 0
              }
            />

            {isPensjonsavtalerSuccess && pensjonsavtaler?.avtaler.length ? (
              <ShowMore
                ref={pensjonsavtalerShowMoreRef}
                name="pensjonsavtaler"
                aria-labelledby="pensjonsavtaler-heading"
                collapsedHeight={
                  (pensjonsavtaler?.avtaler?.length ?? 0) > 1
                    ? '20rem'
                    : '10rem'
                }
              >
                <>
                  <PrivatePensjonsavtaler
                    headingLevel={subHeadingLevel}
                    privatePensjonsavtaler={pensjonsavtaler?.avtaler}
                  />
                  {fastText}
                </>
              </ShowMore>
            ) : (
              <>{fastText}</>
            )}
          </>
        )}
      </>
    </section>
  )
}

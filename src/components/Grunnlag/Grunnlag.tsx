import clsx from 'clsx'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import {
  Accordion,
  BodyLong,
  HStack,
  Heading,
  HeadingProps,
  Link,
  ReadMore,
  VStack,
} from '@navikt/ds-react'

import { AccordionItem } from '@/components/common/AccordionItem'
import { paths } from '@/router/constants'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectLoependeVedtak,
  selectSivilstand,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { BeregningVisning } from '@/types/common-types'
import { logger } from '@/utils/logging'
import { formatSivilstand } from '@/utils/sivilstand'
import { getFormatMessageValues } from '@/utils/translations'

import { GrunnlagItem } from '../GrunnlagItem'
import { Pensjonsavtaler } from '../Pensjonsavtaler/Pensjonsavtaler'
import { AfpDetaljerGrunnlag } from '../Simulering/BeregningsdetaljerForOvergangskull/AfpDetaljerGrunnlag'
import { AlderspensjonDetaljerGrunnlag } from '../Simulering/BeregningsdetaljerForOvergangskull/AlderspensjonDetaljerGrunnlag'
import { useBeregningsdetaljer } from '../Simulering/BeregningsdetaljerForOvergangskull/hooks'
import { Pensjonsgivendeinntekt } from '../Simulering/Pensjonsgivendeinntekt'
import { GrunnlagAFP } from './GrunnlagAFP'
import { GrunnlagSection } from './GrunnlagSection'
import { GrunnlagUtenlandsopphold } from './GrunnlagUtenlandsopphold'

import styles from './Grunnlag.module.scss'

interface Props {
  visning: BeregningVisning
  headingLevel: HeadingProps['level']
  harForLiteTrygdetid?: boolean
  trygdetid?: number
  isEndring: boolean
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPensjonsberegning[]
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
}

export const Grunnlag: React.FC<Props> = ({
  visning,
  headingLevel,
  harForLiteTrygdetid,
  trygdetid,
  isEndring,
  alderspensjonListe,
  afpPrivatListe,
  afpOffentligListe,
  pre2025OffentligAfp,
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const goToAvansert: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    dispatch(userInputActions.flushCurrentSimulation())
    navigate(paths.beregningAvansert)
  }

  const intl = useIntl()
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const sivilstand = useAppSelector(selectSivilstand)

  const [isAFPDokumentasjonVisible, setIsAFPDokumentasjonVisible] =
    React.useState<boolean>(false)

  const [isAlderspensjonDetaljerVisible, setIsAlderspensjonDetaljerVisible] =
    React.useState<boolean>(false)

  const formatertSivilstand = React.useMemo(
    () => formatSivilstand(intl, sivilstand!),
    [sivilstand]
  )

  const {
    alderspensjonDetaljerListe,
    pre2025OffentligAfpDetaljerListe,
    afpPrivatDetaljerListe,
    afpOffentligDetaljerListe,
    opptjeningPre2025OffentligAfpListe,
  } = useBeregningsdetaljer(
    alderspensjonListe,
    afpPrivatListe,
    afpOffentligListe,
    pre2025OffentligAfp
  )

  // Når det ikke er noen detaljer for AFP, så er "Les mer" lenken skjult.
  const shouldHideAfpReadMore =
    !afpOffentligDetaljerListe.length &&
    !afpPrivatDetaljerListe.length &&
    !pre2025OffentligAfpDetaljerListe.length

  const handleReadMoreChange = ({
    isOpen,
    ytelse,
  }: {
    isOpen: boolean
    ytelse: string
  }) => {
    const name = `Grunnlag: Vis detaljer for ${ytelse}`
    if (isOpen) {
      logger('show more lukket', { tekst: name })
      setIsAFPDokumentasjonVisible(false)
    } else {
      logger('show more åpnet', { tekst: name })
      setIsAFPDokumentasjonVisible(true)
    }
  }

  return (
    <section className={styles.section}>
      <Heading level={headingLevel} size="medium">
        {isEndring || visning === 'avansert' ? (
          <FormattedMessage id="grunnlag.endring.title" />
        ) : (
          <FormattedMessage id="grunnlag.title" />
        )}
      </Heading>

      <HStack gap="8" marginBlock="6 0">
        {visning === 'enkel' && !isEndring && (
          <GrunnlagItem color="gray">
            <Pensjonsgivendeinntekt goToAvansert={goToAvansert} />
          </GrunnlagItem>
        )}

        {!isEndring && (
          <GrunnlagItem color="green">
            <Pensjonsavtaler headingLevel="3" />
          </GrunnlagItem>
        )}

        <GrunnlagItem color="purple">
          <GrunnlagAFP />
          {!shouldHideAfpReadMore && (
            <ReadMore
              name="Listekomponenter for AFP"
              open={isAFPDokumentasjonVisible}
              header={
                isAFPDokumentasjonVisible
                  ? intl.formatMessage(
                      {
                        id: 'beregning.detaljer.lukk',
                      },
                      {
                        ...getFormatMessageValues(),
                        ytelse: 'AFP',
                      }
                    )
                  : intl.formatMessage(
                      {
                        id: 'beregning.detaljer.vis',
                      },
                      {
                        ...getFormatMessageValues(),
                        ytelse: 'AFP',
                      }
                    )
              }
              className={clsx(
                styles.visListekomponenter,
                styles.wideDetailedView
              )}
              onOpenChange={(open) =>
                handleReadMoreChange({ isOpen: open, ytelse: 'AFP' })
              }
            >
              <AfpDetaljerGrunnlag
                afpPrivatDetaljerListe={afpPrivatDetaljerListe}
                afpOffentligDetaljerListe={afpOffentligDetaljerListe}
                pre2025OffentligAfpDetaljerListe={
                  pre2025OffentligAfpDetaljerListe
                }
                opptjeningPre2025OffentligAfpListe={
                  opptjeningPre2025OffentligAfpListe
                }
              />
              {pre2025OffentligAfp &&
                pre2025OffentligAfp.afpAvkortetTil70Prosent && (
                  <FormattedMessage
                    id="grunnlag.afp.avkortet.til.70.prosent"
                    values={{
                      ...getFormatMessageValues(),
                    }}
                  />
                )}
              {/* TODO: hvis pre2025OffentligAfp.afpAvkortetTil70Prosent eller
              prosent afp redusert, så rendre linken  */}
              {/* TODO: Flyttes inn i samme text som grunnlag.afp.avkortet.til.70.prosent hvis den er kun brukt her */}
              {pre2025OffentligAfp &&
                pre2025OffentligAfp.afpAvkortetTil70Prosent && (
                  <span>
                    &nbsp;
                    <Link
                      href="https://www.nav.no/afp-offentlig#beregning"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FormattedMessage id="grunnlag.afp.link.text" />
                    </Link>
                  </span>
                )}
            </ReadMore>
          )}
        </GrunnlagItem>

        <GrunnlagItem color="blue">
          <VStack gap="3">
            <Heading level="3" size="small">
              <FormattedMessage id="beregning.highcharts.serie.alderspensjon.name" />
            </Heading>
            <BodyLong className={styles.alderspensjonDetaljer}>
              {loependeVedtak.alderspensjon || visning === 'avansert' ? (
                <FormattedMessage
                  id="grunnlag.alderspensjon.endring.ingress"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
              ) : (
                <FormattedMessage
                  id="grunnlag.alderspensjon.ingress"
                  values={{
                    ...getFormatMessageValues(),
                    avansert: (
                      <Link href="#" onClick={goToAvansert}>
                        avansert kalkulator
                      </Link>
                    ),
                  }}
                />
              )}
            </BodyLong>
          </VStack>
          <ReadMore
            name="Listekomponenter for alderspensjon"
            open={isAlderspensjonDetaljerVisible}
            header={
              isAlderspensjonDetaljerVisible
                ? intl.formatMessage(
                    {
                      id: 'beregning.detaljer.lukk',
                    },
                    {
                      ...getFormatMessageValues(),
                      ytelse: 'alderspensjon',
                    }
                  )
                : intl.formatMessage(
                    {
                      id: 'beregning.detaljer.vis',
                    },
                    {
                      ...getFormatMessageValues(),
                      ytelse: 'alderspensjon',
                    }
                  )
            }
            className={clsx(
              styles.visListekomponenter,
              styles.wideDetailedView
            )}
            onOpenChange={(open) =>
              handleReadMoreChange({ isOpen: open, ytelse: 'AP' })
            }
          >
            <AlderspensjonDetaljerGrunnlag
              alderspensjonDetaljerListe={alderspensjonDetaljerListe}
              hasPre2025OffentligAfpUttaksalder={Boolean(
                opptjeningPre2025OffentligAfpListe?.length
              )}
            />
            <FormattedMessage
              id="grunnlag.alderspensjon.ingress.link"
              values={{
                ...getFormatMessageValues(),
              }}
            />
          </ReadMore>
        </GrunnlagItem>
      </HStack>

      {/* TODO: Fjern style når Accordion fjernes */}
      <VStack marginBlock="12 0" style={{ marginBottom: '16px' }}>
        <Heading level={headingLevel} size="medium">
          <FormattedMessage id="om_deg.title" />
        </Heading>
      </VStack>

      <Accordion>
        <AccordionItem name="Gunnlag: Sivilstand">
          <GrunnlagSection
            headerTitle={intl.formatMessage({
              id: 'grunnlag.sivilstand.title',
            })}
            headerValue={formatertSivilstand}
          >
            <BodyLong>
              <FormattedMessage
                id="grunnlag.sivilstand.ingress"
                values={{
                  ...getFormatMessageValues(),
                }}
              />
            </BodyLong>
          </GrunnlagSection>
        </AccordionItem>

        <GrunnlagUtenlandsopphold
          harForLiteTrygdetid={harForLiteTrygdetid}
          trygdetid={trygdetid}
        />
      </Accordion>
    </section>
  )
}

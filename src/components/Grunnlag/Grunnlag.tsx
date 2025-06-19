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
import { formatInntekt } from '@/utils/inntekt'
import { formatSivilstand } from '@/utils/sivilstand'
import { getFormatMessageValues } from '@/utils/translations'

import { GrunnlagItem } from '../GrunnlagItem'
import { Pensjonsavtaler } from '../Pensjonsavtaler/Pensjonsavtaler'
import { Pensjonsgivendeinntekt } from '../Simulering/Pensjonsgivendeinntekt'
import { GrunnlagAFP } from './GrunnlagAFP'
import { GrunnlagInntekt } from './GrunnlagInntekt'
import { GrunnlagSection } from './GrunnlagSection'
import { GrunnlagUtenlandsopphold } from './GrunnlagUtenlandsopphold'

import styles from './Grunnlag.module.scss'

interface Props {
  visning: BeregningVisning
  headingLevel: HeadingProps['level']
  harForLiteTrygdetid?: boolean
  trygdetid?: number
  pensjonsbeholdning?: number
  isEndring: boolean
}

export const Grunnlag: React.FC<Props> = ({
  visning,
  headingLevel,
  harForLiteTrygdetid,
  trygdetid,
  pensjonsbeholdning,
  isEndring,
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

  const formatertSivilstand = React.useMemo(
    () => formatSivilstand(intl, sivilstand!),
    [sivilstand]
  )

  return (
    <section className={styles.section}>
      <Heading level={headingLevel} size="medium">
        <FormattedMessage id="grunnlag.title" />
      </Heading>

      <HStack gap="8" marginBlock="6 0">
        <GrunnlagItem color="gray">
          <Pensjonsgivendeinntekt goToAvansert={goToAvansert} />
        </GrunnlagItem>

        <GrunnlagItem color="green">
          {!isEndring && <Pensjonsavtaler headingLevel="3" />}
        </GrunnlagItem>

        <GrunnlagItem color="blue">
          <BodyLong>
            {loependeVedtak.harLoependeVedtak ? (
              <>
                <FormattedMessage
                  id="grunnlag.alderspensjon.ingress"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
                {pensjonsbeholdning && pensjonsbeholdning >= 0 && (
                  <FormattedMessage
                    id="grunnlag.alderspensjon.ingress.pensjonsbeholdning"
                    values={{
                      ...getFormatMessageValues(),
                      sum: formatInntekt(pensjonsbeholdning),
                    }}
                  />
                )}
                <FormattedMessage
                  id="grunnlag.alderspensjon.ingress.link"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
              </>
            ) : (
              //TODO: Legg til nytt avsnitt
              <FormattedMessage id="grunnlag.alderspensjon.ingress.link" />
            )}
          </BodyLong>
        </GrunnlagItem>
      </HStack>

      <VStack marginBlock="12 0">
        <Heading level={headingLevel} size="medium">
          <FormattedMessage id="om_deg.title" />
        </Heading>
      </VStack>

      <Accordion>
        {visning === 'enkel' && (
          <AccordionItem name="Grunnlag: Uttaksgrad">
            <GrunnlagSection
              headerTitle={intl.formatMessage({
                id: 'grunnlag.uttaksgrad.title',
              })}
              headerValue="100 %"
            >
              <BodyLong>
                <FormattedMessage
                  id="grunnlag.uttaksgrad.ingress"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
                <br />
                <br />
                <Link href="#" onClick={goToAvansert}>
                  <FormattedMessage id="grunnlag.uttaksgrad.avansert_link" />
                </Link>
              </BodyLong>
            </GrunnlagSection>
          </AccordionItem>
        )}

        {visning === 'enkel' && <GrunnlagInntekt goToAvansert={goToAvansert} />}

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

        <GrunnlagAFP />
      </Accordion>
    </section>
  )
}

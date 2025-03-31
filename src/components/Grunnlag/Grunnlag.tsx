import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import {
  Accordion,
  BodyLong,
  Heading,
  HeadingProps,
  Link,
} from '@navikt/ds-react'

import { AccordionItem } from '@/components/common/AccordionItem'
import { BeregningContext } from '@/pages/Beregning/context'
import { paths } from '@/router/constants'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectSivilstand } from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { BeregningVisning } from '@/types/common-types'
import { formatInntekt } from '@/utils/inntekt'
import { formatSivilstand } from '@/utils/sivilstand'
import { getFormatMessageValues } from '@/utils/translations'

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
}

export const Grunnlag: React.FC<Props> = ({
  visning,
  headingLevel,
  harForLiteTrygdetid,
  trygdetid,
  pensjonsbeholdning,
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { avansertSkjemaModus, setAvansertSkjemaModus } =
    React.useContext(BeregningContext)

  const goToAvansert: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    if (avansertSkjemaModus === 'resultat') {
      setAvansertSkjemaModus('redigering')
    } else {
      dispatch(userInputActions.flushCurrentSimulation())
      navigate(paths.beregningAvansert)
    }
  }

  const intl = useIntl()

  const sivilstand = useAppSelector(selectSivilstand)

  const formatertSivilstand = React.useMemo(
    () => formatSivilstand(intl, sivilstand!),
    [sivilstand]
  )

  return (
    <section className={styles.section}>
      <div className={styles.description}>
        <Heading level={headingLevel} size="medium">
          <FormattedMessage id="grunnlag.title" />
        </Heading>

        <BodyLong>
          <FormattedMessage id="grunnlag.ingress" />
        </BodyLong>
      </div>

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

        <AccordionItem name="Grunnlag: Alderspensjon (NAV)">
          <GrunnlagSection
            headerTitle={intl.formatMessage({
              id: 'grunnlag.alderspensjon.title',
            })}
            headerValue={intl.formatMessage({
              id: 'grunnlag.alderspensjon.value',
            })}
          >
            <BodyLong>
              <FormattedMessage
                id="grunnlag.alderspensjon.ingress"
                values={{
                  ...getFormatMessageValues(),
                }}
              />
              {pensjonsbeholdning && (
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
            </BodyLong>
          </GrunnlagSection>
        </AccordionItem>

        <GrunnlagAFP />
      </Accordion>
    </section>
  )
}

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
import { formatInntekt } from '@/utils/inntekt'
import { formatSivilstand } from '@/utils/sivilstand'
import { getFormatMessageValues } from '@/utils/translations'

import { GrunnlagItem } from '../GrunnlagItem'
import { Pensjonsavtaler } from '../Pensjonsavtaler/Pensjonsavtaler'
import { Pensjonsgivendeinntekt } from '../Simulering/Pensjonsgivendeinntekt'
//import { SanityReadmore } from '../common/SanityReadmore'
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

  const [isAFPDokumentasjonVisible, setIsAFPDokumentasjonVisible] =
    React.useState<boolean>(false)

  const [isAlderspensjonDetaljerVisible, setIsAlderspensjonDetaljerVisible] =
    React.useState<boolean>(false)

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

        <GrunnlagItem color="purple">
          <GrunnlagAFP />
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
            onOpenChange={setIsAFPDokumentasjonVisible}
          >
            <p>Hei, her skal listekomponent for Afp ligge</p>
          </ReadMore>
        </GrunnlagItem>

        {/*TODO: Flytt hele denne i en egen komponent */}
        <GrunnlagItem color="blue">
          <VStack gap="3">
            <Heading level="2" size="small">
              <FormattedMessage id="beregning.highcharts.serie.alderspensjon.name" />
            </Heading>
            <BodyLong>
              {loependeVedtak.harLoependeVedtak ? (
                <>
                  <FormattedMessage
                    id="grunnlag.alderspensjon.endring.ingress"
                    values={{
                      ...getFormatMessageValues(),
                    }}
                  />
                  {pensjonsbeholdning && pensjonsbeholdning >= 0 && (
                    <FormattedMessage
                      id="grunnlag.alderspensjon.endring.ingress.pensjonsbeholdning"
                      values={{
                        ...getFormatMessageValues(),
                        sum: formatInntekt(pensjonsbeholdning),
                      }}
                    />
                  )}
                </>
              ) : (
                <>
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
                    onOpenChange={setIsAlderspensjonDetaljerVisible}
                  >
                    <p>Hei, her skal listekomponent for alderspensjon ligge</p>
                  </ReadMore>
                </>
              )}
              <FormattedMessage
                id="grunnlag.alderspensjon.ingress.link"
                values={{
                  ...getFormatMessageValues(),
                }}
              />
            </BodyLong>
          </VStack>
        </GrunnlagItem>
      </HStack>

      <VStack marginBlock="12 0">
        <Heading level={headingLevel} size="medium">
          <FormattedMessage id="om_deg.title" />
        </Heading>
      </VStack>

      <Accordion>
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
      </Accordion>
    </section>
  )
}

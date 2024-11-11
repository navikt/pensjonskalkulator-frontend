import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, Link, Modal } from '@navikt/ds-react'

import { GrunnlagSection } from '../GrunnlagSection'
import { AccordionItem } from '@/components/common/AccordionItem'
import { UtenlandsoppholdListe } from '@/components/UtenlandsoppholdListe/UtenlandsoppholdListe'
import { paths } from '@/router/constants'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectHarUtenlandsopphold,
  selectCurrentSimulation,
  selectIsEndring,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './GrunnlagUtenlandsopphold.module.scss'

interface Props {
  harForLiteTrygdetid?: boolean
}

export const GrunnlagUtenlandsopphold: React.FC<Props> = ({
  harForLiteTrygdetid,
}) => {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const avbrytModalRef = React.useRef<HTMLDialogElement>(null)
  const harUtenlandsopphold = useAppSelector(selectHarUtenlandsopphold)
  const { formatertUttaksalderReadOnly } = useAppSelector(
    selectCurrentSimulation
  )
  const isEndring = useAppSelector(selectIsEndring)

  const oppholdUtenforNorge = React.useMemo(():
    | 'mindre_enn_5_aar'
    | 'mer_enn_5_aar'
    | 'for_lite_trygdetid'
    | 'endring' => {
    if (isEndring) {
      return 'endring'
    }
    if (harForLiteTrygdetid) {
      return 'for_lite_trygdetid'
    }
    return harUtenlandsopphold ? 'mer_enn_5_aar' : 'mindre_enn_5_aar'
  }, [isEndring, harForLiteTrygdetid, harUtenlandsopphold])

  React.useEffect(() => {
    if (oppholdUtenforNorge === 'for_lite_trygdetid') {
      logger('grunnlag for beregningen', {
        tekst: 'trygdetid',
        data: 'under 5 år',
      })
    } else {
      logger('grunnlag for beregningen', {
        tekst: 'trygdetid',
        data: harUtenlandsopphold ? '5-40 år' : 'over 40 år',
      })
    }
  }, [formatertUttaksalderReadOnly])

  const goToUtenlandsoppholdStep: React.MouseEventHandler<HTMLAnchorElement> = (
    e
  ) => {
    e.preventDefault()
    avbrytModalRef.current?.showModal()
  }

  return (
    <>
      <Modal
        ref={avbrytModalRef}
        header={{
          heading: intl.formatMessage({
            id: 'grunnlag.opphold.avbryt_modal.title',
          }),
        }}
        width="medium"
      >
        <Modal.Footer>
          <Button
            type="button"
            onClick={() => {
              logger('button klikk', { tekst: 'Tilbake til utenlandsopphold' })
              dispatch(
                userInputActions.flushCurrentSimulationUtenomUtenlandsperioder()
              )
              avbrytModalRef.current?.close()
              navigate(paths.utenlandsopphold)
            }}
          >
            {intl.formatMessage({
              id: 'grunnlag.opphold.avbryt_modal.bekreft',
            })}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              avbrytModalRef.current?.close()
            }}
          >
            {intl.formatMessage({
              id: 'grunnlag.opphold.avbryt_modal.avbryt',
            })}
          </Button>
        </Modal.Footer>
      </Modal>
      <AccordionItem name="Grunnlag: Utenlandsopphold">
        <GrunnlagSection
          headerTitle={intl.formatMessage({
            id: `grunnlag.opphold.title.${oppholdUtenforNorge}`,
          })}
          headerValue={intl.formatMessage({
            id: `grunnlag.opphold.value.${oppholdUtenforNorge}`,
          })}
        >
          <>
            {oppholdUtenforNorge === 'endring' && (
              <BodyLong>
                <FormattedMessage
                  id="grunnlag.opphold.ingress.endring"
                  values={{
                    ...getFormatMessageValues(intl),
                  }}
                />
              </BodyLong>
            )}

            {oppholdUtenforNorge === 'mindre_enn_5_aar' && (
              <BodyLong spacing>
                <FormattedMessage
                  id="grunnlag.opphold.ingress.mindre_enn_5_aar"
                  values={{
                    ...getFormatMessageValues(intl),
                  }}
                />
              </BodyLong>
            )}

            {harUtenlandsopphold && (
              <UtenlandsoppholdListe erVisningIGrunnlag />
            )}

            {oppholdUtenforNorge === 'for_lite_trygdetid' && (
              <div className={styles.info}>
                <ExclamationmarkTriangleFillIcon
                  className={`${styles.infoIcon} ${styles.infoIcon__orange}`}
                  fontSize="1.5rem"
                  aria-hidden
                />
                <BodyLong className={styles.infoText}>
                  <FormattedMessage
                    id="grunnlag.opphold.ingress.for_lite_trygdetid"
                    values={{
                      ...getFormatMessageValues(intl),
                    }}
                  />
                </BodyLong>
              </div>
            )}

            {oppholdUtenforNorge !== 'endring' && (
              <BodyLong>
                <FormattedMessage
                  id="grunnlag.opphold.ingress.endre_opphold"
                  values={{
                    ...getFormatMessageValues(intl),
                    link: (
                      <Link href="#" onClick={goToUtenlandsoppholdStep}>
                        <FormattedMessage id="grunnlag.opphold.ingress.endre_opphold.link" />
                      </Link>
                    ),
                  }}
                />
              </BodyLong>
            )}

            {(harUtenlandsopphold ||
              oppholdUtenforNorge === 'for_lite_trygdetid') && (
              <BodyLong className={styles.bunntekst}>
                <FormattedMessage
                  id="grunnlag.opphold.bunntekst"
                  values={{
                    ...getFormatMessageValues(intl),
                  }}
                />
              </BodyLong>
            )}
          </>
        </GrunnlagSection>
      </AccordionItem>
    </>
  )
}

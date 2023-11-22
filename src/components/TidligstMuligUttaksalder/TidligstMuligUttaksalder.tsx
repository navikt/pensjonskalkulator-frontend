import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { InformationSquareFillIcon } from '@navikt/aksel-icons'
import { BodyLong, HelpText } from '@navikt/ds-react'

import Piggybank from '../../assets/piggybank.svg'
import { formatUttaksalder } from '@/components/VelgUttaksalder/utils'
import { logger } from '@/utils/logging'
import { formatMessageValues } from '@/utils/translations'

import { isUttaksalderOver62 } from './utils'

import styles from './TidligsMuligUttaksalder.module.scss'

interface Props {
  tidligstMuligUttak: Alder
  hasAfpOffentlig: boolean
}

export const TidligstMuligUttaksalder: React.FC<Props> = React.memo(
  ({ tidligstMuligUttak, hasAfpOffentlig }) => {
    const intl = useIntl()
    // Legger til observering av attributter på HelpText for logging
    const helpTextRef = React.useRef<HTMLButtonElement>(null)
    const helpTextObserver = React.useMemo(
      () =>
        new MutationObserver((mutationList) => {
          if (
            mutationList.some(
              (mutation) => mutation.attributeName === 'aria-expanded'
            )
          ) {
            const isOpen =
              helpTextRef?.current?.getAttribute('aria-expanded') === 'true'

            if (isOpen) {
              logger('help text åpnet', {
                tekst: 'Tidligst mulig uttak',
              })
            } else {
              logger('help text lukket', {
                tekst: 'Tidligst mulig uttak',
              })
            }
          }
        }),
      []
    )

    React.useEffect(() => {
      if (helpTextRef?.current) {
        helpTextObserver.observe(helpTextRef.current, {
          attributes: true,
        })
      }
      return () => helpTextObserver.disconnect()
    })

    return (
      <div className={styles.wrapper} data-testid="tidligst-mulig-uttak">
        <div className={styles.wrapperCard}>
          <img className={styles.wrapperImage} src={Piggybank} alt="" />
          <div className={styles.wrapperText} aria-live="polite">
            <BodyLong
              size="large"
              className={`${styles.ingress} ${styles.ingress__isInline}`}
            >
              <FormattedMessage
                id="tidligsteuttaksalder.ingress_1"
                values={{
                  ...formatMessageValues,
                }}
              />
            </BodyLong>
            <span className={styles.highlighted}>
              {formatUttaksalder(intl, tidligstMuligUttak)}
              <HelpText ref={helpTextRef} wrapperClassName={styles.helptext}>
                <FormattedMessage
                  id="tidligsteuttaksalder.help"
                  values={{
                    ...formatMessageValues,
                  }}
                />
              </HelpText>
            </span>
            <BodyLong size="large" className={styles.ingress}>
              <FormattedMessage
                id="tidligsteuttaksalder.ingress_2"
                values={{
                  ...formatMessageValues,
                }}
              />
            </BodyLong>
            {hasAfpOffentlig && isUttaksalderOver62(tidligstMuligUttak) && (
              <div className={styles.info}>
                <InformationSquareFillIcon
                  className={styles.infoIcon}
                  fontSize="1.5rem"
                  aria-hidden
                />
                <p className={styles.infoText}>
                  <FormattedMessage
                    id="tidligsteuttaksalder.info_afp"
                    values={{
                      ...formatMessageValues,
                    }}
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

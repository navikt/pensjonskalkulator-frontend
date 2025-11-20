import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Alert } from '@navikt/ds-react'

import { ALERT_VIST } from '@/utils/loggerConstants'
import { logger } from '@/utils/logging'

import styles from './SimuleringAfpOffentligAlert.module.scss'

interface Props {
  harSamtykketOffentligAFP: boolean | null
  isAfpOffentligLivsvarigSuccess: boolean
  loependeLivsvarigAfpOffentlig?: AfpOffentligLivsvarig
}

export const SimuleringAfpOffentligAlert: React.FC<Props> = ({
  harSamtykketOffentligAFP,
  isAfpOffentligLivsvarigSuccess,
  loependeLivsvarigAfpOffentlig,
}) => {
  const intl = useIntl()

  // Viser ikke alert hvis brukeren ikke har samtykket til AFP offentlig
  if (!harSamtykketOffentligAFP) {
    return null
  }

  // Kall feilet - vis warning alert
  if (!isAfpOffentligLivsvarigSuccess) {
    const alertText = 'beregning.alert.feil.afp-offentlig-livsvarig'
    const variant = 'warning'

    logger(ALERT_VIST, {
      tekst: `AFP Offentlig: ${intl.formatMessage({ id: alertText })}`,
      variant,
    })

    return (
      <Alert
        variant={variant}
        data-testid="alert-afp-offentlig-livsvarig-failed"
        data-intl={alertText}
        className={styles.alert}
      >
        <FormattedMessage id={alertText} />
      </Alert>
    )
  }

  // Kall var vellykket, men beløp er ikke definert - vis success alert
  if (
    isAfpOffentligLivsvarigSuccess &&
    !loependeLivsvarigAfpOffentlig?.beloep
  ) {
    const alertText = 'beregning.alert.success.afp-offentlig-livsvarig'
    const variant = 'success'

    logger(ALERT_VIST, {
      tekst: `AFP Offentlig: ${intl.formatMessage({ id: alertText })}`,
      variant,
    })

    return (
      <Alert
        variant={variant}
        data-testid="alert-afp-offentlig-livsvarig-success"
        data-intl={alertText}
        className={styles.alert}
      >
        <FormattedMessage id={alertText} />
      </Alert>
    )
  }

  return null
}

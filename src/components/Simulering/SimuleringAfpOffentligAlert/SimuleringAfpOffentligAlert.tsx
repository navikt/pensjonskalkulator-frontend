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

  // Viser ikke alert hvis kallet aldri ble forsøkt (query ble skippet)
  if (!isAfpOffentligLivsvarigSuccess && !loependeLivsvarigAfpOffentlig) {
    return null
  }

  // Viser ikke alert hvis brukeren ikke har samtykket til AFP offentlig
  if (!harSamtykketOffentligAFP) {
    return null
  }

  // Viser ikke alert hvis bruker ikke har vedtak om afp offentlig
  if (
    isAfpOffentligLivsvarigSuccess &&
    loependeLivsvarigAfpOffentlig?.afpStatus === false
  ) {
    return null
  }

  if (
    loependeLivsvarigAfpOffentlig?.afpStatus === null &&
    loependeLivsvarigAfpOffentlig?.afpStatus === null
  ) {
    return null
  }

  // Kall feilet
  if (
    !isAfpOffentligLivsvarigSuccess ||
    (loependeLivsvarigAfpOffentlig?.afpStatus &&
      loependeLivsvarigAfpOffentlig?.maanedligBeloep === 0)
  ) {
    const alertText = 'beregning.alert.feil.afp-offentlig-livsvarig'

    logger(ALERT_VIST, {
      tekst: `AFP Offentlig: ${intl.formatMessage({ id: alertText })}`,
      variant: 'warning',
    })

    return (
      <Alert
        variant="warning"
        data-testid="alert-afp-offentlig-livsvarig-failed"
        data-intl={alertText}
        className={styles.alert}
      >
        <FormattedMessage id={alertText} />
      </Alert>
    )
  }

  // Kall var vellykket, men beløp er ikke definert
  if (
    isAfpOffentligLivsvarigSuccess &&
    !loependeLivsvarigAfpOffentlig?.maanedligBeloep
  ) {
    const alertText = 'beregning.alert.success.afp-offentlig-livsvarig'

    logger(ALERT_VIST, {
      tekst: `AFP Offentlig: ${intl.formatMessage({ id: alertText })}`,
      variant: 'warning',
    })

    return (
      <Alert
        variant="warning"
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

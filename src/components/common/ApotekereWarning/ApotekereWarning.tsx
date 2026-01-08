import { FormattedMessage } from 'react-intl'

import { LocalAlert } from '@navikt/ds-react'

import { ALERT_VIST } from '@/utils/loggerConstants'
import { logger } from '@/utils/logging'

import styles from './ApotekereWarning.module.scss'

export const ApotekereWarning = ({ showWarning }: { showWarning: boolean }) => {
  if (!showWarning) return null

  logger(ALERT_VIST, {
    tekst:
      'Beregning med AFP for apotekvirksomhet (POA) er for øyeblikket feil',
    variant: 'warning',
  })

  return (
    <LocalAlert
      className={styles.alertWrapper}
      status="warning"
      data-testid="apotekere-warning"
    >
      <LocalAlert.Content>
        <FormattedMessage id="error.apoteker_warning" />
      </LocalAlert.Content>
    </LocalAlert>
  )
}

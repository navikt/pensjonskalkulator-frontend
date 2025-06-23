import { FormattedMessage } from 'react-intl'

import { Alert } from '@navikt/ds-react'

export const ApotekereWarning = ({ showWarning }: { showWarning: boolean }) => {
  if (!showWarning) return null

  return (
    <Alert variant="warning">
      <FormattedMessage id="error.apoteker_warning" />
    </Alert>
  )
}

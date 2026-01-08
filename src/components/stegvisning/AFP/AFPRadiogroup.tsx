// src/components/common/AFPRadioGroup.tsx
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { LocalAlert, Radio, RadioGroup } from '@navikt/ds-react'

import { ALERT_VIST } from '@/utils/loggerConstants'
import { logger } from '@/utils/logging'

import styles from './AFP.module.scss'

interface AFPRadioGroupProps {
  afp: string | null
  handleRadioChange: (value: AfpRadio) => void
  validationError: string | undefined
  showApotekerAlert: boolean
  showVetIkkeAlert: boolean
}

const AFPRadioGroup: React.FC<AFPRadioGroupProps> = ({
  afp,
  handleRadioChange,
  validationError,
  showApotekerAlert,
  showVetIkkeAlert,
}) => {
  if (showApotekerAlert) {
    logger(ALERT_VIST, {
      tekst:
        'Beregning med AFP for apotekvirksomhet (POA) er for øyeblikket feil',
      variant: 'warning',
    })
  }

  return (
    <RadioGroup
      className={styles.radiogroup}
      legend={<FormattedMessage id="stegvisning.afp.radio_label" />}
      name="afp"
      data-testid="afp-radio-group"
      defaultValue={afp}
      onChange={handleRadioChange}
      error={validationError}
    >
      <Radio value="ja_offentlig" data-testid="afp-radio-ja-offentlig">
        <FormattedMessage id="stegvisning.afp.radio_ja_offentlig" />
      </Radio>
      {showApotekerAlert && (
        <LocalAlert
          className={styles.alert}
          status="warning"
          aria-live="polite"
          data-testid="apotekere-warning"
        >
          <LocalAlert.Content>
            <FormattedMessage id="error.apoteker_warning" />
          </LocalAlert.Content>
        </LocalAlert>
      )}
      <Radio value="ja_privat" data-testid="afp-radio-ja-privat">
        <FormattedMessage id="stegvisning.afp.radio_ja_privat" />
      </Radio>
      <Radio value="nei" data-testid="afp-radio-nei">
        <FormattedMessage id="stegvisning.afp.radio_nei" />
      </Radio>
      <Radio value="vet_ikke" data-testid="afp-radio-vet-ikke">
        <FormattedMessage id="stegvisning.afp.radio_vet_ikke" />
      </Radio>
      {showVetIkkeAlert && (
        <LocalAlert className={styles.alert} status="announcement" aria-live="polite">
          <LocalAlert.Content>
            <FormattedMessage id="stegvisning.afp.alert_vet_ikke" />
          </LocalAlert.Content>
        </LocalAlert>
      )}
    </RadioGroup>
  )
}

export default AFPRadioGroup

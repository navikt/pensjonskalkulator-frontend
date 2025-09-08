// src/components/common/AFPRadioGroup.tsx
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Alert, Radio, RadioGroup } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectHasErApotekerError } from '@/state/session/selectors'
import { selectFoedselsdato } from '@/state/userInput/selectors'
import { isFoedtEtter1963 } from '@/utils/alder'

import styles from './AFP.module.scss'

interface AFPRadioGroupProps {
  afp: string | null
  handleRadioChange: (value: AfpRadio) => void
  validationError: string | undefined
  showVetIkkeAlert: boolean
}

const AFPRadioGroup: React.FC<AFPRadioGroupProps> = ({
  afp,
  handleRadioChange,
  validationError,
  showVetIkkeAlert,
}) => {
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const foedtEtter1963 = isFoedtEtter1963(foedselsdato)
  const hasErApotekerError = useAppSelector(selectHasErApotekerError)

  return (
    <RadioGroup
      className={styles.radiogroup}
      legend={<FormattedMessage id="stegvisning.afp.radio_label" />}
      name="afp"
      defaultValue={afp}
      onChange={handleRadioChange}
      error={validationError}
    >
      <Radio value="ja_offentlig">
        <FormattedMessage id="stegvisning.afp.radio_ja_offentlig" />
        {hasErApotekerError && foedtEtter1963 && (
          <Alert className={styles.alert} variant="warning" aria-live="polite">
            <FormattedMessage id="stegvisning.afp.alert_erkjenner_feil" />
          </Alert>
        )}
      </Radio>
      <Radio value="ja_privat">
        <FormattedMessage id="stegvisning.afp.radio_ja_privat" />
      </Radio>
      <Radio value="nei">
        <FormattedMessage id="stegvisning.afp.radio_nei" />
      </Radio>
      <Radio value="vet_ikke">
        <FormattedMessage id="stegvisning.afp.radio_vet_ikke" />
      </Radio>
      {showVetIkkeAlert && (
        <Alert className={styles.alert} variant="info" aria-live="polite">
          <FormattedMessage id="stegvisning.afp.alert_vet_ikke" />
        </Alert>
      )}
    </RadioGroup>
  )
}

export default AFPRadioGroup

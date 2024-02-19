import React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@navikt/ds-react'

import { BeregningContext } from '@/pages/Beregning/context'
import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'

import { FORM_NAMES } from './utils'

import styles from './FormButtonRow.module.scss'

export const FormButtonRow: React.FC<{
  resetForm: () => void
  gaaTilResultat: () => void
}> = ({ resetForm, gaaTilResultat }) => {
  const intl = useIntl()
  const { harAvansertSkjemaUnsavedChanges } = React.useContext(BeregningContext)
  const { uttaksalder } = useAppSelector(selectCurrentSimulation)

  return (
    <div className={styles.wrapper}>
      <hr className={styles.separator} />
      <div>
        <Button
          form={FORM_NAMES.form}
          className={`${styles.button} ${styles.buttonSubmit}`}
        >
          {intl.formatMessage({
            id:
              uttaksalder && harAvansertSkjemaUnsavedChanges
                ? 'beregning.avansert.button.oppdater'
                : 'beregning.avansert.button.beregn',
          })}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
          className={styles.button}
        >
          {intl.formatMessage({
            id: 'beregning.avansert.button.nullstill',
          })}
        </Button>
      </div>
      {uttaksalder && harAvansertSkjemaUnsavedChanges && (
        <div>
          <Button
            type="button"
            variant="tertiary"
            className={styles.button}
            onClick={gaaTilResultat}
          >
            {intl.formatMessage({
              id: 'beregning.avansert.button.avbryt',
            })}
          </Button>
        </div>
      )}
    </div>
  )
}

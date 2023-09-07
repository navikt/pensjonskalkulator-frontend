import { FormEvent, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Ingress, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { Card } from '@/components/components/Card'
import { formatSivilstand } from '@/utils/sivilstand'

import styles from './Sivilstand.module.scss'
import logger, { wrapLogger } from '@/utils/logging'

interface Props {
  sivilstand: Sivilstand
  harSamboer: boolean | null
  onCancel: () => void
  onPrevious: () => void
  onNext: (sivilstandData: SivilstandRadio) => void
}

export type SivilstandRadio = 'ja' | 'nei'

export function Sivilstand({
  sivilstand,
  harSamboer,
  onCancel,
  onPrevious,
  onNext,
}: Props) {
  const intl = useIntl()
  const [validationError, setValidationError] = useState<string>('')

  const formatertSivilstand = useMemo(
    () => formatSivilstand(sivilstand).toLowerCase(),
    [sivilstand]
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const sivilstandData = data.get('sivilstand') as SivilstandRadio | undefined

    if (!sivilstandData) {
      setValidationError(
        intl.formatMessage({
          id: 'stegvisning.sivilstand.validation_error',
        })
      )
    } else {
      logger('radiogroup valgt', {
        tekst: 'Samboer',
        valg: sivilstandData,
      })
      onNext(sivilstandData)
    }
  }

  const handleRadioChange = (): void => {
    setValidationError('')
  }

  return (
    <Card aria-live="polite" hasLargePadding hasMargin>
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.sivilstand.title" />
        </Heading>
        <Ingress className={styles.ingress}>
          <FormattedMessage id="stegvisning.sivilstand.ingress_1" />
          {formatertSivilstand}
          <FormattedMessage id="stegvisning.sivilstand.ingress_2" />
        </Ingress>
        <RadioGroup
          legend={<FormattedMessage id="stegvisning.sivilstand.radio_label" />}
          name="sivilstand"
          className={styles.radiogroup}
          defaultValue={harSamboer ? 'ja' : harSamboer === false ? 'nei' : null}
          onChange={handleRadioChange}
          error={validationError}
          aria-required="true"
        >
          <Radio value="ja">
            <FormattedMessage id="stegvisning.sivilstand.radio_ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="stegvisning.sivilstand.radio_nei" />
          </Radio>
        </RadioGroup>
        <Button type="submit" className={styles.button}>
          <FormattedMessage id="stegvisning.beregn" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="secondary"
          onClick={wrapLogger('button klikk', { tekst: 'Tilbake' })(onPrevious)}
        >
          <FormattedMessage id="stegvisning.tilbake" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="tertiary"
          onClick={wrapLogger('button klikk', { tekst: 'Avbryt' })(onCancel)}
        >
          <FormattedMessage id="stegvisning.avbryt" />
        </Button>
      </form>
    </Card>
  )
}

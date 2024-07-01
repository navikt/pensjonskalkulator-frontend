import { FormEvent, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { ReadMore } from '@/components/common/ReadMore'
import { logger, wrapLogger } from '@/utils/logging'

import styles from './Utenlandsopphold.module.scss'

interface Props {
  harUtenlandsopphold: boolean | null
  onCancel?: () => void
  onPrevious: () => void
  onNext: (utenlandsoppholdData: BooleanRadio) => void
}

export function Utenlandsopphold({
  harUtenlandsopphold,
  onCancel,
  onPrevious,
  onNext,
}: Props) {
  const intl = useIntl()
  const [validationError, setValidationError] = useState<string>('')

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const utenlandsoppholdData = data.get('utenlandsopphold') as
      | BooleanRadio
      | undefined

    if (!utenlandsoppholdData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.utenlandsopphold.validation_error',
      })
      setValidationError(tekst)
      logger('valideringsfeil', {
        data: intl.formatMessage({
          id: 'stegvisning.utenlandsopphold.radio_label',
        }),
        tekst,
      })
    } else {
      logger('radiogroup valgt', {
        tekst: 'Utenlandsopphold',
        valg: utenlandsoppholdData,
      })
      logger('button klikk', {
        tekst: 'Neste',
      })
      onNext(utenlandsoppholdData)
    }
  }

  const handleRadioChange = (): void => {
    setValidationError('')
  }

  return (
    <Card hasLargePadding hasMargin>
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.utenlandsopphold.title" />
        </Heading>
        <BodyLong size="large">
          <FormattedMessage id="stegvisning.utenlandsopphold.ingress" />
        </BodyLong>
        <ReadMore
          name="Om hva som er opphold utenfor Norge"
          className={styles.readmore1}
          header={
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_opphold_utenfor_norge.title" />
          }
        >
          <FormattedMessage id="stegvisning.utenlandsopphold.readmore_opphold_utenfor_norge.ingress" />
        </ReadMore>
        <ReadMore
          name="Om konsekvenser av opphold i utlandet"
          className={styles.readmore2}
          header={
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_konsekvenser.title" />
          }
        >
          <FormattedMessage id="stegvisning.utenlandsopphold.readmore_konsekvenser.ingress" />
        </ReadMore>
        <RadioGroup
          className={styles.radiogroup}
          legend={
            <FormattedMessage id="stegvisning.utenlandsopphold.radio_label" />
          }
          description={
            <FormattedMessage id="stegvisning.utenlandsopphold.radio_label.description" />
          }
          name="utenlandsopphold"
          defaultValue={
            harUtenlandsopphold
              ? 'ja'
              : harUtenlandsopphold === false
                ? 'nei'
                : null
          }
          onChange={handleRadioChange}
          error={validationError}
          role="radiogroup"
          aria-required="true"
        >
          <Radio value="ja">
            <FormattedMessage id="stegvisning.utenlandsopphold.radio_ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="stegvisning.utenlandsopphold.radio_nei" />
          </Radio>
        </RadioGroup>

        <Button type="submit" className={styles.button}>
          <FormattedMessage id="stegvisning.neste" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="secondary"
          onClick={wrapLogger('button klikk', { tekst: 'Tilbake' })(onPrevious)}
        >
          <FormattedMessage id="stegvisning.tilbake" />
        </Button>
        {onCancel && (
          <Button
            type="button"
            className={styles.button}
            variant="tertiary"
            onClick={wrapLogger('button klikk', { tekst: 'Avbryt' })(onCancel)}
          >
            <FormattedMessage id="stegvisning.avbryt" />
          </Button>
        )}
      </form>
    </Card>
  )
}

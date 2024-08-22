import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { ReadMore } from '@/components/common/ReadMore'
import { UtenlandsoppholdListe } from '@/components/UtenlandsoppholdListe/UtenlandsoppholdListe'
import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulationUtenlandsperioder } from '@/state/userInput/selectors'
import { wrapLogger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import { onSubmit } from './utils'

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

  const utenlandsperioder = useAppSelector(
    selectCurrentSimulationUtenlandsperioder
  )

  const [validationErrors, setValidationErrors] = React.useState<
    Record<'top' | 'bottom', string>
  >({
    top: '',
    bottom: '',
  })

  const [showUtenlandsperioder, setShowUtenlandsperioder] =
    React.useState<boolean>(!!harUtenlandsopphold)

  // TODO legge til test
  React.useEffect(() => {
    if (validationErrors.bottom && utenlandsperioder.length > 0) {
      setValidationErrors((prevState) => {
        return {
          ...prevState,
          bottom: '',
        }
      })
    }
  }, [utenlandsperioder])

  const handleRadioChange = (value: BooleanRadio): void => {
    setShowUtenlandsperioder(value === 'ja')
    setValidationErrors({ top: '', bottom: '' })
  }

  return (
    <Card hasLargePadding hasMargin>
      <form
        id="har-utenlandsopphold"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          onSubmit(
            data.get('har-utenlandsopphold-radio'),
            intl,
            setValidationErrors,
            utenlandsperioder.length,
            onNext
          )
        }}
      ></form>
      <Heading level="2" size="medium" spacing>
        <FormattedMessage id="stegvisning.utenlandsopphold.title" />
      </Heading>
      <BodyLong size="large">
        <FormattedMessage id="stegvisning.utenlandsopphold.ingress" />
      </BodyLong>
      <ReadMore
        name="Hva som er opphold utenfor Norge"
        className={styles.readmore1}
        header={
          <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.title" />
        }
      >
        <FormattedMessage
          id="stegvisning.utenlandsopphold.readmore_1.opphold.subtitle"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
        <ul>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.opphold.list_item1" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.opphold.list_item2" />
          </li>
        </ul>
        <FormattedMessage
          id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.subtitle"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
        <ul>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item1" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item2" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item3" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item4" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item5" />
          </li>
          <li>
            <FormattedMessage id="stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item6" />
          </li>
        </ul>
        <FormattedMessage
          id="stegvisning.utenlandsopphold.readmore_1.ingress"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
      </ReadMore>
      <ReadMore
        name="Betydning av opphold utenfor Norge for pensjon"
        className={styles.readmore2}
        header={
          <FormattedMessage id="stegvisning.utenlandsopphold.readmore_2.title" />
        }
      >
        <FormattedMessage
          id="stegvisning.utenlandsopphold.readmore_2.ingress"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
      </ReadMore>
      <RadioGroup
        name="har-utenlandsopphold-radio"
        className={styles.radiogroup}
        legend={
          <FormattedMessage id="stegvisning.utenlandsopphold.radio_label" />
        }
        description={
          <FormattedMessage id="stegvisning.utenlandsopphold.radio_label.description" />
        }
        defaultValue={
          harUtenlandsopphold
            ? 'ja'
            : harUtenlandsopphold === false
              ? 'nei'
              : null
        }
        onChange={handleRadioChange}
        error={validationErrors.top}
        role="radiogroup"
        aria-required="true"
      >
        <Radio form="har-utenlandsopphold" value="ja">
          <FormattedMessage id="stegvisning.utenlandsopphold.radio_ja" />
        </Radio>
        <Radio form="har-utenlandsopphold" value="nei">
          <FormattedMessage id="stegvisning.utenlandsopphold.radio_nei" />
        </Radio>
      </RadioGroup>
      {
        //  TODO skrive tester for å dekke visning av utenlandsperioder
      }
      {showUtenlandsperioder && (
        <UtenlandsoppholdListe validationError={validationErrors.bottom} />
      )}
      <Button
        form="har-utenlandsopphold"
        type="submit"
        className={styles.button}
      >
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
    </Card>
  )
}

import { FormEvent, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { ApotekereWarning } from '@/components/common/ApotekereWarning/ApotekereWarning'
import { Card } from '@/components/common/Card'
import { paths } from '@/router/constants'
import { useAppSelector } from '@/state/hooks'
import { selectHasErApotekerError } from '@/state/session/selectors'
import { selectAfp, selectFoedselsdato } from '@/state/userInput/selectors'
import { isFoedtEtter1963 } from '@/utils/alder'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import Navigation from '../Navigation/Navigation'
import { STEGVISNING_FORM_NAMES } from '../utils'

import styles from './SamtykkeOffentligAFP.module.scss'

interface Props {
  harSamtykket: boolean | null
  onCancel?: () => void
  onPrevious: () => void
  onNext: (samtykkeData: BooleanRadio) => void
}

export function SamtykkeOffentligAFP({
  harSamtykket,
  onCancel,
  onPrevious,
  onNext,
}: Props) {
  const intl = useIntl()
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const foedtEtter1963 = isFoedtEtter1963(foedselsdato)
  const hasErApotekerError = useAppSelector(selectHasErApotekerError)
  const afp = useAppSelector(selectAfp)

  const [validationError, setValidationError] = useState<string>('')

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const samtykkeData = data.get('samtykke-offentlig-afp') as
      | BooleanRadio
      | undefined

    if (!samtykkeData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.samtykke_offentlig_afp.validation_error',
      })
      setValidationError(tekst)
      logger('skjemavalidering feilet', {
        skjemanavn: STEGVISNING_FORM_NAMES.samtykkeOffentligAFP,
        data: intl.formatMessage({
          id: 'stegvisning.samtykke_offentlig_afp.radio_label',
        }),
        tekst,
      })
    } else {
      logger('radiogroup valgt', {
        tekst: 'Samtykke Offentlig AFP',
        valg: samtykkeData,
      })
      // TODO: fjern når amplitude er ikke i bruk lenger
      logger('button klikk', {
        tekst: `Neste fra ${paths.samtykkeOffentligAFP}`,
      })
      logger('knapp klikket', {
        tekst: `Neste fra ${paths.samtykkeOffentligAFP}`,
      })
      onNext(samtykkeData)
    }
  }

  const handleRadioChange = (): void => {
    setValidationError('')
  }

  return (
    <Card hasLargePadding hasMargin>
      <ApotekereWarning
        showWarning={Boolean(
          afp === 'ja_offentlig' && hasErApotekerError && foedtEtter1963
        )}
      />
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.samtykke_offentlig_afp.title" />
        </Heading>
        <BodyLong size="large">
          <FormattedMessage
            id="stegvisning.samtykke_offentlig_afp.ingress"
            values={{ ...getFormatMessageValues() }}
          />
        </BodyLong>

        <RadioGroup
          className={styles.radiogroup}
          legend={
            <FormattedMessage id="stegvisning.samtykke_offentlig_afp.radio_label" />
          }
          description={
            <FormattedMessage id="stegvisning.samtykke_offentlig_afp.radio_description" />
          }
          name="samtykke-offentlig-afp"
          defaultValue={
            harSamtykket ? 'ja' : harSamtykket === false ? 'nei' : null
          }
          onChange={handleRadioChange}
          error={validationError}
        >
          <Radio value="ja">
            <FormattedMessage id="stegvisning.samtykke_offentlig_afp.radio_ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="stegvisning.samtykke_offentlig_afp.radio_nei" />
          </Radio>
        </RadioGroup>

        <Navigation onPrevious={onPrevious} onCancel={onCancel} />
      </form>
    </Card>
  )
}

import { FormEvent, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Alert, BodyLong, Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { ApotekereWarning } from '@/components/common/ApotekereWarning/ApotekereWarning'
import { Card } from '@/components/common/Card'
import { SanityReadmore } from '@/components/common/SanityReadmore/SanityReadmore'
import { paths } from '@/router/constants'
import { useAppSelector } from '@/state/hooks'
import { selectHasErApotekerError } from '@/state/session/selectors'
import {
  selectAfp,
  selectFoedselsdato,
  selectLoependeVedtak,
  selectSkalBeregneAfpKap19,
} from '@/state/userInput/selectors'
import { isFoedtEtter1963 } from '@/utils/alder'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import Navigation from '../Navigation/Navigation'
import { STEGVISNING_FORM_NAMES } from '../utils'

import styles from './SamtykkePensjonsavtaler.module.scss'

interface Props {
  harSamtykket: boolean | null
  onCancel?: () => void
  onPrevious: () => void
  onNext: (samtykkeData: BooleanRadio) => void
  erApoteker: boolean
  isKap19: boolean
}

export function SamtykkePensjonsavtaler({
  harSamtykket,
  onCancel,
  onPrevious,
  onNext,
  erApoteker,
  isKap19,
}: Props) {
  const intl = useIntl()

  const foedselsdato = useAppSelector(selectFoedselsdato)
  const foedtEtter1963 = isFoedtEtter1963(foedselsdato)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const skalBeregneAfpKap19 = useAppSelector(selectSkalBeregneAfpKap19)
  const hasErApotekerError = useAppSelector(selectHasErApotekerError)
  const afp = useAppSelector(selectAfp)

  const [validationError, setValidationError] = useState<string>('')

  const [jaPensjonsavtaler, setJaPensjonsavtaler] = useState<boolean | null>(
    null
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const samtykkeData = data.get('samtykke') as BooleanRadio | undefined

    if (!samtykkeData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.samtykke_pensjonsavtaler.validation_error',
      })
      setValidationError(tekst)
      logger('skjemavalidering feilet', {
        skjemanavn: STEGVISNING_FORM_NAMES.samtykkePensjonsavtaler,
        data: intl.formatMessage({
          id: 'stegvisning.samtykke_pensjonsavtaler.radio_label',
        }),
        tekst,
      })
    } else {
      logger('radiogroup valgt', {
        tekst: 'Samtykke',
        valg: samtykkeData,
      })
      logger('knapp klikket', {
        tekst: `Neste fra ${paths.samtykke}`,
      })
      onNext(samtykkeData)
    }
  }

  const handleRadioChange = (value: string): void => {
    setValidationError('')
    setJaPensjonsavtaler(value === 'ja')
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
          <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.title" />
        </Heading>
        <BodyLong size="large">
          <FormattedMessage
            id="stegvisning.samtykke_pensjonsavtaler.ingress"
            values={getFormatMessageValues()}
          />
        </BodyLong>

        {isKap19 && !loependeVedtak.harLoependeVedtak ? (
          // kap19 uten løpende vedtak
          <>
            <SanityReadmore
              id="dette_henter_vi_OFTP"
              data-testid="dette_henter_vi_OFTP"
              className={styles.readmoreOffentlig}
            />
            <SanityReadmore
              id="dette_henter_vi_NP"
              className={styles.readmorePrivat}
            />
          </>
        ) : isKap19 || erApoteker ? (
          // kap19 med løpende vedtak eller apoteker
          <>
            <SanityReadmore
              id="dette_henter_vi_NP"
              className={styles.readmoreOffentlig}
            />
            <SanityReadmore
              id="dette_sjekker_vi_OFTP"
              data-testid="dette_sjekker_vi_OFTP"
              className={styles.readmorePrivat}
            />
          </>
        ) : (
          // alle andre
          <>
            <SanityReadmore
              id="dette_henter_vi_OFTP"
              data-testid="dette_henter_vi_OFTP"
              className={styles.readmoreOffentlig}
            />
            <SanityReadmore
              id="dette_henter_vi_NP"
              className={styles.readmorePrivat}
            />
          </>
        )}

        <RadioGroup
          className={styles.radiogroup}
          legend={
            <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.radio_label" />
          }
          description={
            <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.radio_description" />
          }
          name="samtykke"
          defaultValue={
            harSamtykket ? 'ja' : harSamtykket === false ? 'nei' : null
          }
          onChange={handleRadioChange}
          error={validationError}
        >
          <Radio value="ja">
            <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.radio_ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.radio_nei" />
          </Radio>
        </RadioGroup>
        {!loependeVedtak.harLoependeVedtak &&
          skalBeregneAfpKap19 &&
          jaPensjonsavtaler === false && (
            <Alert variant="info" size="medium">
              <FormattedMessage id="stegvisning.samtykke_pensjonsavtaler.alert" />
            </Alert>
          )}

        <Navigation onPrevious={onPrevious} onCancel={onCancel} />
      </form>
    </Card>
  )
}

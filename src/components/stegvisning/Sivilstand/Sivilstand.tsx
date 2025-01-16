import React from 'react'
import { FormEvent, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Select,
} from '@navikt/ds-react'

import { STEGVISNING_FORM_NAMES } from '../utils'
import { Card } from '@/components/common/Card'
import { paths } from '@/router/constants'
import { logger, wrapLogger } from '@/utils/logging'
import { formatSivilstand } from '@/utils/sivilstand'

import styles from './Sivilstand.module.scss'

interface Props {
  shouldRedirectTo?: string
  sivilstand: Sivilstand
  harSamboer: boolean | null
  epsHarInntektOver2G: boolean | null
  epsHarPensjon: boolean | null
  onCancel?: () => void
  onPrevious: () => void
  onNext: (sivilstandData: BooleanRadio) => void
}

export function Sivilstand({
  shouldRedirectTo,
  sivilstand,
  harSamboer,
  epsHarInntektOver2G,
  epsHarPensjon,
  onCancel,
  onPrevious,
  onNext,
}: Props) {
  const intl = useIntl()
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState<string>('')
  const sivilstandOptions = [
    'gift',
    'ugift',
    'gjenlevende_partner',
    'skilt',
    'separert',
    'registrert_partner',
    'separert_partner',
    'skilt_partner',
    'enke_enkemann',
    'samboer',
  ]

  React.useEffect(() => {
    if (shouldRedirectTo) {
      navigate(shouldRedirectTo)
    }
  }, [shouldRedirectTo])

  const formatertSivilstand = useMemo(
    () => formatSivilstand(intl, sivilstand).toLowerCase(),
    [sivilstand]
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const sivilstandData = data.get('sivilstand') as BooleanRadio | undefined

    if (!sivilstandData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.sivilstand.validation_error',
      })
      setValidationError(tekst)
      logger('skjema validering feilet', {
        skjemanavn: STEGVISNING_FORM_NAMES.sivilstand,
        data: intl.formatMessage({
          id: 'stegvisning.sivilstand.radio_label',
        }),
        tekst,
      })
    } else {
      logger('radiogroup valgt', {
        tekst: 'Samboer',
        valg: sivilstandData,
      })
      logger('button klikk', {
        tekst: `Neste fra ${paths.sivilstand}`,
      })
      onNext(sivilstandData)
    }
  }

  const handleRadioChange = (): void => {
    setValidationError('')
  }

  if (shouldRedirectTo) {
    return null
  }

  return (
    <Card hasLargePadding hasMargin>
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.sivilstand.title" />
        </Heading>
        <BodyLong size="large" className={styles.ingress}>
          <FormattedMessage id="stegvisning.sivilstand.ingress_1" />
          {formatertSivilstand}
          <FormattedMessage id="stegvisning.sivilstand.ingress_2" />
        </BodyLong>
        <RadioGroup
          legend={<FormattedMessage id="stegvisning.sivilstand.radio_label" />}
          name="sivilstand"
          className={styles.radiogroup}
          defaultValue={harSamboer ? 'ja' : harSamboer === false ? 'nei' : null}
          onChange={handleRadioChange}
          error={validationError}
          role="radiogroup"
          aria-required="true"
        >
          <Radio value="ja">
            <FormattedMessage id="stegvisning.sivilstand.radio_ja" />
          </Radio>
          <Radio value="nei">
            <FormattedMessage id="stegvisning.sivilstand.radio_nei" />
          </Radio>
        </RadioGroup>
        <Select
          //defaultValue={harSamboer ? 'ja' : harSamboer === false ? 'nei' : null}
          label={intl.formatMessage({
            id: `stegvisning.sivilstand.select_label`,
          })}
          description={intl.formatMessage({
            id: `stegvisning.sivilstand.select_description`,
          })}
        >
          {sivilstandOptions.map((option) => (
            <option key={option} value={option}>
              {intl.formatMessage({
                id: `sivilstand.${option}`,
              })}
            </option>
          ))}
        </Select>
        <RadioGroup
          legend={
            <FormattedMessage id="stegvisning.sivilstand.radio_epsHarPensjon_label" />
          }
          description={intl.formatMessage({
            id: 'stegvisning.sivilstand.radio_epsHarPensjon_description',
          })}
          name="epsHarPensjon"
          className={styles.radiogroup}
          value={epsHarPensjon}
          onChange={handleRadioChange}
          error={validationError}
          role="radiogroup"
          aria-required="true"
        >
          <Radio value={true}>
            <FormattedMessage id="stegvisning.sivilstand.radio_ja" />
          </Radio>
          <Radio value={false}>
            <FormattedMessage id="stegvisning.sivilstand.radio_nei" />
          </Radio>
        </RadioGroup>
        <RadioGroup
          legend={
            <FormattedMessage id="stegvisning.sivilstand.radio_epsHarInntektOver2G_label" />
          }
          description={intl.formatMessage({
            id: 'stegvisning.sivilstand.radio_epsHarInntektOver2G_description',
          })}
          name="epsHarInntektOver2G"
          className={styles.radiogroup}
          value={epsHarInntektOver2G}
          onChange={handleRadioChange}
          error={validationError}
          role="radiogroup"
          aria-required="true"
        >
          <Radio value={true}>
            <FormattedMessage id="stegvisning.sivilstand.radio_ja" />
          </Radio>
          <Radio value={false}>
            <FormattedMessage id="stegvisning.sivilstand.radio_nei" />
          </Radio>
        </RadioGroup>
        <Button type="submit" className={styles.button}>
          <FormattedMessage id="stegvisning.neste" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="secondary"
          onClick={wrapLogger('button klikk', {
            tekst: `Tilbake fra ${paths.sivilstand}`,
          })(onPrevious)}
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

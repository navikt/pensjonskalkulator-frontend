import { FormEvent } from 'react'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import {
  Alert,
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
} from '@navikt/ds-react'

import { STEGVISNING_FORM_NAMES } from '../../utils'
import styles from '../AFP.module.scss'
import { Card } from '@/components/common/Card'
import { ReadMore } from '@/components/common/ReadMore'
import { paths } from '@/router/constants'
import { logger, wrapLogger } from '@/utils/logging'
import {
  convertBooleanRadioToBoolean,
  convertBooleanToBooleanRadio,
} from '@/utils/radio'
import { getFormatMessageValues } from '@/utils/translations'

interface Props {
  afp: AfpRadio | null
  skalBeregneAfp: boolean | null
  onCancel?: () => void
  onPrevious: () => void
  onNext: (afpData: AfpRadio, skalBeregneAfp?: boolean | null) => void
}

export function AFPOvergangskullUtenAP({
  afp,
  skalBeregneAfp,
  onCancel,
  onPrevious,
  onNext,
}: Props) {
  const intl = useIntl()

  const [validationError, setValidationError] = React.useState<{
    afp?: string
    skalBeregneAfp?: string
  }>({
    afp: undefined,
    skalBeregneAfp: undefined,
  })
  const [showVetIkkeAlert, setShowVetIkkeAlert] = React.useState<boolean>(
    afp === 'vet_ikke'
  )
  const [jaAFPOffentlig, setJaAFPOffentlig] = React.useState<boolean>(
    afp === 'ja_offentlig'
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const afpData = data.get('afp') as AfpRadio | undefined
    const simuleringstypeData = data.get('skalBeregneAfp') as BooleanRadio

    if (!afpData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.afp.validation_error',
      })
      setValidationError((prev) => ({ ...prev, afp: tekst }))
      logger('skjema validering feilet', {
        skjemanavn: STEGVISNING_FORM_NAMES.afp,
        data: intl.formatMessage({
          id: 'stegvisning.afp.radio_label',
        }),
        tekst,
      })
    } else if (jaAFPOffentlig && !simuleringstypeData) {
      const tekst = intl.formatMessage({
        id: 'stegvisning.afpOverganskull.validation_error',
      })
      setValidationError((prev) => ({ ...prev, skalBeregneAfp: tekst }))
      logger('skjema validering feilet', {
        skjemanavn: STEGVISNING_FORM_NAMES.afp,
        data: intl.formatMessage({
          id: 'stegvisning.afp.radio_label',
        }),
        tekst,
      })
    } else {
      logger('radiogroup valgt', {
        tekst: 'Rett til AFP',
        valg: afpData,
      })
      logger('button klikk', {
        tekst: `Neste fra ${paths.afp}`,
      })

      onNext(
        afpData,
        simuleringstypeData
          ? convertBooleanRadioToBoolean(simuleringstypeData)
          : null
      )
    }
  }

  const handleRadioChange = (value: AfpRadio): void => {
    setValidationError((prev) => ({ ...prev, afp: undefined }))
    setShowVetIkkeAlert(value === 'vet_ikke')
    setJaAFPOffentlig(value === 'ja_offentlig')
    if (value === 'vet_ikke') {
      logger('alert vist', {
        tekst: 'Rett til AFP: Vet ikke',
        variant: 'info',
      })
    }
  }

  return (
    <Card hasLargePadding hasMargin data-testid="afp-overganskull">
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.afp.title" />
        </Heading>
        <BodyLong size="large">
          <FormattedMessage id="stegvisning.afp.ingress" />
        </BodyLong>
        <ReadMore
          name="Avtalefestet pensjon i offentlig sektor"
          className={styles.readmoreOffentlig}
          header={
            <FormattedMessage id="stegvisning.afpOvergangskull.readmore_offentlig_title" />
          }
        >
          <FormattedMessage id="stegvisning.afp.readmore_offentlig_list_title" />
          <ul className={styles.list}>
            <li>
              <FormattedMessage id="stegvisning.afpOvergangskull.readmore_offentlig_list_item1" />
            </li>
            <li>
              <FormattedMessage id="stegvisning.afpOvergangskull.readmore_offentlig_list_item2" />
            </li>
            <li>
              <FormattedMessage id="stegvisning.afpOvergangskull.readmore_offentlig_list_item3" />
            </li>
          </ul>
          <FormattedMessage id="stegvisning.afpOvergangskull.readmore_offentlig_ingress" />
        </ReadMore>
        <ReadMore
          name="Avtalefestet pensjon i privat sektor"
          className={styles.readmorePrivat}
          header={
            <FormattedMessage id="stegvisning.afp.readmore_privat_title" />
          }
        >
          <FormattedMessage id="stegvisning.afp.readmore_privat_list_title" />
          <ul className={styles.list}>
            <li>
              <FormattedMessage id="stegvisning.afp.readmore_privat_list_item1" />
            </li>
            <li>
              <FormattedMessage id="stegvisning.afp.readmore_privat_list_item2" />
            </li>
            <li>
              <FormattedMessage id="stegvisning.afp.readmore_privat_list_item3" />
            </li>
            <li>
              <FormattedMessage id="stegvisning.afp.readmore_privat_list_item4" />
            </li>
          </ul>
          <FormattedMessage
            id="stegvisning.afp.readmore_privat_link"
            values={{
              ...getFormatMessageValues(),
            }}
          />
        </ReadMore>
        <RadioGroup
          className={styles.radiogroup}
          legend={<FormattedMessage id="stegvisning.afp.radio_label" />}
          name="afp"
          defaultValue={afp}
          onChange={handleRadioChange}
          error={validationError.afp}
          role="radiogroup"
          aria-required="true"
        >
          <Radio value="ja_offentlig">
            <FormattedMessage id="stegvisning.afp.radio_ja_offentlig" />
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
        {jaAFPOffentlig && (
          <RadioGroup
            className={styles.radiogroup}
            legend={
              <FormattedMessage id="stegvisning.afp.overgangskullUtenAP.radio_label" />
            }
            name="skalBeregneAfp"
            defaultValue={convertBooleanToBooleanRadio(skalBeregneAfp)}
            onChange={() =>
              setValidationError({ afp: undefined, skalBeregneAfp: undefined })
            }
            error={validationError.skalBeregneAfp}
            role="radiogroup"
            aria-required="true"
          >
            <Radio value="ja">
              <FormattedMessage id="stegvisning.afp.overgangskullUtenAP.radio_ja" />
            </Radio>
            <Radio value="nei">
              <FormattedMessage id="stegvisning.afp.overgangskullUtenAP.radio_nei" />
            </Radio>
          </RadioGroup>
        )}
        <Button type="submit" className={styles.button}>
          <FormattedMessage id="stegvisning.neste" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="secondary"
          onClick={wrapLogger('button klikk', {
            tekst: `Tilbake fra ${paths.afp}`,
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

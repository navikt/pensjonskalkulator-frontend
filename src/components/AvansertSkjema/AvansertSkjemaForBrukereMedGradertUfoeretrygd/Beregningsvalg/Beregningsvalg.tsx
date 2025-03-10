import { FormattedMessage, useIntl } from 'react-intl'

import { RadioGroup, Radio } from '@navikt/ds-react'

import { AVANSERT_FORM_NAMES } from '../../utils'
import { useAppSelector } from '@/state/hooks'
import { selectAfp } from '@/state/userInput/selectors'

interface Props {
  value: Beregningsvalg
  onChange: (value: Beregningsvalg) => void
}

export const Beregningsvalg = ({ value, onChange }: Props) => {
  const intl = useIntl()
  const valgtAFP = useAppSelector(selectAfp)

  if (valgtAFP === 'ja_offentlig' || valgtAFP === 'ja_privat') {
    return (
      <RadioGroup
        legend={intl.formatMessage({
          id: 'beregning.avansert.rediger.radio.beregningsvalg.label',
        })}
        role="radiogroup"
        aria-required="true"
        value={value}
        onChange={onChange}
      >
        <Radio
          form={AVANSERT_FORM_NAMES.form}
          data-testid={AVANSERT_FORM_NAMES.beregningsType}
          value="beregnPensjonUtenAfp"
        >
          <FormattedMessage id="beregning.avansert.rediger.radio.beregningsvalg.alderspensjon_uten_afp_med_ufoeretrygd.label" />
        </Radio>

        <Radio
          form={AVANSERT_FORM_NAMES.form}
          data-testid={AVANSERT_FORM_NAMES.beregningsType}
          value="beregnPensjonMedAfp"
        >
          <FormattedMessage id="beregning.avansert.rediger.radio.beregningsvalg.alderspensjon_med_afp_uten_ufoeretrygd.label" />
        </Radio>
      </RadioGroup>
    )
  }

  return null
}

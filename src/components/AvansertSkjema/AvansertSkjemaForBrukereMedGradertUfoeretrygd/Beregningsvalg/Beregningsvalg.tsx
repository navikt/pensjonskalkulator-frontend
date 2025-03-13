import { FormattedMessage, useIntl } from 'react-intl'

import { RadioGroup, Radio, BodyLong, Heading } from '@navikt/ds-react'

import { AVANSERT_FORM_NAMES } from '../../utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectBeregningsvalg,
  selectNedreAldersgrense,
  selectSamtykkeOffentligAFP,
} from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './Beregningsvalg.module.scss'

interface Props {
  localBeregningsTypeRadio: Beregningsvalg
  setLocalBeregningsTypeRadio: (value: Beregningsvalg) => void
}

export const Beregningsvalg = ({
  localBeregningsTypeRadio,
  setLocalBeregningsTypeRadio,
}: Props) => {
  const intl = useIntl()
  const valgtAFP = useAppSelector(selectAfp)
  const isSamtykkeOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const beregningsvalg = useAppSelector(selectBeregningsvalg)
  const nedreAldersgrense = useAppSelector(selectNedreAldersgrense)

  if (
    (valgtAFP === 'ja_offentlig' && isSamtykkeOffentligAFP) ||
    valgtAFP === 'ja_privat'
  ) {
    return (
      <div>
        <RadioGroup
          legend={intl.formatMessage({
            id: 'beregning.avansert.rediger.radio.beregningsvalg.label',
          })}
          role="radiogroup"
          aria-required="true"
          defaultValue={beregningsvalg ?? localBeregningsTypeRadio}
          onChange={(value) => setLocalBeregningsTypeRadio(value)}
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
            <FormattedMessage
              id="beregning.avansert.rediger.radio.beregningsvalg.alderspensjon_med_afp_uten_ufoeretrygd.label"
              values={{
                ...getFormatMessageValues(),
                nedreAldersgrense: formatUttaksalder(intl, nedreAldersgrense),
              }}
            />
          </Radio>
        </RadioGroup>

        {localBeregningsTypeRadio === 'beregnPensjonMedAfp' && (
          <div className={styles.description}>
            <Heading level="2" size="medium">
              <FormattedMessage
                id={
                  'beregning.avansert.rediger.beregningsvalg.alderspensjon_med_afp_uten_ufoeretrygd.title'
                }
                values={{
                  ...getFormatMessageValues(),
                  nedreAldersgrense: formatUttaksalder(intl, nedreAldersgrense),
                }}
              />
            </Heading>

            <BodyLong>
              <FormattedMessage
                id={
                  'beregning.avansert.rediger.beregningsvalg.alderspensjon_med_afp_uten_ufoeretrygd.description'
                }
                values={{
                  ...getFormatMessageValues(),
                  nedreAldersgrense: formatUttaksalder(intl, nedreAldersgrense),
                }}
              />
            </BodyLong>
          </div>
        )}
      </div>
    )
  }

  return null
}

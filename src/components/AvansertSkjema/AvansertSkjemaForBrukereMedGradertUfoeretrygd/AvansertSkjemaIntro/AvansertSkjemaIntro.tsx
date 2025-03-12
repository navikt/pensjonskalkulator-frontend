import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { ExternalLink } from '@/components/common/ExternalLink'
import { externalUrls } from '@/router/constants'
import { useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectIsEndring,
  selectSamtykkeOffentligAFP,
  selectUfoeregrad,
} from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

export const AvansertSkjemaIntro = () => {
  const isEndring = useAppSelector(selectIsEndring)
  const valgtAFP = useAppSelector(selectAfp)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const isSamtykkeOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)

  if (isEndring) {
    return null
  }

  if (
    (valgtAFP === 'ja_offentlig' && isSamtykkeOffentligAFP) ||
    valgtAFP === 'ja_privat'
  ) {
    return (
      <div>
        <BodyLong>
          <FormattedMessage
            id={'beregning.avansert.rediger.beregningsvalg.description'}
            values={{
              ...getFormatMessageValues(),
              ufoeregrad,
            }}
          />
          <ExternalLink href={externalUrls.ufoeretrygdOgAfp}>
            <FormattedMessage id="beregning.avansert.rediger.beregningsvalg.om_valget_link" />
          </ExternalLink>
        </BodyLong>
      </div>
    )
  }

  return null
}

import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { ExternalLink } from '@/components/common/ExternalLink'
import { externalUrls } from '@/router/constants'
import { useAppSelector } from '@/state/hooks'
import { selectUfoeregrad } from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

export const IntroAFP = () => {
  const ufoeregrad = useAppSelector(selectUfoeregrad)

  return (
    <div data-testid="intro_afp">
      <BodyLong>
        <FormattedMessage
          id={'beregning.avansert.rediger.beregningsvalg.description'}
          data-testid="intro_afp_description"
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

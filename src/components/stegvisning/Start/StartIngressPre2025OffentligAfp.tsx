import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { getFormatMessageValues } from '@/utils/translations'

export const StartIngressPre2025OffentligAfp: React.FC = () => (
  <>
    <span data-testid="stegvisning-start-ingress-pre2025-offentlig-afp">
      <FormattedMessage
        id="stegvisning.start.endring.ingress.pre2025_offentlig_afp"
        values={{ ...getFormatMessageValues() }}
      />
    </span>
    <BodyLong size="medium">
      <FormattedMessage id="stegvisning.start.ingress_2" />
    </BodyLong>
  </>
)

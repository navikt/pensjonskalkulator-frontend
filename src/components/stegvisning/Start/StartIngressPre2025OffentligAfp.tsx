import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { getFormatMessageValues } from '@/utils/translations'

export function StartIngressPre2025OffentligAfp() {
  return (
    <>
      <FormattedMessage
        id="stegvisning.start.endring.ingress.pre2025_offentlig_afp"
        values={{ ...getFormatMessageValues() }}
      />
      <BodyLong size="medium">
        <FormattedMessage id="stegvisning.start.ingress_2" />
      </BodyLong>
    </>
  )
}

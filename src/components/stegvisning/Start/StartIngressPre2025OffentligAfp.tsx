import { format, parseISO } from 'date-fns'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { DATE_ENDUSER_FORMAT } from '@/utils/dates'
import { getFormatMessageValues } from '@/utils/translations'

export interface StartIngressPre2025OffentligAfpProps {
  loependeVedtak: LoependeVedtak
}

export const StartIngressPre2025OffentligAfp: React.FC<
  StartIngressPre2025OffentligAfpProps
> = ({ loependeVedtak }) => {
  const fremtidigAlderspensjon = loependeVedtak.fremtidigAlderspensjon
  return (
    <div>
      <span data-testid="stegvisning-start-ingress-pre2025-offentlig-afp">
        {loependeVedtak.alderspensjon?.grad === 0 ? (
          fremtidigAlderspensjon ? (
            <FormattedMessage
              id="stegvisning.start.endring.ingress.pre2025_offentlig_afp_fremtidig"
              values={{
                ...getFormatMessageValues(),
                grad: fremtidigAlderspensjon.grad,
                fom: format(
                  parseISO(fremtidigAlderspensjon.fom),
                  DATE_ENDUSER_FORMAT
                ),
              }}
            />
          ) : (
            <FormattedMessage
              id="stegvisning.start.endring.ingress.pre2025_offentlig_afp"
              values={{
                ...getFormatMessageValues(),
                grad: loependeVedtak?.alderspensjon?.grad,
              }}
            />
          )
        ) : (
          <FormattedMessage
            id="stegvisning.start.ingress.pre2025_offentlig_afp"
            values={{ ...getFormatMessageValues() }}
          />
        )}
      </span>
      <BodyLong size="medium">
        <FormattedMessage id="stegvisning.start.ingress_2" />
      </BodyLong>
    </div>
  )
}

import { useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { BodyLong, Heading } from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { getFormatMessageValues } from '@/utils/translations'

// TODO hente feature-toggle for sanity
// TODO hente forbehold avsnitt og sortere dem etter "order" felt
export function Forbehold() {
  const intl = useIntl()

  useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.forbehold',
    })
  }, [])

  return (
    <Card hasLargePadding hasMargin>
      <Heading level="2" size="medium" spacing>
        <FormattedMessage id="forbehold.title" />
      </Heading>
      <BodyLong spacing>
        <FormattedMessage
          id="forbehold.intro"
          values={{
            ...getFormatMessageValues(intl),
          }}
        />
      </BodyLong>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.inntekt.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.inntekt.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.utenlandsopphold.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.utenlandsopphold.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.sivilstand.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.sivilstand.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.afp.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.afp.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.uforetrygd.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.uforetrygd.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.uforetrygd_afp.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.uforetrygd_afp.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.gjenlevende.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.gjenlevende.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
      <section>
        <Heading level="3" size="small" spacing>
          <FormattedMessage id="forbehold.pensjonsavtaler.title" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="forbehold.pensjonsavtaler.ingress"
            values={{
              ...getFormatMessageValues(intl),
            }}
          />
        </BodyLong>
      </section>
    </Card>
  )
}

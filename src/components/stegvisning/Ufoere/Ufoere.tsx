import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { ReadMore } from '@/components/common/ReadMore'
import { paths } from '@/router/constants'
import { logger, wrapLogger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './Ufoere.module.scss'

interface Props {
  onCancel?: () => void
  onPrevious: () => void
  onNext?: () => void
}

export function Ufoere({ onCancel, onPrevious, onNext }: Props) {
  const intl = useIntl()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    logger('button klikk', {
      tekst: `Neste fra ${paths.ufoeretrygdAFP}`,
    })
    if (onNext) {
      onNext()
    }
  }

  return (
    <Card hasLargePadding hasMargin>
      <form onSubmit={onSubmit}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="stegvisning.ufoere.title" />
        </Heading>

        <Alert
          data-testid="ufoere-info"
          className={styles.alert}
          variant="info"
          aria-live="polite"
        >
          <FormattedMessage
            id="stegvisning.ufoere.info"
            values={{ ...getFormatMessageValues(intl) }}
          />
        </Alert>

        <ReadMore
          name="Om uføretrygd og avtalefestet pensjon"
          className={styles.readmore1}
          header={<FormattedMessage id="stegvisning.ufoere.readmore_1.title" />}
        >
          <FormattedMessage
            id="stegvisning.ufoere.readmore_1.body"
            values={{ ...getFormatMessageValues(intl) }}
          />
        </ReadMore>

        <BodyLong
          size="large"
          data-testid="ufoere-ingress"
          className={styles.paragraph}
        >
          <FormattedMessage
            id="stegvisning.ufoere.ingress"
            values={{ ...getFormatMessageValues(intl) }}
          />
        </BodyLong>

        <Button type="submit" className={styles.button}>
          <FormattedMessage id="stegvisning.neste" />
        </Button>
        <Button
          type="button"
          className={styles.button}
          variant="secondary"
          onClick={wrapLogger('button klikk', {
            tekst: `Tilbake fra ${paths.ufoeretrygdAFP}`,
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

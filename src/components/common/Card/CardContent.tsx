import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Button, Heading } from '@navikt/ds-react'

import { Loader } from '@/components/common/Loader'

import styles from './CardContent.module.scss'

export interface CardContentProps {
  text?: {
    loading?: string
    header?: string
    ingress?: string
    primaryButton?: string
    secondaryButton?: string
    tertiaryButton?: string
  }
  isLoading?: boolean
  onPrimaryButtonClick: () => void
  onSecondaryButtonClick: () => void
  onTertiaryButtonClick?: () => void
  children?: JSX.Element
}

export function CardContent({
  isLoading,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onTertiaryButtonClick,
  text,
  children,
}: CardContentProps) {
  const intl = useIntl()
  if (isLoading) {
    return (
      <Loader
        data-testid="loader"
        size="3xlarge"
        title={intl.formatMessage({
          id: text?.loading,
        })}
      />
    )
  }
  return (
    <>
      <Heading level="2" size="medium" spacing>
        <FormattedMessage id={text?.header} />
      </Heading>

      {text?.ingress && (
        <BodyLong size="large" className={styles.ingress}>
          <FormattedMessage id={text?.ingress} values={{ br: <br /> }} />
        </BodyLong>
      )}

      {children}

      <Button
        type="button"
        className={styles.button}
        variant="primary"
        onClick={onPrimaryButtonClick}
      >
        <FormattedMessage id={text?.primaryButton} />
      </Button>

      <Button
        type="button"
        className={styles.button}
        variant="secondary"
        onClick={onSecondaryButtonClick}
      >
        <FormattedMessage id={text?.secondaryButton} />
      </Button>

      {onTertiaryButtonClick && (
        <Button
          type="button"
          className={styles.button}
          variant="tertiary"
          onClick={onTertiaryButtonClick}
        >
          <FormattedMessage id={text?.tertiaryButton} />
        </Button>
      )}
    </>
  )
}

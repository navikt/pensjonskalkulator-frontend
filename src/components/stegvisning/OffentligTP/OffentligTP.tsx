import { useEffect, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong, Button, Heading } from '@navikt/ds-react'

import { ResponsiveCard } from '@/components/components/ResponsiveCard'

import styles from './OffentligTP.module.scss'

interface Props {
  onCancel: () => void
  onPrevious: () => void
  onNext: () => void
  shouldJumpOverStep?: boolean
}

export function OffentligTP({
  onCancel,
  onPrevious,
  onNext,
  shouldJumpOverStep,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    if (shouldJumpOverStep) {
      onNext()
    }
  }, [shouldJumpOverStep])

  return (
    <ResponsiveCard aria-live="polite" hasLargePadding>
      <Heading
        ref={headingRef}
        className={styles.heading}
        level="2"
        size="large"
        tabIndex={-1}
        spacing
      >
        <FormattedMessage id="stegvisning.offentligtp.title" />
      </Heading>
      <BodyLong spacing>
        <FormattedMessage id="stegvisning.offentligtp.ingress_1" />
      </BodyLong>
      <BodyLong className={styles.lastIngress}>
        <FormattedMessage id="stegvisning.offentligtp.ingress_2" />
      </BodyLong>

      <Button type="submit" className={styles.button} onClick={onNext}>
        <FormattedMessage id="stegvisning.neste" />
      </Button>
      <Button
        type="button"
        className={styles.button}
        variant="secondary"
        onClick={onPrevious}
      >
        <FormattedMessage id="stegvisning.tilbake" />
      </Button>
      <Button
        type="button"
        className={styles.button}
        variant="tertiary"
        onClick={onCancel}
      >
        <FormattedMessage id="stegvisning.avbryt" />
      </Button>
    </ResponsiveCard>
  )
}

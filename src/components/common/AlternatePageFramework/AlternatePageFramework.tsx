import React, { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { Heading } from '@navikt/ds-react'
import clsx from 'clsx'

import styles from './AlternatePageFramework.module.scss'

export const AlternatePageFramework: React.FC<
  PropsWithChildren & { isFullWidth?: boolean }
> = ({ children, isFullWidth }) => {
  const intl = useIntl()

  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main style={{ background: 'var(--a-bg-default)' }}>
      <div
        className={clsx(styles.main, {
          [styles.main__isFramed]: !isFullWidth,
        })}
      >
        <div className={styles.headerGroup}>
          <Heading
            size="large"
            level="1"
            className={clsx(styles.headerGroupTitle, {
              [styles.headerGroupTitle__isFramed]: !isFullWidth,
            })}
          >
            {intl.formatMessage({ id: 'application.title' })}
          </Heading>
        </div>
        {children}
      </div>
    </main>
  )
}

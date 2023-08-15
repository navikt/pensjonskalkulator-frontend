import { PropsWithChildren, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { Heading } from '@navikt/ds-react'
import clsx from 'clsx'

import styles from './PageFramework.module.scss'

export const PageFramework: React.FC<
  PropsWithChildren & { isFullWidth?: boolean }
> = ({ children, isFullWidth }) => {
  const intl = useIntl()

  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main
      className={clsx(styles.main, {
        [styles.main__isFramed]: !isFullWidth,
      })}
    >
      <div className={styles.headerGroup}>
        <Heading
          size="xlarge"
          level="1"
          className={clsx(styles.headerGroupTitle, {
            [styles.headerGroupTitle__isFramed]: !isFullWidth,
          })}
        >
          {intl.formatMessage({ id: 'application.title' })}
        </Heading>
      </div>
      {children}
    </main>
  )
}

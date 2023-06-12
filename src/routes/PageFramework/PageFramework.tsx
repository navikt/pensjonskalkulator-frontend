import { PropsWithChildren, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { Heading } from '@navikt/ds-react'

import styles from './PageFramework.module.scss'

export function PageFramework({ children }: PropsWithChildren<unknown>) {
  const intl = useIntl()

  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main className={styles.main}>
      <div className={styles.headerGroup}>
        <Heading size="xlarge" level="1">
          {intl.formatMessage({ id: 'application.title' })}
        </Heading>
      </div>
      {children}
    </main>
  )
}

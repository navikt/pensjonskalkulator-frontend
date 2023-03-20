import { Heading } from '@navikt/ds-react'
import clsx from 'clsx'

import { Pensjonsberegning } from '@/pensjonsberegning'
import frameStyles from '@/styles/Frame/Frame.module.scss'

import styles from './App.module.scss'

export function App() {
  return (
    <main
      className={clsx(
        frameStyles.frame,
        frameStyles.frame_isFlex,
        frameStyles.frame_hasPadding,
        styles.main
      )}
    >
      <Heading size="large" level="1" className={styles.heading}>
        Din pensjon
      </Heading>
      <Pensjonsberegning />
    </main>
  )
}

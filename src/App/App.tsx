import { useState } from 'react'

import { Button, Heading } from '@navikt/ds-react'
import { Loader, Alert } from '@navikt/ds-react'

import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import frameStyles from '../Frame/Frame.module.scss'
import { useGetStatusQuery } from '../state/api/apiSlice'

import { onButtonClick } from './App-utils'

import styles from './App.module.scss'

// TODO move as util? move as container?
export function App() {
  const [count, setCount] = useState<number>(0)

  const {
    data: livenessStatus,
    isLoading,
    // isSuccess,
    isError,
    error,
  } = useGetStatusQuery()

  let content
  if (isError) {
    content = (
      <Alert variant="error">
        <Heading spacing size="small" level="1">
          {`Beklager, vi fikk ikke hentet status pga en error ${error?.status}`}
        </Heading>
      </Alert>
    )
  } else if (isLoading) {
    content = <Loader size="3xlarge" title="venter..." />
  } else {
    content = (
      <Heading spacing size="large" level="1">
        Pensjonskalkulator is "{livenessStatus}"
      </Heading>
    )
  }

  return (
    <main
      className={`${frameStyles.frame} ${frameStyles.frame_isFlex} ${frameStyles.frame_hasPadding}`}
    >
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img
            src={reactLogo}
            className={`${styles.logo} ${styles.logo_react}`}
            alt="React logo"
          />
        </a>
      </div>

      {content}

      <div className={styles.card}>
        <Button
          className={styles.button}
          onClick={() => onButtonClick(count, setCount)}
        >
          count is {count}
        </Button>
        <p>{'Du bør muligens spare bittelitt mer altså...'}</p>
      </div>
    </main>
  )
}

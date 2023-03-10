import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox, CheckboxGroup, Button, Heading } from '@navikt/ds-react'
import { Loader, Alert } from '@navikt/ds-react'
import { SerializedError } from '@reduxjs/toolkit'

import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import frameStyles from '../Frame/Frame.module.scss'
import { useGetStatusQuery } from '../state/api/apiSlice'
import { RootState } from '../state/store'
import { userInputActions } from '../state/userInput/userInputReducer'

import { onButtonClick } from './App-utils'

import styles from './App.module.scss'

// TODO move as util? move as container?
export function App() {
  const [count, setCount] = useState<number>(0)
  const dispatch = useDispatch()
  // TODO lage selector ut av det og skrive tester
  const harSamtykket = useSelector(
    (state: RootState) => state.userInput.samtykke
  )

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
          {`Beklager, vi fikk ikke hentet status pga en feil: ${
            (error as SerializedError).message
          }`}
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
        {!harSamtykket && (
          <CheckboxGroup
            legend="Er det greit for deg?"
            onChange={(val: Array<string>) => {
              dispatch(userInputActions.setSamtykke(val.length > 0))
            }}
          >
            <Checkbox value={'ja'}>
              Ja, jeg samtykker og går videre! :)
            </Checkbox>
          </CheckboxGroup>
        )}
        <Button
          className={styles.button}
          onClick={() => {
            onButtonClick(count, setCount)
          }}
        >
          count is {count}
        </Button>
        <p>{'Du bør muligens spare bittelitt mer altså...'}</p>
      </div>
    </main>
  )
}

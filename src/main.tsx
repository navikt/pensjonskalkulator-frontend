import React from 'react'
import { Provider } from 'react-redux'

import ReactDOM from 'react-dom/client'

import { App } from './App/App'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { store } from './state/store'

import '@navikt/ds-css'
import '@navikt/ds-tokens'

const rootId = 'root'
const root = document.getElementById(rootId)

if (!root) {
  throw Error(`Missing element with id "${rootId}"`)
}

if (
  process.env.NODE_ENV === 'development' &&
  import.meta.env.VITE_MSW_BASEURL
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('./api/browser').then((mswBrowserModule) => {
    console.log('>>>> STARTING MSW WORKER', mswBrowserModule.worker)
    mswBrowserModule.worker.start()
    mswBrowserModule.worker.printHandlers()
  })
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)

import React from 'react'
// import { Provider } from 'react-redux'

import ReactDOM from 'react-dom/client'

import { App } from './App/App'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
// import { store } from './state/store'

import '@navikt/ds-css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />

      {/* <Provider store={store}>
        <App />
      </Provider> */}
    </ErrorBoundary>
  </React.StrictMode>
)

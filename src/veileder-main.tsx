import React from 'react'
import { Provider } from 'react-redux'

import { InternalHeader, Spacer } from '@navikt/ds-react'
import ReactDOM from 'react-dom/client'

import { LanguageProvider } from '@/context/LanguageProvider'
import { initializeLogs } from '@/faro'

import { VeilederInput } from './pages/VeilederInput/VeilederInput.js'
import { store } from './state/store'

import './scss/designsystem.scss'

import '@/utils/logging'

const root = document.getElementById('root')

if (!root) {
  throw Error(`Missing root element`)
}

if (process.env.NODE_ENV === 'development') {
  const msw = await import('./mocks/browser')
  await msw.worker.start({
    serviceWorker: {
      url: '/pensjon/kalkulator/mockServiceWorker.js',
    },
    onUnhandledRequest: 'bypass',
  })
  msw.worker.listHandlers().forEach((handler) => {
    console.log(handler.info.header)
  })
}

initializeLogs()

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <VeilederInput />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
)

if (window.Cypress) {
  window.store = store
}

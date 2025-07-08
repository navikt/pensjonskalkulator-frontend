import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router'

import { LanguageProvider } from '@/context/LanguageProvider'
import { initializeLogs } from '@/faro'
import { BASE_PATH } from '@/router/constants'
import { routes } from '@/router/routes'

import { store } from './state/store'

import './scss/designsystem.scss'
import '@/utils/logging'

// Create MSW ready signal for external scripts
if (process.env.NODE_ENV === 'development') {
  let resolveMSW: () => void
  ;(window as unknown as { __MSW_READY__: Promise<void> }).__MSW_READY__ =
    new Promise<void>((resolve) => {
      resolveMSW = resolve
    })

  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: {
      url: '/pensjon/kalkulator/mockServiceWorker.js',
      options: {
        scope: '/',
      },
    },
    onUnhandledRequest: 'bypass',
  })

  // Signal that MSW is ready
  resolveMSW!()
  console.log('[MSW] Ready - external scripts can now load')
}

const root = document.getElementById('root')

if (!root) {
  throw Error(`Missing root element`)
}

const router = createBrowserRouter(routes, { basename: BASE_PATH })

initializeLogs()

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
)

if (window.Cypress) {
  window.store = store
  window.router = router
}

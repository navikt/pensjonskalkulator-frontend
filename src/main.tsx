import React from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router'

import ReactDOM from 'react-dom/client'

import { client } from '../sanity.config'
import { LanguageProvider } from '@/context/LanguageProvider'
import { initializeLogs } from '@/faro'
import { BASE_PATH } from '@/router/constants'
import { routes } from '@/router/routes'

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
}

const router = createBrowserRouter(routes, {
  basename: BASE_PATH,
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
  },
})

// TODO midlertidig fetching av tekster
client.fetch<number>(`count(*)`).then((data: number) => {
  console.log(`Number of documents: ${data}`)
})

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

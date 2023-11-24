import React from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ReactDOM from 'react-dom/client'

import { LanguageProvider } from '@/context/LanguageProvider'
import { initializeLogs } from '@/faro'
import { BASE_PATH } from '@/router/constants'
import { routes } from '@/router/routes'

import { GlobalLogWrapper } from './components/GlobalLogWrapper'
import { store } from './state/store'

import './scss/designsystem.scss'

import '@/utils/logging'

const root = document.getElementById('root')

if (!root) {
  throw Error(`Missing root element`)
}

if (process.env.NODE_ENV === 'development') {
  const msw = await import('./mocks/browser')
  await msw.worker.start({ onUnhandledRequest: 'bypass' })
  msw.worker.listHandlers().forEach((handler) => {
    console.log(handler.info.header)
  })
}

const router = createBrowserRouter(routes, {
  basename: BASE_PATH,
})

initializeLogs()

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <GlobalLogWrapper rootEl={root}>
          <RouterProvider router={router} />
        </GlobalLogWrapper>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
)

if (window.Cypress) {
  window.store = store
  window.router = router
}

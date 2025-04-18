/* eslint-disable import/export */
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { RenderOptions, render } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { MemoryRouter, RouterProvider, createBrowserRouter } from 'react-router'

import { SanityContext } from '@/context/SanityContext'
import {
  SanityForbeholdAvsnitt,
  SanityGuidePanel,
  SanityReadMore,
} from '@/context/SanityContext/SanityTypes'
import { authenticationGuard } from '@/router/loaders'
import test_translations from '@/utils/__tests__/test-translations'

import sanityForbeholdAvsnittDataResponse from './mocks/data/sanity-forbehold-avsnitt-data.json' with { type: 'json' }
import sanityGuidePanelDataResponse from './mocks/data/sanity-guidepanel-data.json' with { type: 'json' }
import sanityReadMoreDataResponse from './mocks/data/sanity-readmore-data.json' with { type: 'json' }
import { createUttaksalderListener } from './state/listeners/uttaksalderListener'
import {
  AppStartListening,
  AppStore,
  RootState,
  setupStore,
} from './state/store'
import translations_nb from './translations/nb'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
  hasRouter?: boolean
  hasLogin?: boolean
}

export const swallowErrors = (testFn: () => void) => {
  const error = console.error
  console.error = () => {}
  testFn()
  console.error = error
}

export const swallowErrorsAsync = async (testFn: () => Promise<void>) => {
  const cache = console.error
  console.error = () => {}
  await testFn()
  console.error = cache
}

function generateMockedTranslations() {
  const translationsInput: Record<string, string> = {
    ...translations_nb,
    ...test_translations,
  }
  const translations: Record<string, string> = {}

  for (const key in translationsInput) {
    if (
      /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>|{[^}]+}/i.test(
        translationsInput[key]
      )
    ) {
      // for html or chunks keys: results in 'my_key' : 'my_key with some <html> or {chunk}'
      translations[key] = translationsInput[key]
    } else {
      // results in 'my_key' : 'my_key'
      translations[key] = key
    }
  }
  return translations
}

// Return an object with the store and all of RTL's query functions
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState, true),
    hasRouter = true,
    hasLogin = false,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({
    children,
  }: PropsWithChildren<unknown>): React.JSX.Element {
    const router = createBrowserRouter([
      {
        loader: authenticationGuard,
        path: '/',
        element: children,
      },
    ])

    const childrenWithRouter = hasLogin ? (
      <RouterProvider router={router} />
    ) : (
      <MemoryRouter>{children}</MemoryRouter>
    )

    return (
      <Provider store={store}>
        <IntlProvider locale="nb" messages={generateMockedTranslations()}>
          <SanityContext.Provider
            value={{
              readMoreData: Object.fromEntries(
                (
                  sanityReadMoreDataResponse.result as unknown as SanityReadMore[]
                ).map((readmore) => [readmore.name, readmore])
              ),
              guidePanelData: Object.fromEntries(
                (
                  sanityGuidePanelDataResponse.result as unknown as SanityGuidePanel[]
                ).map((guidepanel) => [guidepanel.name, guidepanel])
              ),
              forbeholdAvsnittData:
                sanityForbeholdAvsnittDataResponse.result as unknown as SanityForbeholdAvsnitt[],
            }}
          >
            {hasRouter ? childrenWithRouter : children}
          </SanityContext.Provider>
        </IntlProvider>
      </Provider>
    )
  }

  const listenerMiddleware = createListenerMiddleware()
  createUttaksalderListener(
    listenerMiddleware.startListening as AppStartListening
  )

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export { renderWithProviders as render }

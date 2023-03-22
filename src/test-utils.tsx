import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import {
  AnyAction,
  combineReducers,
  configureStore,
  EnhancedStore,
  Middleware,
  Reducer,
  PreloadedState,
} from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'

import { setupStore, RootState, AppStore } from './state/store'

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
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

// Return an object with the store and all of RTL's query functions
export function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // TODO add listeners

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function setupApiStore<
  A extends {
    reducer: Reducer<any, any>
    reducerPath: string
    middleware: Middleware
    util: { resetApiState(): any }
  },
  R extends Record<string, Reducer<any, any>> = Record<never, never>
>(api: A, extraReducers?: R): { api: any; store: EnhancedStore } {
  /*
   * Modified version of RTK Query's helper function:
   * https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/src/query/tests/helpers.tsx
   */
  const getStore = (): EnhancedStore =>
    configureStore({
      reducer: combineReducers({
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      }),
      middleware: (gdm) =>
        gdm({ serializableCheck: false, immutableCheck: false }).concat(
          api.middleware
        ),
    })

  type StoreType = EnhancedStore<
    {
      api: ReturnType<A['reducer']>
    } & {
      [K in keyof R]: ReturnType<R[K]>
    },
    AnyAction,
    ReturnType<typeof getStore> extends EnhancedStore<any, any, infer M>
      ? M
      : never
  >

  const initialStore = getStore() as StoreType
  const refObj = {
    api,
    store: initialStore,
  }
  const store = getStore() as StoreType
  refObj.store = store

  return refObj
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export { renderWithStore as render }

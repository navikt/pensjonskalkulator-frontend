import {
  configureStore,
  createListenerMiddleware,
  Unsubscribe,
} from '@reduxjs/toolkit'
import { vi } from 'vitest'

import { createUttaksalderListener } from '../uttaksalderListener'
import { apiSlice } from '@/state/api/apiSlice'
import { AppStartListening, rootReducer } from '@/state/store'
import {
  selectCurrentSimulation,
  selectFormatertUttaksalderReadOnly,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

describe('uttaksalderListener', () => {
  const onMiddlewareError = vi.fn((): void => {})

  const listenerMiddlewareInstance = createListenerMiddleware({
    onError: onMiddlewareError,
  })

  function setupTestStore() {
    return configureStore({
      reducer: rootReducer,
      middleware: (gDM) =>
        gDM({ immutableCheck: false, serializableCheck: false })
          .concat(apiSlice.middleware)
          .prepend(listenerMiddlewareInstance.middleware),
    })
  }

  let store = setupTestStore()
  let unsubscribe: Unsubscribe

  beforeEach(() => {
    listenerMiddlewareInstance.clearListeners()
    onMiddlewareError.mockClear()
    store = setupTestStore()

    unsubscribe = createUttaksalderListener(
      listenerMiddlewareInstance.startListening as AppStartListening
    )
  })

  afterEach(() => {
    unsubscribe?.()
  })

  describe('Gitt at startAlder oppdateres,', () => {
    it('oppdaterer currentSimulation', async () => {
      store.dispatch(
        userInputActions.setCurrentSimulationStartAlder({
          aar: 66,
          maaneder: 5,
        })
      )

      expect(
        selectCurrentSimulation(store.getState()).formatertUttaksalderReadOnly
      ).toBe('66 år og 5 måneder')
      expect(selectFormatertUttaksalderReadOnly(store.getState())).toBe(
        '66 år og 5 måneder'
      )

      store.dispatch(
        userInputActions.setCurrentSimulationStartAlder({
          aar: 67,
          maaneder: 0,
        })
      )
      expect(
        selectCurrentSimulation(store.getState()).formatertUttaksalderReadOnly
      ).toBe('67 år')
      expect(selectFormatertUttaksalderReadOnly(store.getState())).toBe('67 år')
    })
  })
})

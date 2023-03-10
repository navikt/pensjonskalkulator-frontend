import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import {
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedStartListening,
  TypedAddListener,
} from '@reduxjs/toolkit'

import { apiSlice } from './api/apiSlice'
import { createSamtykkeListener } from './listeners/samtykkeListener'
import userInputReducer from './userInput/userInputReducer'

const listenerMiddleware = createListenerMiddleware()

export const store = configureStore({
  reducer: {
    userInput: userInputReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .prepend(listenerMiddleware.middleware),
})

createSamtykkeListener(listenerMiddleware.startListening as AppStartListening)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>
export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState, AppDispatch>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

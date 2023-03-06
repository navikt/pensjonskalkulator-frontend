import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from './api/apiSlice'
import { personaliaSlice } from './personalia/personaliaSlice'

export const store = configureStore({
  reducer: {
    personalia: personaliaSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

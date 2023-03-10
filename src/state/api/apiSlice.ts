import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/pensjon/kalkulator/api' }),
  endpoints: (builder) => ({
    getStatus: builder.query<string, void>({
      // Full request url med baseQuery: '/pensjon/kalkulator/api/status'
      query: () => '/status',
      transformResponse: (rawResult: { status: string }, meta) => {
        return rawResult.status
      },
    }),
    // Adding other possible queries afterwards
    // getSimulations
    // getSimulationById
    // deleteSimulation
    // addSimulation
    // updateSimulation
  }),
})

export const { useGetStatusQuery } = apiSlice

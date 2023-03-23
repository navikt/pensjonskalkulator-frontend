import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isPensjonsberegning } from './typeguards'

const baseUrl = import.meta.env.MODE === 'test' ? 'http://localhost:8088' : ''

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/pensjon/kalkulator/api`,
  }),
  endpoints: (builder) => ({
    // Full request url med baseQuery: '${env.VITE_MSW_BASEURL}/pensjon/kalkulator/api/pensjonsberegning'
    getPensjonsberegning: builder.query<Pensjonsberegning[], void>({
      query: () => '/pensjonsberegning',
      transformResponse: (response: Pensjonsberegning[]) => {
        if (!isPensjonsberegning(response)) {
          throw new Error(`Mottok ugyldig pensjonsberegning: ${response}`)
        }
        return response
      },
    }),
  }),
})

export const { useGetPensjonsberegningQuery } = apiSlice

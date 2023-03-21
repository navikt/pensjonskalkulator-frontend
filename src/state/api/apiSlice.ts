import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_MSW_BASEURL ?? ''}/pensjon/kalkulator/api`,
  }),
  endpoints: (builder) => ({
    getPensjonsberegning: builder.query<Pensjonsberegning[], void>({
      // Full request url med baseQuery: '${env.VITE_MSW_BASEURL}/pensjon/kalkulator/api/pensjonsberegning'
      query: () => '/pensjonsberegning',
      transformResponse: (rawResult: Pensjonsberegning[], meta) => {
        if (!rawResult || rawResult.length === 0) {
          throw new Error('lorem ipsum')
        }
        return rawResult
      },
    }),
  }),
})

export const { useGetPensjonsberegningQuery } = apiSlice

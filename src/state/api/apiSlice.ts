import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/pensjon/kalkulator/api' }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getStatus` endpoint is a "query" operation that returns data
    getStatus: builder.query<string, void>({
      // The URL for the request is '/pensjon/kalkulator/api/status'
      query: () => '/status',
      transformResponse: (rawResult: { status: string }, meta) => {
        // The optional `meta` property is available based on the type for the `baseQuery` used
        // The return value for `transformResponse` must match `ResultType`
        return rawResult.status
      },
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetStatusQuery } = apiSlice

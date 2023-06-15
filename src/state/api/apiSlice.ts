import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  isPerson,
  isPensjonsavtale,
  isTpoMedlemskap,
  isUnleashToggle,
  isUttaksalder,
  isSimuleringResponseBody,
} from './typeguards'
import { API_BASEURL } from '@/api/paths'
import {
  SimuleringRequestBody,
  SimuleringResponseBody,
  UttaksalderRequestBody,
} from '@/state/api/apiSlice.types'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASEURL,
  }),

  endpoints: (builder) => ({
    tidligsteUttaksalder: builder.query<
      Uttaksalder,
      UttaksalderRequestBody | void
    >({
      query: (body) => ({
        url: '/tidligste-uttaksalder',
        method: 'POST',
        body,
      }),
      transformResponse: (response: Uttaksalder) => {
        if (!isUttaksalder(response)) {
          throw new Error(`Mottok ugyldig uttaksalder: ${response}`)
        }
        return response
      },
    }),
    simulering: builder.query<SimuleringResponseBody, SimuleringRequestBody>({
      query: (body) => ({
        url: '/alderspensjon/simulering',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SimuleringResponseBody) => {
        if (!isSimuleringResponseBody(response)) {
          throw new Error(`Mottok ugyldig simulering: ${response}`)
        }
        return response
      },
    }),
    getPerson: builder.query<Person, void>({
      query: () => '/person',
      transformResponse: (response) => {
        if (!isPerson(response)) {
          throw new Error(`Mottok ugyldig person: ${response}`)
        }
        return response
      },
    }),
    getTpoMedlemskap: builder.query<TpoMedlemskap, void>({
      query: () => '/tpo-medlemskap',
      transformResponse: (response: TpoMedlemskap) => {
        if (!isTpoMedlemskap(response)) {
          throw new Error(`Mottok ugyldig tpo-medlemskap:`, response)
        }
        return response
      },
    }),
    getPensjonsavtaler: builder.query<Pensjonsavtale[], void>({
      query: () => '/pensjonsavtaler',
      transformResponse: (response: Pensjonsavtale[]) => {
        if (!isPensjonsavtale(response)) {
          throw new Error(`Mottok ugyldig pensjonsavtale:`, response)
        }
        return response
      },
    }),
    getSpraakvelgerFeatureToggle: builder.query<UnleashToggle, void>({
      query: () => '/feature/pensjonskalkulator.disable-spraakvelger',
      transformResponse: (response: UnleashToggle) => {
        if (!isUnleashToggle(response)) {
          throw new Error(`Mottok ugyldig unleash response:`, response)
        }
        return response
      },
    }),
  }),
})

export const {
  useTidligsteUttaksalderQuery,
  useSimuleringQuery,
  useGetPersonQuery,
  useGetPensjonsavtalerQuery,
  useGetTpoMedlemskapQuery,
  useGetSpraakvelgerFeatureToggleQuery,
} = apiSlice

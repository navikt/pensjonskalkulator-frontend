import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  isInntekt,
  isPensjonsberegningArray,
  isPerson,
  isPensjonsavtale,
  isTpoMedlemskap,
  isUnleashToggle,
  isAlder,
  isEkskludertStatus,
} from './typeguards'
import { API_BASEURL } from '@/paths'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASEURL,
  }),
  tagTypes: ['Person', 'Inntekt', 'Alderspensjon', 'TidligstMuligHeltUttak'],
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getInntekt: builder.query<Inntekt, void>({
      query: () => '/inntekt',
      providesTags: ['Inntekt'],
      transformResponse: (response) => {
        if (!isInntekt(response)) {
          throw new Error(`Mottok ugyldig inntekt: ${response}`)
        }
        return response
      },
    }),
    getPerson: builder.query<Person, void>({
      query: () => '/v1/person',
      providesTags: ['Person'],
      transformResponse: (response) => {
        if (!isPerson(response)) {
          throw new Error(`Mottok ugyldig person: ${response}`)
        }
        return {
          ...response,
          foedselsdato: response.foedselsdato,
        }
      },
    }),
    getEkskludertStatus: builder.query<EkskludertStatus, void>({
      query: () => '/v1/ekskludert',
      transformResponse: (response: any) => {
        if (!isEkskludertStatus(response)) {
          throw new Error(`Mottok ugyldig ekskludert response:`, response)
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
    tidligstMuligHeltUttak: builder.query<
      Alder,
      TidligstMuligHeltUttakRequestBody | void
    >({
      query: (body) => ({
        url: '/v1/tidligste-hel-uttaksalder',
        method: 'POST',
        body,
      }),
      providesTags: ['TidligstMuligHeltUttak'],
      transformResponse: (response: Alder) => {
        if (!isAlder(response)) {
          throw new Error(`Mottok ugyldig uttaksalder: ${response}`)
        }
        return response
      },
    }),
    tidligstMuligGradertUttak: builder.query<
      Alder,
      TidligstMuligGradertUttakRequestBody | void
    >({
      query: (body) => ({
        url: '/v1/tidligste-gradert-uttaksalder',
        method: 'POST',
        body,
      }),
      transformResponse: (response: Alder) => {
        if (!isAlder(response)) {
          throw new Error(`Mottok ugyldig uttaksalder: ${response}`)
        }
        return response
      },
    }),
    pensjonsavtaler: builder.query<
      { avtaler: Pensjonsavtale[]; partialResponse: boolean },
      PensjonsavtalerRequestBody
    >({
      query: (body) => ({
        url: '/v2/pensjonsavtaler',
        method: 'POST',
        body,
      }),
      transformResponse: (response: PensjonsavtalerResponseBody) => {
        if (
          !response.avtaler ||
          !Array.isArray(response.avtaler) ||
          response.avtaler.some((avtale) => !isPensjonsavtale(avtale))
        ) {
          throw new Error(`Mottok ugyldig pensjonsavtale: ${response}`)
        }
        const avtalerWithKeys = response.avtaler.map((avtale, index) => ({
          ...avtale,
          key: index,
        }))

        return {
          avtaler: avtalerWithKeys,
          partialResponse: response.utilgjengeligeSelskap.length > 0,
        }
      },
    }),

    alderspensjon: builder.query<
      AlderspensjonResponseBody,
      AlderspensjonRequestBody
    >({
      query: (body) => ({
        url: '/v2/alderspensjon/simulering',
        method: 'POST',
        body,
      }),
      providesTags: ['Alderspensjon'],
      transformResponse: (response: AlderspensjonResponseBody) => {
        if (
          !isPensjonsberegningArray(response?.alderspensjon) ||
          !isPensjonsberegningArray(response?.afpPrivat)
        ) {
          throw new Error(
            `Mottok ugyldig alderspensjon: ${response?.alderspensjon}`
          )
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
    getHighchartsAccessibilityPluginFeatureToggle: builder.query<
      UnleashToggle,
      void
    >({
      query: () =>
        '/feature/pensjonskalkulator.enable-highcharts-accessibility-plugin',
      transformResponse: (response: UnleashToggle) => {
        if (!isUnleashToggle(response)) {
          throw new Error(`Mottok ugyldig unleash response:`, response)
        }
        return response
      },
    }),
    getDetaljertFaneFeatureToggle: builder.query<UnleashToggle, void>({
      query: () => '/feature/pensjonskalkulator.enable-detaljert-fane',
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
  useGetInntektQuery,
  useGetPersonQuery,
  useGetEkskludertStatusQuery,
  useGetTpoMedlemskapQuery,
  useTidligstMuligHeltUttakQuery,
  useTidligstMuligGradertUttakQuery,
  useAlderspensjonQuery,
  usePensjonsavtalerQuery,
  useGetSpraakvelgerFeatureToggleQuery,
  useGetHighchartsAccessibilityPluginFeatureToggleQuery,
  useGetDetaljertFaneFeatureToggleQuery,
} = apiSlice

import { redirect } from 'react-router'
import {
  defer,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
} from 'react-router-dom'

import {
  BaseQueryFn,
  TypedUseQueryStateResult,
} from '@reduxjs/toolkit/query/react'

import { HOST_BASEURL } from '@/paths'
import { externalUrls, henvisningUrlParams, paths } from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import { isFoedtFoer1963 } from '@/utils/alder'

export interface LoginContext {
  isLoggedIn: boolean
}

export function useDeferAuthenticationAccessData<
  TReturnedValue extends ReturnType<typeof authenticationDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function authenticationDeferredLoader<
  TData extends {
    oauth2Query: Response
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const authenticationGuard = async () => {
  const res = fetch(`${HOST_BASEURL}/oauth2/session`)
  return defer({
    oauth2Query: res,
  })
}

export const directAccessGuard = async () => {
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect(paths.start)
  }
  return null
}

// ///////////////////////////////////////////
export type GetPersonQuery = TypedUseQueryStateResult<
  Person,
  void,
  BaseQueryFn<Record<string, unknown>, Person>
>

export function useLandingPageAccessData<
  TReturnedValue extends ReturnType<typeof landingPageDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function landingPageDeferredLoader<
  TData extends {
    getPersonQuery: GetPersonQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const landingPageAccessGuard = async () => {
  // Sørger for at brukere født før 1963 ikke aksesserer vår kalkulator
  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  if (
    (await getPersonQuery).isSuccess &&
    (await getPersonQuery).data?.foedselsdato &&
    isFoedtFoer1963((await getPersonQuery).data?.foedselsdato as string)
  ) {
    window.open(externalUrls.detaljertKalkulator, '_self')
  }
  // if ((await getPersonQuery).isError) {
  //   store.dispatch(apiSlice.util.invalidateTags(['Person']))
  // }
  console.log('>>> landingPageAccessGuard')

  return defer({
    getPersonQuery,
  })
}

/// ////////////////////////////////////////////////////////////////////////

export function useStep0AccessData<
  TReturnedValue extends ReturnType<typeof step0DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step0DeferredLoader<
  TData extends {
    getPersonQuery: GetPersonQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step0AccessGuard = async () => {
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect(paths.start)
  }

  // Henter inntekt til senere
  const getInntektQuery = store.dispatch(
    apiSlice.endpoints.getInntekt.initiate()
  )
  // if ((await getInntektQuery).isError) {
  //   store.dispatch(apiSlice.util.invalidateTags(['Inntekt']))
  // }

  // Sørger for at brukeren er redirigert til henvisningsside iht. ekskludertStatus
  const getEkskludertStatusQuery = store.dispatch(
    apiSlice.endpoints.getEkskludertStatus.initiate()
  )

  if ((await getEkskludertStatusQuery).isSuccess) {
    const data = (await getEkskludertStatusQuery)?.data
    if (data?.ekskludert) {
      if (data?.aarsak === 'HAR_GJENLEVENDEYTELSE') {
        redirect(`${paths.henvisning}/${henvisningUrlParams.gjenlevende}`)
      } else if (data?.aarsak === 'ER_APOTEKER') {
        redirect(`${paths.henvisning}/${henvisningUrlParams.apotekerne}`)
      }
    }
  }
  // if ((await getEkskludertStatusQuery).isSuccess) {
  //   store.dispatch(apiSlice.util.invalidateTags(['EkskludertStatus']))
  // }

  // Sørger for at brukere født før 1963 ikke aksesserer vår kalkulator
  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  if ((await getPersonQuery).isSuccess) {
    if (
      (await getPersonQuery).data?.foedselsdato &&
      isFoedtFoer1963((await getPersonQuery).data?.foedselsdato as string)
    ) {
      window.open(externalUrls.detaljertKalkulator, '_self')
    }
  }
  // if ((await getPersonQuery).isError) {
  //   store.dispatch(apiSlice.util.invalidateTags(['Person']))
  // }

  return defer({
    getPersonQuery,
  })
}

// ///////////////////////////////////////////

export type GetTpoMedlemskapQuery = TypedUseQueryStateResult<
  TpoMedlemskap,
  void,
  BaseQueryFn<Record<string, unknown>, TpoMedlemskap>
>

export function useStep3AccessData<
  TReturnedValue extends ReturnType<typeof step3DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step3DeferredLoader<
  TData extends {
    getTpoMedlemskapQuery: GetTpoMedlemskapQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step3AccessGuard = async () => {
  const harSamtykket = store.getState().userInput.samtykke

  // Dersom brukeren prøver å aksessere steget direkte uten å ha svart på samtykke spørsmålet sendes den til start steget
  if (harSamtykket === null) {
    return redirect(paths.start)
  }

  // Dersom brukeren samtykker kaller vi tp-registret
  if (harSamtykket) {
    const getTpoMedlemskapQuery = store.dispatch(
      apiSlice.endpoints.getTpoMedlemskap.initiate()
    )
    // Dersom brukeren ikke har noe tp-forhold behøver ikke dette steget å vises
    if (
      (await getTpoMedlemskapQuery).isSuccess &&
      !(await getTpoMedlemskapQuery).data?.harTjenestepensjonsforhold
    ) {
      return redirect(paths.afp)
    }
    return defer({
      getTpoMedlemskapQuery,
    })
  } else {
    // Dersom brukeren ikke samtykker til henting av tpo behøver ikke dette steget å vises
    return redirect(paths.afp)
  }
}

/// ////////////////////////////////////////////////////////////////////////

export function useStep4AccessData<
  TReturnedValue extends ReturnType<typeof step4DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

export type GetEkskludertStatusQuery = TypedUseQueryStateResult<
  EkskludertStatus,
  void,
  BaseQueryFn<Record<string, unknown>, EkskludertStatus>
>

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step4DeferredLoader<
  TData extends {
    getEkskludertStatusQuery: GetEkskludertStatusQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step4AccessGuard = async () => {
  // const location = useLocation()
  // console.log('>>> step4AccessGuard trying to use useLocation', location)

  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect(paths.start)
  }

  // Sørger for at brukeren er redirigert til henvisningsside iht. ekskludertStatus
  const getEkskludertStatusQuery = store.dispatch(
    apiSlice.endpoints.getEkskludertStatus.initiate()
  )

  if ((await getEkskludertStatusQuery).isError) {
    return redirect(paths.uventetFeil)
  }

  if ((await getEkskludertStatusQuery).isSuccess) {
    const data = (await getEkskludertStatusQuery)?.data
    if (data?.ekskludert) {
      if (data?.aarsak === 'HAR_GJENLEVENDEYTELSE') {
        redirect(`${paths.henvisning}/${henvisningUrlParams.gjenlevende}`)
      } else if (data?.aarsak === 'ER_APOTEKER') {
        redirect(`${paths.henvisning}/${henvisningUrlParams.apotekerne}`)
      }
    }
  }

  return defer({
    getEkskludertStatusQuery,
  })
}

/// ////////////////////////////////////////////////////////////////////////

export function useStep5AccessData<
  TReturnedValue extends ReturnType<typeof step5DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step5DeferredLoader<
  TData extends {
    getEkskludertStatusQuery: GetEkskludertStatusQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step5AccessGuard = async () => {
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect(paths.start)
  }

  // Sørger for at brukeren ikke går videre dersom ekskludertStatus ikke kunne hentes
  const getEkskludertStatusQuery = store.dispatch(
    apiSlice.endpoints.getEkskludertStatus.initiate()
  )

  // if ((await getEkskludertStatusQuery).isError) {
  //   return redirect(paths.uventetFeil)
  // } else {
  return defer({
    getEkskludertStatusQuery,
  })
  // }
}

/// ////////////////////////////////////////////////////////////////////////

export function useStep6AccessData<
  TReturnedValue extends ReturnType<typeof step6DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

export type GetInntektQuery = TypedUseQueryStateResult<
  Inntekt,
  void,
  BaseQueryFn<Record<string, unknown>, Inntekt>
>

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step6DeferredLoader<
  TData extends {
    getPersonQuery: GetPersonQuery
    getInntektQuery: GetInntektQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step6AccessGuard = async () => {
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect(paths.start)
  }

  // Sørger for at brukeren ikke går videre dersom person eller inntekt ikke kunne hentes
  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  const getInntektQuery = store.dispatch(
    apiSlice.endpoints.getInntekt.initiate()
  )

  if ((await getPersonQuery).isError || (await getInntektQuery).isError) {
    return redirect(paths.uventetFeil)
  } else {
    // Hvis getPerson har feilet før og fungerer nå, sørger for at brukere født før 1963 ikke aksesserer vår kalkulator
    if (
      (await getPersonQuery).data?.foedselsdato &&
      isFoedtFoer1963((await getPersonQuery).data?.foedselsdato as string)
    ) {
      window.open(externalUrls.detaljertKalkulator, '_self')
    }
    return defer({
      getPersonQuery,
      getInntektQuery,
    })
  }
}

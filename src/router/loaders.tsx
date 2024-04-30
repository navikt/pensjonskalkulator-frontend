import { redirect } from 'react-router'
import { defer, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

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

// ////////////////////////////////////////

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
  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  getPersonQuery.then((res) => {
    if (res?.isSuccess && isFoedtFoer1963(res?.data?.foedselsdato as string)) {
      window.open(externalUrls.detaljertKalkulator, '_self')
    }
  })

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
    shouldRedirectTo: string | undefined
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step0AccessGuard = async () => {
  let resolveRedirectUrl: (value: string | PromiseLike<string>) => void

  const shouldRedirectTo: Promise<string> = new Promise((resolve) => {
    resolveRedirectUrl = resolve
  })
  // Henter inntekt til senere
  store.dispatch(apiSlice.endpoints.getInntekt.initiate())

  // Sørger for at brukeren er redirigert til henvisningsside iht. ekskludertStatus
  const getEkskludertStatusQuery = store.dispatch(
    apiSlice.endpoints.getEkskludertStatus.initiate()
  )

  getEkskludertStatusQuery.then((res) => {
    if (res?.data?.ekskludert) {
      if (res?.data?.aarsak === 'HAR_GJENLEVENDEYTELSE') {
        resolveRedirectUrl(
          `${paths.henvisning}/${henvisningUrlParams.gjenlevende}`
        )
      } else if (res?.data?.aarsak === 'ER_APOTEKER') {
        resolveRedirectUrl(
          `${paths.henvisning}/${henvisningUrlParams.apotekerne}`
        )
      } else {
        resolveRedirectUrl('')
      }
    } else {
      resolveRedirectUrl('')
    }
  })

  // Sørger for at brukere født før 1963 ikke aksesserer vår kalkulator
  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())

  if (
    (await getPersonQuery).data?.foedselsdato &&
    isFoedtFoer1963((await getPersonQuery).data?.foedselsdato as string)
  ) {
    window.open(externalUrls.detaljertKalkulator, '_self')
  }

  return defer({
    getPersonQuery,
    shouldRedirectTo,
  })
}

// ///////////////////////////////////////////

export type TpoMedlemskapQuery = TypedUseQueryStateResult<
  TpoMedlemskap,
  void,
  BaseQueryFn<Record<string, unknown>, TpoMedlemskap>
>

export function useTpoMedlemskapAccessData<
  TReturnedValue extends ReturnType<typeof tpoMedlemskapDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function tpoMedlemskapDeferredLoader<
  TData extends {
    getTpoMedlemskapQuery: TpoMedlemskapQuery
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const tpoMedlemskapAccessGuard = async () => {
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
    return defer({
      getTpoMedlemskapQuery,
    })
  } else {
    // Dersom brukeren ikke samtykker til henting av tpo behøver ikke dette steget å vises
    return redirect(paths.afp)
  }
}

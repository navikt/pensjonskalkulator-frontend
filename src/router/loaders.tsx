import { redirect } from 'react-router'
import { defer, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

import { HOST_BASEURL } from '@/paths'
import { externalUrls, henvisningUrlParams, paths } from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import { selectIsVeileder, selectAfp } from '@/state/userInput/selectors'
import { isFoedtFoer1963 } from '@/utils/alder'
import { logger } from '@/utils/logging'
import { checkHarSamboer } from '@/utils/sivilstand'

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
    store.getState().api?.queries === undefined ||
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
    shouldRedirectTo: string | undefined
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const landingPageAccessGuard = async () => {
  let resolveRedirectUrl: (
    value: string | PromiseLike<string>
  ) => void = () => {}

  const shouldRedirectTo: Promise<string> = new Promise((resolve) => {
    resolveRedirectUrl = resolve
  })

  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  getPersonQuery
    .then((res) => {
      if (
        res?.isSuccess &&
        isFoedtFoer1963(res?.data?.foedselsdato as string)
      ) {
        resolveRedirectUrl('')
        window.open(externalUrls.detaljertKalkulator, '_self')
      } else {
        if (selectIsVeileder(store.getState())) {
          resolveRedirectUrl(paths.start)
        } else {
          resolveRedirectUrl('')
        }
      }
    })
    .catch(() => {
      resolveRedirectUrl('')
    })

  return defer({
    shouldRedirectTo,
  })
}

/// ////////////////////////////////////////////////////////////////////////

export function useStepStartAccessData<
  TReturnedValue extends ReturnType<typeof stepStartDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function stepStartDeferredLoader<
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

export const stepStartAccessGuard = async () => {
  let resolveRedirectUrl: (value: string | PromiseLike<string>) => void

  const shouldRedirectTo: Promise<string> = new Promise((resolve) => {
    resolveRedirectUrl = resolve
  })

  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  getPersonQuery.then((res) => {
    if (res?.isSuccess && isFoedtFoer1963(res?.data?.foedselsdato as string)) {
      window.open(externalUrls.detaljertKalkulator, '_self')
    }
  })

  // Henter inntekt til senere
  store.dispatch(apiSlice.endpoints.getInntekt.initiate())
  // Henter omstillingsstønad-og-gjenlevende til senere
  store.dispatch(
    apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate()
  )

  // Sørger for at brukeren er redirigert til henvisningsside iht. ekskludertStatus
  const getEkskludertStatusQuery = store.dispatch(
    apiSlice.endpoints.getEkskludertStatus.initiate()
  )

  getEkskludertStatusQuery.then((res) => {
    if (res?.data?.ekskludert) {
      if (res?.data?.aarsak === 'ER_APOTEKER') {
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

  return defer({
    getPersonQuery,
    shouldRedirectTo,
  })
}

// ///////////////////////////////////////////

export function useStepSivilstandAccessData<
  TReturnedValue extends ReturnType<typeof stepSivilstandDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function stepSivilstandDeferredLoader<
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

export const stepSivilstandAccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }
  let resolveRedirectUrl: (
    value: string | PromiseLike<string>
  ) => void = () => {}

  const shouldRedirectTo: Promise<string> = new Promise((resolve) => {
    resolveRedirectUrl = resolve
  })

  let resolveGetPerson: (
    value: null | GetPersonQuery | PromiseLike<GetPersonQuery>
  ) => void = () => {}

  const getPersonQuery: Promise<null | GetPersonQuery> = new Promise(
    (resolve) => {
      resolveGetPerson = resolve
    }
  )

  const getPersonPreviousResponse = apiSlice.endpoints.getPerson.select(
    undefined
  )(store.getState())

  // Hvis getPerson har blitt fetchet tidligere, gjenbruk responsen
  if (getPersonPreviousResponse.isSuccess) {
    if (
      getPersonPreviousResponse?.data?.sivilstand &&
      checkHarSamboer(getPersonPreviousResponse.data.sivilstand)
    ) {
      resolveRedirectUrl(paths.utenlandsopphold)
      resolveGetPerson(getPersonPreviousResponse)
    } else {
      resolveRedirectUrl('')
      resolveGetPerson(getPersonPreviousResponse)
    }
  } else {
    // Hvis getPerson har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
    const newGetPersonQuery = store.dispatch(
      apiSlice.endpoints.getPerson.initiate()
    )
    newGetPersonQuery.then((res) => {
      if (res.isError) {
        resolveRedirectUrl(paths.uventetFeil)
        resolveGetPerson(res)
      }
      if (res.isSuccess) {
        if (isFoedtFoer1963(res?.data?.foedselsdato as string)) {
          window.open(externalUrls.detaljertKalkulator, '_self')
          resolveRedirectUrl('')
          resolveGetPerson(res)
        } else if (
          res?.data?.sivilstand &&
          checkHarSamboer(res.data.sivilstand)
        ) {
          resolveRedirectUrl(paths.utenlandsopphold)
          resolveGetPerson(res)
        } else {
          resolveRedirectUrl('')
          resolveGetPerson(res)
        }
      }
    })
  }

  return defer({
    getPersonQuery,
    shouldRedirectTo,
  })
}

/// ////////////////////////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////////////////////////

export function useStepAFPAccessData<
  TReturnedValue extends ReturnType<typeof stepAFPDeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function stepAFPDeferredLoader<
  TData extends {
    shouldRedirectTo: string | undefined
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const stepAFPAccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }
  let resolveRedirectUrl: (
    value: string | PromiseLike<string>
  ) => void = () => {}

  const shouldRedirectTo: Promise<string> = new Promise((resolve) => {
    resolveRedirectUrl = resolve
  })

  const hasInntektPreviouslyFailed = apiSlice.endpoints.getInntekt.select(
    undefined
  )(store.getState()).isError

  const hasOmstillingsstoenadOgGjenlevendePreviouslyFailed =
    apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.select(undefined)(
      store.getState()
    ).isError

  const hasEkskludertStatusPreviouslyFailed =
    apiSlice.endpoints.getEkskludertStatus.select(undefined)(
      store.getState()
    ).isError

  store.dispatch(apiSlice.endpoints.getUfoeregrad.initiate()).then((res) => {
    if (res.isError) {
      resolveRedirectUrl(paths.uventetFeil)
    }
    if (res.isSuccess) {
      // Hvis alle kallene er vellykket, resolve
      if (
        !hasInntektPreviouslyFailed &&
        !hasOmstillingsstoenadOgGjenlevendePreviouslyFailed &&
        !hasEkskludertStatusPreviouslyFailed
      ) {
        resolveRedirectUrl('')
      }
      // Hvis inntekt har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
      if (hasInntektPreviouslyFailed) {
        store
          .dispatch(apiSlice.endpoints.getInntekt.initiate())
          .then((inntektRes) => {
            if (inntektRes.isError) {
              resolveRedirectUrl(paths.uventetFeil)
            } else if (
              apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.select(
                undefined
              )(store.getState()).isSuccess &&
              apiSlice.endpoints.getEkskludertStatus.select(undefined)(
                store.getState()
              ).isSuccess
            ) {
              resolveRedirectUrl('')
            }
          })
      }

      // Hvis omstillingsstønad-og-gjenlevende har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
      if (hasOmstillingsstoenadOgGjenlevendePreviouslyFailed) {
        store
          .dispatch(
            apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate()
          )
          .then((omstillingsstoenadOgGjenlevendeRes) => {
            if (omstillingsstoenadOgGjenlevendeRes.isError) {
              logger('info', {
                tekst: 'omstillingsstønad og gjenlevende feilet',
              })
              resolveRedirectUrl(paths.uventetFeil)
            } else if (
              apiSlice.endpoints.getInntekt.select(undefined)(store.getState())
                .isSuccess &&
              apiSlice.endpoints.getEkskludertStatus.select(undefined)(
                store.getState()
              ).isSuccess
            ) {
              resolveRedirectUrl('')
            }
          })
      }

      // Hvis ekskludertStatus har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
      if (hasEkskludertStatusPreviouslyFailed) {
        store
          .dispatch(apiSlice.endpoints.getEkskludertStatus.initiate())
          .then((ekskludertStatusRes) => {
            if (ekskludertStatusRes.isError) {
              logger('info', {
                tekst: 'ekskludert feilet',
              })
              resolveRedirectUrl(paths.uventetFeil)
            }
            if (res.isSuccess) {
              if (
                ekskludertStatusRes?.data?.ekskludert &&
                ekskludertStatusRes?.data?.aarsak === 'ER_APOTEKER'
              ) {
                resolveRedirectUrl(
                  `${paths.henvisning}/${henvisningUrlParams.apotekerne}`
                )
              } else if (
                apiSlice.endpoints.getInntekt.select(undefined)(
                  store.getState()
                ).isSuccess &&
                apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.select(
                  undefined
                )(store.getState()).isSuccess
              ) {
                resolveRedirectUrl('')
              }
            }
          })
      }
    }
  })

  return defer({
    shouldRedirectTo,
  })
}

/// ////////////////////////////////////////////////////////////////////////

export const stepUfoeretrygdAFPAccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }

  const afp = selectAfp(store.getState())
  const ufoereGradResponse = apiSlice.endpoints.getUfoeregrad.select(undefined)(
    store.getState()
  ).data

  if (ufoereGradResponse?.ufoeregrad && afp !== 'nei') {
    return null
  }
  return redirect(paths.samtykkeOffentligAFP)
}

/// ////////////////////////////////////////////////////////////////////////

export const stepSamtykkeOffentligAFPAccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }

  const afp = selectAfp(store.getState())
  const ufoereGradResponse = apiSlice.endpoints.getUfoeregrad.select(undefined)(
    store.getState()
  ).data

  if (ufoereGradResponse?.ufoeregrad === 0 && afp === 'ja_offentlig') {
    return null
  }
  return redirect(paths.samtykke)
}

// ////////////////////////////////////////

import { redirect } from 'react-router'
import { defer, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

import { HOST_BASEURL } from '@/paths'
import { externalUrls, henvisningUrlParams, paths } from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import { selectAfp } from '@/state/userInput/selectors'
import { isFoedtFoer1963 } from '@/utils/alder'
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

  const getPersonQuery = store.dispatch(apiSlice.endpoints.getPerson.initiate())
  getPersonQuery.then((res) => {
    if (res?.isSuccess && isFoedtFoer1963(res?.data?.foedselsdato as string)) {
      window.open(externalUrls.detaljertKalkulator, '_self')
    }
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

  return defer({
    getPersonQuery,
    shouldRedirectTo,
  })
}

// ///////////////////////////////////////////

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
    shouldRedirectTo: string | undefined
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step3AccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }
  const harSamtykket = store.getState().userInput.samtykke
  let resolveRedirectUrl: (value: string | PromiseLike<string>) => void
  let rejectRedirectUrl: (reason?: unknown) => void

  const shouldRedirectTo: Promise<string> = new Promise((resolve, reject) => {
    resolveRedirectUrl = resolve
    rejectRedirectUrl = reject
  })

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
    getTpoMedlemskapQuery
      .then((res) => {
        if (res.isError) {
          throw new Error()
        }
        if (res?.isSuccess && !res?.data?.harTjenestepensjonsforhold) {
          resolveRedirectUrl(paths.afp)
        } else {
          resolveRedirectUrl('')
        }
      })
      .catch(() => {
        rejectRedirectUrl(null)
      })
    return defer({
      shouldRedirectTo,
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

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step4DeferredLoader<
  TData extends {
    shouldRedirectTo: string | undefined
  },
>(dataFunc: (args?: LoaderFunctionArgs) => TData) {
  return (args?: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData
    }
}

export const step4AccessGuard = async () => {
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

  const hasEkskludertStatusPreviouslyFailed =
    apiSlice.endpoints.getEkskludertStatus.select(undefined)(
      store.getState()
    ).isError

  // Hvis inntekt har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
  if (hasInntektPreviouslyFailed) {
    const getInntektQuery = store.dispatch(
      apiSlice.endpoints.getInntekt.initiate()
    )
    getInntektQuery.then((res) => {
      if (res.isError) {
        resolveRedirectUrl(paths.uventetFeil)
      } else if (
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
    const getEkskludertStatusQuery = store.dispatch(
      apiSlice.endpoints.getEkskludertStatus.initiate()
    )
    getEkskludertStatusQuery.then((res) => {
      if (res.isError) {
        resolveRedirectUrl(paths.uventetFeil)
      }
      if (
        res?.data?.ekskludert &&
        res?.data?.aarsak === 'HAR_GJENLEVENDEYTELSE'
      ) {
        resolveRedirectUrl(
          `${paths.henvisning}/${henvisningUrlParams.gjenlevende}`
        )
      } else if (res?.data?.ekskludert && res?.data?.aarsak === 'ER_APOTEKER') {
        resolveRedirectUrl(
          `${paths.henvisning}/${henvisningUrlParams.apotekerne}`
        )
      } else if (
        apiSlice.endpoints.getInntekt.select(undefined)(store.getState())
          .isSuccess
      ) {
        resolveRedirectUrl('')
      }
    })
  }
  if (!hasInntektPreviouslyFailed && !hasEkskludertStatusPreviouslyFailed) {
    resolveRedirectUrl('')
  }

  return defer({
    shouldRedirectTo,
  })
}

/// ////////////////////////////////////////////////////////////////////////

export const step5AccessGuard = async () => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }

  const afp = selectAfp(store.getState())
  const ekskludertStatusResponse =
    apiSlice.endpoints.getEkskludertStatus.select(undefined)(
      store.getState()
    ).data

  if (
    ekskludertStatusResponse?.ekskludert &&
    ekskludertStatusResponse.aarsak === 'HAR_LOEPENDE_UFOERETRYGD' &&
    afp !== 'nei'
  ) {
    return null
  }
  return redirect(paths.sivilstand)
}

// ////////////////////////////////////////

export function useStep6AccessData<
  TReturnedValue extends ReturnType<typeof step6DeferredLoader>,
>() {
  return useLoaderData() as ReturnType<TReturnedValue>['data']
}

{
  /* c8 ignore next 11 - Dette er kun for typing */
}
export function step6DeferredLoader<
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

export const step6AccessGuard = async () => {
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

  // Hvis getPerson har feilet tidligere, prøv igjen og redirect til uventet feil ved ny feil
  if (getPersonPreviousResponse.isError) {
    const newGetPersonQuery = store.dispatch(
      apiSlice.endpoints.getPerson.initiate()
    )
    newGetPersonQuery.then((res) => {
      if (res.isError) {
        resolveRedirectUrl(paths.uventetFeil)
        resolveGetPerson(null)
      } else if (
        res?.isSuccess &&
        isFoedtFoer1963(res?.data?.foedselsdato as string)
      ) {
        window.open(externalUrls.detaljertKalkulator, '_self')
        resolveGetPerson(null)
      } else if (
        res?.data?.sivilstand &&
        checkHarSamboer(res.data.sivilstand)
      ) {
        resolveRedirectUrl(paths.beregningEnkel)
        resolveGetPerson(res)
      } else {
        resolveRedirectUrl('')
        resolveGetPerson(res)
      }
    })
  } else {
    if (
      getPersonPreviousResponse?.data?.sivilstand &&
      checkHarSamboer(getPersonPreviousResponse.data.sivilstand)
    ) {
      resolveRedirectUrl(paths.beregningEnkel)
      resolveGetPerson(getPersonPreviousResponse)
    } else {
      resolveRedirectUrl('')
      resolveGetPerson(getPersonPreviousResponse)
    }
  }

  return defer({
    getPersonQuery,
    shouldRedirectTo,
  })
}

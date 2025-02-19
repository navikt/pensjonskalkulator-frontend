import { redirect } from 'react-router'

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { HOST_BASEURL } from '@/paths'
import {
  externalUrls,
  henvisningUrlParams,
  paths,
  stegvisningOrder,
  stegvisningOrderEndring,
} from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'
import {
  selectIsVeileder,
  selectAfp,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import {
  isFoedselsdatoOverEllerLikAlder,
  isFoedtFoer1963,
  AFP_UFOERE_OPPSIGELSESALDER,
} from '@/utils/alder'
import { isLoependeVedtakEndring } from '@/utils/loependeVedtak'
import { logger } from '@/utils/logging'

export interface LoginContext {
  isLoggedIn: boolean
}

export type AuthenticationGuardLoader = { authResponse: Promise<Response> }

export async function authenticationGuard(): Promise<AuthenticationGuardLoader> {
  const authResponse = fetch(`${HOST_BASEURL}/oauth2/session`)
  return { authResponse }
}

export const directAccessGuard = async () => {
  const state = store.getState()
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    state.api?.queries === undefined ||
    Object.keys(state.api.queries).length === 0
  ) {
    return redirect(paths.start)
  }
  return null
}

// ////////////////////////////////////////

export type LandingPageAccessGuardLoader = { shouldRedirectTo: Promise<string> }

export const landingPageAccessGuard =
  async (): Promise<LandingPageAccessGuardLoader> => {
    const getRedirect1963FeatureToggleQuery = store.dispatch(
      apiSlice.endpoints.getRedirect1963FeatureToggle.initiate()
    )

    const getPersonQuery = store.dispatch(
      apiSlice.endpoints.getPerson.initiate()
    )
    const shouldRedirectTo = Promise.all([
      getRedirect1963FeatureToggleQuery,
      getPersonQuery,
    ])
      .then(([getRedirect1963FeatureToggleRes, getPersonRes]) => {
        if (
          getRedirect1963FeatureToggleRes.data?.enabled &&
          getPersonRes?.isSuccess &&
          isFoedtFoer1963(getPersonRes?.data?.foedselsdato as string)
        ) {
          // Håndterer når bruker kommer tilbake på siden etter redirect - bfcache - https://web.dev/articles/bfcache
          window.addEventListener('pageshow', (event: PageTransitionEvent) => {
            if (event.persisted) {
              window.open(externalUrls.detaljertKalkulator, '_self')
            }
          })
          window.open(externalUrls.detaljertKalkulator, '_self')
          return ''
        } else {
          if (selectIsVeileder(store.getState())) {
            return paths.start
          } else {
            return ''
          }
        }
      })
      .catch(() => {
        return ''
      })
    return { shouldRedirectTo }
  }

/// ////////////////////////////////////////////////////////////////////////

export type StepStartAccessGuardLoader = {
  getPersonQuery: GetPersonQuery
  getLoependeVedtakQuery: GetLoependeVedtakQuery
  shouldRedirectTo: Promise<string>
}

export const stepStartAccessGuard =
  async (): Promise<StepStartAccessGuardLoader> => {
    const getRedirect1963FeatureToggleQuery = store.dispatch(
      apiSlice.endpoints.getRedirect1963FeatureToggle.initiate()
    )
    // Sørger for at brukeren er redirigert til henvisningsside iht. fødselsdato
    const getPersonQuery = store.dispatch(
      apiSlice.endpoints.getPerson.initiate()
    )
    // Sørger for at brukeren er redirigert til henvisningsside iht. ekskludertStatus
    const getEkskludertStatusQuery = store.dispatch(
      apiSlice.endpoints.getEkskludertStatus.initiate()
    )
    // Henter løpende vedtak for endring
    const getLoependeVedtakQuery = store.dispatch(
      apiSlice.endpoints.getLoependeVedtak.initiate()
    )

    // Henter inntekt til senere
    store.dispatch(apiSlice.endpoints.getInntekt.initiate())
    // Henter omstillingsstønad-og-gjenlevende til senere
    store.dispatch(
      apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate()
    )

    const shouldRedirectTo = Promise.all([
      getLoependeVedtakQuery,
      getRedirect1963FeatureToggleQuery,
      getPersonQuery,
      getEkskludertStatusQuery,
    ]).then(
      ([
        getLoependeVedtakRes,
        getRedirect1963FeatureToggleRes,
        getPersonRes,
        getEkskludertStatusRes,
      ]) => {
        if (
          getEkskludertStatusRes?.data?.ekskludert &&
          getEkskludertStatusRes?.data?.aarsak === 'ER_APOTEKER'
        ) {
          return `${paths.henvisning}/${henvisningUrlParams.apotekerne}`
        }

        if (getLoependeVedtakRes.isError) {
          logger('info', {
            tekst: 'Redirect til /uventet-feil',
            data: 'fra Step Start Loader pga. feil med getLoependeVedtak',
          })
          return paths.uventetFeil
        }
        if (getLoependeVedtakRes.isSuccess) {
          logger('info', {
            tekst: 'hent uføregrad',
            data:
              getLoependeVedtakRes.data?.ufoeretrygd.grad === 0
                ? 'Ingen uføretrygd'
                : getLoependeVedtakRes.data?.ufoeretrygd.grad === 100
                  ? 'Hel uføretrygd'
                  : `Gradert uføretrygd`,
          })

          if (getLoependeVedtakRes.data?.alderspensjon) {
            logger('info', {
              tekst: 'Vedtak alderspensjon',
              data: getLoependeVedtakRes.data?.alderspensjon.grad,
            })
          }
          if (getLoependeVedtakRes.data?.afpPrivat) {
            logger('info', {
              tekst: 'Vedtak AFP Privat',
            })
          }
          if (getLoependeVedtakRes.data?.afpOffentlig) {
            logger('info', {
              tekst: 'Vedtak AFP Offentlig',
            })
          }
          if (getLoependeVedtakRes.data?.harFremtidigLoependeVedtak) {
            logger('info', {
              tekst: 'Fremtidig vedtak',
            })
          }
        }

        if (getPersonRes.isError) {
          if ((getPersonRes.error as FetchBaseQueryError).status === 403) {
            return paths.ingenTilgang
          } else {
            logger('info', {
              tekst: 'Redirect til /uventet-feil',
              data: 'fra Step Start Loader pga. feil med getPerson',
            })
            return paths.uventetFeil
          }
        }
        if (getPersonRes.isSuccess) {
          if (
            getRedirect1963FeatureToggleRes?.data?.enabled &&
            isFoedtFoer1963(getPersonRes?.data?.foedselsdato as string)
          ) {
            window.addEventListener(
              'pageshow',
              (event: PageTransitionEvent) => {
                if (event.persisted) {
                  window.open(externalUrls.detaljertKalkulator, '_self')
                }
              }
            )
            window.open(externalUrls.detaljertKalkulator, '_self')
            return ''
          }
          return ''
        }
        return ''
      }
    )

    return {
      getPersonQuery,
      getLoependeVedtakQuery,
      shouldRedirectTo,
    }
  }

// ///////////////////////////////////////////

export type StepSivilstandAccessGuardLoader = {
  getPersonQuery: Promise<Person>
  getGrunnbelopQuery: Promise<number | undefined>
}

export const stepSivilstandAccessGuard = async (): Promise<
  Response | StepSivilstandAccessGuardLoader
> => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }
  const getPersonQuery = store
    .dispatch(apiSlice.endpoints.getPerson.initiate())
    .unwrap()

  const getGrunnbelopQuery = store
    .dispatch(apiSlice.endpoints.getGrunnbelop.initiate())
    .unwrap()
    .then((grunnbelopRes) => grunnbelopRes)
    .catch(() => undefined)

  return {
    getPersonQuery,
    getGrunnbelopQuery,
  }
}

/// ////////////////////////////////////////////////////////////////////////

export type StepAFPAccessGuardLoader = 'VIEW1' | 'VIEW2' | 'VIEW3' // TODO: Lag bedre navn

export const stepAFPAccessGuard = async (): Promise<
  Response | StepAFPAccessGuardLoader
> => {
  if (await directAccessGuard()) {
    return redirect(paths.start)
  }

  // TODO: Trenger vi denne?
  const inntekt = await store
    .dispatch(apiSlice.endpoints.getInntekt.initiate())
    .unwrap()

  // TODO: Trenger vi denne?
  const omstillingsstoenadOgGjenlevendeRes = await store
    .dispatch(apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate())
    .unwrap()

  const ekskludertStatus = await store
    .dispatch(apiSlice.endpoints.getEkskludertStatus.initiate())
    .unwrap()

  if (
    ekskludertStatus.ekskludert &&
    ekskludertStatus.aarsak === 'ER_APOTEKER'
  ) {
    return redirect(`${paths.henvisning}/${henvisningUrlParams.apotekerne}`)
  }

  const person = await store
    .dispatch(apiSlice.endpoints.getPerson.initiate())
    .unwrap()

  const loependeVedtak = await store
    .dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
    .unwrap()

  const stepArrays = isLoependeVedtakEndring(loependeVedtak)
    ? stegvisningOrderEndring
    : stegvisningOrder

  // Hvis brukeren mottar AFP skal hen ikke se AFP steget
  // Hvis brukeren har uføretrygd og er eldre enn min uttaksalder skal hen ikke se AFP steget
  if (
    loependeVedtak.afpPrivat ||
    loependeVedtak.afpOffentlig ||
    (loependeVedtak.ufoeretrygd.grad &&
      person.foedselsdato &&
      isFoedselsdatoOverEllerLikAlder(
        person.foedselsdato,
        AFP_UFOERE_OPPSIGELSESALDER
      ))
  ) {
    return redirect(stepArrays[stepArrays.indexOf(paths.afp) + 1])
  } else {
    // TODO: Her kommer logikken for viewene
    return 'VIEW1'
  }
}

/// ////////////////////////////////////////////////////////////////////////

export const stepUfoeretrygdAFPAccessGuard =
  async (): Promise<Response | null> => {
    if (await directAccessGuard()) {
      return redirect(paths.start)
    }

    const state = store.getState()
    const afp = selectAfp(state)
    const foedselsdato = selectFoedselsdato(state)
    const getLoependeVedtakResponse =
      apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)

    const stepArrays = isLoependeVedtakEndring(
      getLoependeVedtakResponse.data as LoependeVedtak
    )
      ? stegvisningOrderEndring
      : stegvisningOrder

    // Bruker med uføretrygd, som svarer ja til afp, og som er under nedre aldersgrense kan se steget
    if (
      (getLoependeVedtakResponse.data as LoependeVedtak).ufoeretrygd.grad &&
      afp !== 'nei' &&
      !isFoedselsdatoOverEllerLikAlder(
        foedselsdato as string,
        AFP_UFOERE_OPPSIGELSESALDER
      )
    ) {
      return null
    }
    return redirect(stepArrays[stepArrays.indexOf(paths.ufoeretrygdAFP) + 1])
  }

/// ////////////////////////////////////////////////////////////////////////

export const stepSamtykkeOffentligAFPAccessGuard =
  async (): Promise<Response | null> => {
    if (await directAccessGuard()) {
      return redirect(paths.start)
    }

    const state = store.getState()
    const afp = selectAfp(state)
    const getLoependeVedtakResponse =
      apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)

    const stepArrays = isLoependeVedtakEndring(
      getLoependeVedtakResponse.data as LoependeVedtak
    )
      ? stegvisningOrderEndring
      : stegvisningOrder
    if (
      (getLoependeVedtakResponse.data as LoependeVedtak).ufoeretrygd.grad ===
        0 &&
      afp === 'ja_offentlig'
    ) {
      return null
    }
    return redirect(
      stepArrays[stepArrays.indexOf(paths.samtykkeOffentligAFP) + 1]
    )
  }

// ////////////////////////////////////////

import { Page, expect, test } from '@playwright/test'
import fs from 'fs/promises'

import { userInputActions } from '../src/state/userInput/userInputSlice'

declare global {
  interface Window {
    store: { dispatch: (...args: unknown[]) => void }
    router: { navigate: (url: string) => void }
  }
}

export type RouteDefinition = {
  url: RegExp | string
  method?: 'GET' | 'POST'
  fixtureName?: string
  jsonResponse?: Record<string, unknown>
  status?: number
  isHTML?: boolean
}

export { expect, test }

export async function loadJSONFixture(name: string): Promise<unknown> {
  const fileUrl = new URL(`./fixtures/${name}`, import.meta.url)
  const data = await fs.readFile(fileUrl, 'utf-8')
  return JSON.parse(data)
}

export async function loadHTMLFixture(name: string): Promise<string> {
  const fileUrl = new URL(`./fixtures/${name}`, import.meta.url)
  return fs.readFile(fileUrl, 'utf-8')
}

export async function setupInterceptions(
  page: Page,
  overwrites: RouteDefinition[] = []
) {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__DISABLE_MSW__', {
      value: true,
      writable: false,
    })
  })

  await page.context().addCookies([
    {
      name: 'navno-consent',
      value: JSON.stringify({
        consent: { analytics: false, surveys: false },
        userActionTaken: true,
        meta: {
          createdAt: '2025-02-17T09:17:38.688Z',
          updatedAt: '2025-02-17T09:17:38.688Z',
          version: 1,
        },
      }),
      domain: 'localhost',
      path: '/',
    },
  ])

  const routes: RouteDefinition[] = [
    { url: /\/auth\?/, fixtureName: 'decorator-auth.json' },
    { url: 'https://login.ekstern.dev.nav.no/oauth2/session', status: 200 },
    { url: 'https://login.nav.no/oauth2/session', status: 200 },
    {
      url: /representasjon\/harRepresentasjonsforhold/,
      fixtureName: 'representasjon-banner.json',
    },
    { url: /\/collect$/, status: 200 },
    { url: /\/api\/ta/, fixtureName: 'decorator-ta.json' },
    {
      url: /main-menu\?/,
      fixtureName: 'decorator-main-menu.html',
      isHTML: true,
    },
    {
      url: /user-menu\?/,
      fixtureName: 'decorator-user-menu.html',
      isHTML: true,
    },
    { url: /ops-messages/, fixtureName: 'decorator-ops.json' },
    {
      url: /\/env\?chatbot=false&logoutWarning=true&redirectToUrl=/,
      fixtureName: 'decorator-env-features.json',
    },
    {
      url: 'https://amplitude.nav.no/collect-auto',
      method: 'POST',
      status: 200,
    },
    { url: /pensjon\/kalkulator\/oauth2\/session/, status: 200 },
    {
      url: /\/pensjon\/kalkulator\/api\/feature\/pensjonskalkulator\.disable-spraakvelger/,
      fixtureName: 'toggle-disable-spraakvelger.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/feature\/pensjonskalkulator\.vedlikeholdsmodus/,
      jsonResponse: { enabled: false },
    },
    {
      url: /\/pensjon\/kalkulator\/api\/feature\/utvidet-simuleringsresultat/,
      jsonResponse: { enabled: false },
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v2\/ekskludert/,
      fixtureName: 'ekskludert-status.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v1\/loepende-omstillingsstoenad-eller-gjenlevendeytelse/,
      fixtureName: 'omstillingsstoenad-og-gjenlevende.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v4\/vedtak\/loepende-vedtak/,
      fixtureName: 'loepende-vedtak.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v5\/person/,
      fixtureName: 'person.json',
    },
    { url: /\/pensjon\/kalkulator\/api\/inntekt/, fixtureName: 'inntekt.json' },
    {
      url: /\/pensjon\/kalkulator\/api\/v2\/simuler-oftp/,
      method: 'POST',
      fixtureName: 'offentlig-tp.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v2\/tidligste-hel-uttaksalder/,
      method: 'POST',
      fixtureName: 'tidligste-uttaksalder.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v3\/pensjonsavtaler/,
      method: 'POST',
      fixtureName: 'pensjonsavtaler.json',
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v8\/alderspensjon\/simulering/,
      method: 'POST',
      fixtureName: 'alderspensjon.json',
    },
    {
      url: 'https://g.nav.no/api/v1/grunnbel%C3%B8p',
      jsonResponse: {
        dato: '2024-05-01',
        grunnbeløp: 100000,
        grunnbeløpPerMåned: 10000,
        gjennomsnittPerÅr: 120000,
        omregningsfaktor: 1,
        virkningstidspunktForMinsteinntekt: '2024-06-03',
      },
    },
    {
      url: /https?:\/\/api\.uxsignals\.com\/v2\/study\/id\/.*\/active/,
      jsonResponse: { active: false },
    },
  ]

  const routesMatch = (
    route1: RouteDefinition,
    route2: RouteDefinition
  ): boolean => {
    const url1 = route1.url
    const url2 = route2.url
    const method1 = route1.method || 'GET'
    const method2 = route2.method || 'GET'

    let urlMatch = false
    if (typeof url1 === 'string' && typeof url2 === 'string') {
      urlMatch = url1 === url2
    } else if (url1 instanceof RegExp && url2 instanceof RegExp) {
      urlMatch = url1.source === url2.source
    } else if (typeof url1 === 'string' && url2 instanceof RegExp) {
      urlMatch = url2.test(url1)
    } else if (url1 instanceof RegExp && typeof url2 === 'string') {
      urlMatch = url1.test(url2)
    }

    return urlMatch && method1 === method2
  }

  const finalRoutes = routes.map((route) => {
    const overwrite = overwrites.find((overwriteRoute) =>
      routesMatch(route, overwriteRoute)
    )
    return overwrite || route
  })

  const newRoutes = overwrites.filter(
    (overwriteRoute) =>
      !routes.some((route) => routesMatch(route, overwriteRoute))
  )
  finalRoutes.push(...newRoutes)

  page.on('pageerror', handlePageError)

  for (const {
    url,
    method,
    fixtureName,
    jsonResponse,
    status = 200,
    isHTML,
  } of finalRoutes) {
    await page.route(url, async (route) => {
      const reqMethod = route.request().method()
      const expectedMethod = method || 'GET'

      if (reqMethod !== expectedMethod) {
        return route.fallback()
      }

      if (fixtureName) {
        if (isHTML) {
          const body = await loadHTMLFixture(fixtureName)
          return route.fulfill({
            status,
            body,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        } else {
          const data = await loadJSONFixture(fixtureName)
          return route.fulfill({
            status,
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          })
        }
      }

      if (jsonResponse) {
        return route.fulfill({
          status,
          body: JSON.stringify(jsonResponse),
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        })
      }

      return route.fulfill({ status, headers: {} })
    })
  }
}

export async function login(page: Page) {
  await page.goto('/pensjon/kalkulator/', { waitUntil: 'load' })
  const btn = page.getByTestId('landingside-enkel-kalkulator-button')
  await btn.waitFor({ state: 'visible' })

  await Promise.all([
    page.waitForResponse(
      (r) =>
        r.request().method() === 'GET' &&
        r.url().includes('/pensjon/kalkulator/api/v5/person') &&
        r.ok()
    ),
    page.waitForResponse(
      (r) =>
        r.request().method() === 'GET' &&
        r.url().includes('/pensjon/kalkulator/api/v2/ekskludert') &&
        r.ok()
    ),
    page.waitForResponse(
      (r) =>
        r.request().method() === 'GET' &&
        r.url().includes('/pensjon/kalkulator/api/inntekt') &&
        r.ok()
    ),
    page.waitForResponse(
      (r) =>
        r.request().method() === 'GET' &&
        r
          .url()
          .includes(
            '/pensjon/kalkulator/api/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse'
          ) &&
        r.ok()
    ),
    page.waitForResponse(
      (r) =>
        r.request().method() === 'GET' &&
        r.url().includes('/pensjon/kalkulator/api/v4/vedtak/loepende-vedtak') &&
        r.ok()
    ),
    btn.click(),
  ])
}

export async function fillOutStegvisning(
  page: Page,
  args: Partial<{
    samtykke: boolean
    afp: string
    samtykkeAfpOffentlig: boolean
    sivilstand: string
    epsHarPensjon: boolean | null
    epsHarInntektOver2G: boolean | null
  }>
) {
  const {
    samtykke = false,
    afp = 'vet_ikke',
    samtykkeAfpOffentlig = true,
    sivilstand = 'UGIFT',
    epsHarPensjon = null,
    epsHarInntektOver2G = null,
  } = args

  await page.evaluate(
    ({ samtykke: samtykkeValue }) =>
      window.store.dispatch(userInputActions.setSamtykke(samtykkeValue)),
    { samtykke }
  )
  if (afp === 'ja_offentlig') {
    await page.evaluate(
      ({ samtykkeAfpOffentlig: samtykkeAfpOffentligParam }) =>
        window.store.dispatch(
          userInputActions.setSamtykkeOffentligAFP(samtykkeAfpOffentligParam)
        ),
      { samtykkeAfpOffentlig }
    )
  }
  await page.evaluate(
    ({ afp: afpValue }) =>
      window.store.dispatch(userInputActions.setAfp(afpValue)),
    { afp }
  )
  await page.evaluate(
    ({
      sivilstand: sivilstandParam,
      epsHarPensjon: epsHarPensjonParam,
      epsHarInntektOver2G: epsHarInntektOver2GParam,
    }) =>
      window.store.dispatch(
        userInputActions.setSivilstand({
          sivilstand: sivilstandParam,
          epsHarPensjon: epsHarPensjonParam,
          epsHarInntektOver2G: epsHarInntektOver2GParam,
        })
      ),
    { sivilstand, epsHarPensjon, epsHarInntektOver2G }
  )
  await page.evaluate(() => window.router.navigate('/beregning'))
}

export function handlePageError(error: Error) {
  if (
    error.message.includes('Amplitude') ||
    error.stack?.includes(
      'representasjon-banner-frontend-borger-q2.ekstern.dev.nav.no'
    )
  )
    return
  console.error(error)
}

import { Page } from '@playwright/test'

declare global {
  interface Window {
    store: { dispatch: (...args: unknown[]) => void }
    router: { navigate: (url: string) => void }
  }
}

export async function login(page: Page) {
  const personResponsePromise = page.waitForResponse(
    (r) =>
      r.request().method() === 'GET' &&
      r.url().includes('/pensjon/kalkulator/api/v5/person') &&
      r.ok()
  )
  const inntektResponsePromise = page.waitForResponse(
    (r) =>
      r.request().method() === 'GET' &&
      r.url().includes('/pensjon/kalkulator/api/inntekt') &&
      r.ok()
  )
  const omstillingsstoenadResponsePromise = page.waitForResponse(
    (r) =>
      r.request().method() === 'GET' &&
      r
        .url()
        .includes(
          '/pensjon/kalkulator/api/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse'
        ) &&
      r.ok()
  )
  const loependeVedtakResponsePromise = page.waitForResponse(
    (r) =>
      r.request().method() === 'GET' &&
      r.url().includes('/pensjon/kalkulator/api/v4/vedtak/loepende-vedtak') &&
      r.ok()
  )

  await page.goto('/pensjon/kalkulator/', { waitUntil: 'load' })

  const btn = page.getByTestId('landingside-enkel-kalkulator-button')
  await btn.waitFor({ state: 'visible' })

  await Promise.all([
    personResponsePromise,
    inntektResponsePromise,
    omstillingsstoenadResponsePromise,
    loependeVedtakResponsePromise,
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

  await page.waitForFunction(
    () => {
      const w = window as unknown as { store?: { dispatch: unknown } }
      return w.store !== undefined && typeof w.store.dispatch === 'function'
    },
    { timeout: 30000 }
  )

  await page.evaluate(
    ({ samtykke: v }) =>
      window.store.dispatch({ type: 'userInputSlice/setSamtykke', payload: v }),
    { samtykke }
  )

  if (afp === 'ja_offentlig') {
    await page.evaluate(
      ({ v }) =>
        window.store.dispatch({
          type: 'userInputSlice/setSamtykkeOffentligAFP',
          payload: v,
        }),
      { v: samtykkeAfpOffentlig }
    )
  }

  await page.evaluate(
    ({ v }) =>
      window.store.dispatch({ type: 'userInputSlice/setAfp', payload: v }),
    { v: afp }
  )

  await page.evaluate(
    ({ sivilstand: s, epsHarPensjon: epp, epsHarInntektOver2G: epi2g }) =>
      window.store.dispatch({
        type: 'userInputSlice/setSivilstand',
        payload: {
          sivilstand: s,
          epsHarPensjon: epp,
          epsHarInntektOver2G: epi2g,
        },
      }),
    { sivilstand, epsHarPensjon, epsHarInntektOver2G }
  )

  await page.evaluate(() => window.router.navigate('/beregning'))
}

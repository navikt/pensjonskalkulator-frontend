import { Page } from '@playwright/test'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

declare global {
  interface Window {
    store: { dispatch: (...args: unknown[]) => void }
    router: { navigate: (url: string) => void }
  }
}

export async function login(page: Page) {
  await page.goto('/pensjon/kalkulator/', { waitUntil: 'load' })

  const btn = page.getByTestId('landingside-enkel-kalkulator-button')
  await btn.waitFor({ state: 'visible' })

  await page.route('**/api/v5/person', (route) => {
    route.fulfill({ path: resolve(__dirname, '../mocks/person.json') })
  })

  await page.route('**/api/inntekt', (route) => {
    route.fulfill({ path: resolve(__dirname, '../mocks/inntekt.json') })
  })

  await page.route(
    '**/api/v1/omstillingsstoenad-eller-gjenlevendeytelse',
    (route) => {
      route.fulfill({
        path: resolve(
          __dirname,
          '../mocks/loepende-omstillingsstoenad-eller-gjenlevendeytelse.json'
        ),
      })
    }
  )

  await page.route('**/api/v4/vedtak/loepende-vedtak', (route) => {
    route.fulfill({ path: resolve(__dirname, '../mocks/loepende-vedtak.json') })
  })

  await btn.click()

  await page.waitForURL(/\/start/)
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

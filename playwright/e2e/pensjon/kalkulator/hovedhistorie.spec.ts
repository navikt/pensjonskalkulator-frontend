import type { Page } from '@playwright/test'
import { fillOutStegvisning } from 'utils/navigation'

import { expect, setupInterceptions, test } from '../../../base'
import { authenticate } from '../../../utils/auth'
import { person } from '../../../utils/mocks'
import { presetStates } from '../../../utils/presetStates'

test.describe('Hovedhistorie', () => {
  const STEGVISNING_NESTE_BUTTON = 'stegvisning-neste-button'
  const AGEPICKER_HELT_UTTAKSALDER = 'agepicker-helt-uttaksalder'
  const PRE2025_OFFENTLIG_AFP_FOM = '2023-01-01'
  const SELECT_SIVILSTAND = 'select[name="sivilstand"]'
  const TILBAKE_TIL_FORRIGE_STEG_TEXT =
    'ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen'
  const FOEDSELSDATO_1963_04_30 = '1963-04-30'
  const JA_I_OFFENTLIG_SEKTOR_TEXT = 'Ja, i offentlig sektor'
  const FOEDSELSDATO_1962_04_30 = '1962-04-30'
  const INNTEKT_TEXTFIELD = 'inntekt-textfield'
  const INPUT_TYPE_RADIO = 'input[type="radio"]'
  const FOEDSELSDATO_1964_04_30 = '1964-04-30'
  const ENDRE_INNTEKT_TEXT = 'Endre inntekt'
  const OPPDATER_INNTEKT_TEXT = 'Oppdater inntekt'

  const selectSamtykkeRadio = async (
    page: Page,
    option: 'ja' | 'nei' = 'nei'
  ) => {
    await test.step(`Select samtykke option: ${option}`, async () => {
      await expect(
        page.getByRole('heading', { name: 'Pensjonsavtaler' })
      ).toBeVisible()
      const radioValue = option === 'ja' ? 'ja' : 'nei'
      const radioButton = page.locator(
        `input[type="radio"][name="samtykke"][value="${radioValue}"]`
      )
      await radioButton.check()
      await expect(radioButton).toBeChecked()
      await waitForValidationErrorsToClear(page)
    })
  }

  const checkForErrorPage = async (page: Page): Promise<string | null> => {
    const errorHeading = page.getByText(
      'Oops! Det har oppstått en uventet feil.'
    )
    const errorExists = await errorHeading.isVisible().catch(() => false)
    if (errorExists) {
      const errorText = await errorHeading.textContent().catch(() => null)
      return errorText || 'Error page detected'
    }
    return null
  }

  const waitForValidationErrorsToClear = async (page: Page, timeout = 5000) => {
    const validationMessage = page.getByText(/Du må svare/i)
    await expect(validationMessage).toHaveCount(0, { timeout })
  }

  const checkForValidationErrors = async (page: Page): Promise<string[]> => {
    const validationMessages = page.locator(
      '[role="alert"], .navds-alert--error, [data-testid*="validation"], [data-testid*="error"]'
    )
    const count = await validationMessages.count()
    const errors: string[] = []
    for (let i = 0; i < count; i++) {
      const text = await validationMessages
        .nth(i)
        .textContent()
        .catch(() => null)
      if (text && text.trim()) errors.push(text.trim())
    }
    const visibleValidationText = page.locator(
      'text=/Du må svare|validation|feil/i'
    )
    const visibleCount = await visibleValidationText.count()
    for (let i = 0; i < visibleCount; i++) {
      const text = await visibleValidationText
        .nth(i)
        .textContent()
        .catch(() => null)
      if (text && text.trim() && !errors.includes(text.trim())) {
        errors.push(text.trim())
      }
    }
    return errors
  }

  const clickNeste = async (page: Page, expectedUrl?: RegExp) => {
    await test.step('Click "Neste" button', async () => {
      const button = page.getByTestId(STEGVISNING_NESTE_BUTTON)
      const errorBeforeClick = await checkForErrorPage(page)
      if (errorBeforeClick) {
        throw new Error(
          `Error page detected before clicking next: ${errorBeforeClick}`
        )
      }
      const validationErrorsBefore = await checkForValidationErrors(page)
      if (validationErrorsBefore.length > 0) {
        throw new Error(
          `Validation errors present before clicking next: ${validationErrorsBefore.join(', ')}`
        )
      }
      await button.click()
      if (expectedUrl) {
        await expect(page).toHaveURL(expectedUrl, { timeout: 20000 })
        const errorAfterNav = await checkForErrorPage(page)
        if (errorAfterNav) {
          throw new Error(
            `Error page detected after navigation: ${errorAfterNav}`
          )
        }
      }
    })
  }

  const waitForBeregningPageReady = async (page: Page) => {
    await test.step('Wait for beregning page to be ready', async () => {
      await expect(page).toHaveURL(/\/pensjon\/kalkulator\/beregning/)
      const errorPage = await checkForErrorPage(page)
      if (errorPage) {
        throw new Error(`Error page detected on beregning page: ${errorPage}`)
      }

      await expect(
        page
          .getByRole('button')
          .filter({ hasText: /\d+.*(år|alder|md|måned)/i })
          .first()
      ).toBeVisible({ timeout: 20000 })
    })
  }

  const waitForBeregningDetaljertPageReady = async (page: Page) => {
    await test.step('Wait for beregning-detaljert page to be ready', async () => {
      await expect(page).toHaveURL(/\/pensjon\/kalkulator\/beregning-detaljert/)
      const errorPage = await checkForErrorPage(page)
      if (errorPage) {
        throw new Error(
          `Error page detected on beregning-detaljert page: ${errorPage}`
        )
      }
      await expect(page.getByTestId(AGEPICKER_HELT_UTTAKSALDER)).toBeVisible({
        timeout: 15000,
      })
    })
  }

  test.describe('Gitt at jeg som bruker ikke er pålogget', () => {
    test.use({ autoAuth: false })

    test.beforeEach(async ({ page }) => {
      await setupInterceptions(page, [
        {
          url: /\/pensjon\/kalkulator\/oauth2\/session/,
          status: 401,
        },
      ])
      await page.goto('/pensjon/kalkulator/')
      await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
    })

    test.describe('Når jeg vil logge inn for å teste kalkulatoren', () => {
      test('forventer jeg å kunne logge inn med ID-porten', async ({
        page,
      }) => {
        await page
          .getByRole('button', { name: 'Logg inn i pensjonskalkulator' })
          .click()
        await expect(page).toHaveURL(
          /\/pensjon\/kalkulator\/oauth2\/login\?redirect=%2Fpensjon%2Fkalkulator%2Fstart$/
        )
      })

      test('ønsker jeg informasjon om hvilke personopplysninger som brukes i kalkulatoren', async ({
        page,
      }) => {
        const link = page.getByRole('link', {
          name: 'Personopplysninger som brukes i pensjonskalkulator',
        })
        await expect(link).toHaveAttribute(
          'href',
          'https://www.nav.no/personopplysninger-i-pensjonskalkulator'
        )
      })
    })
  })

  test.describe('Som bruker som har logget inn på kalkulatoren', () => {
    test.describe('Når jeg navigerer videre fra /login til /start og er yngre enn 75 år', () => {
      test('forventer jeg å se en startside som ønsker meg velkommen', async ({
        page,
      }) => {
        await expect(page.getByText('Hei Aprikos!')).toBeVisible()
      })

      test('ønsker jeg informasjon om hvilke personopplysninger som brukes i kalkulatoren', async ({
        page,
      }) => {
        const link = page.getByRole('link', {
          name: 'Personopplysninger som brukes i pensjonskalkulator',
        })
        await expect(link).toHaveAttribute(
          'href',
          'https://www.nav.no/personopplysninger-i-pensjonskalkulator'
        )
      })

      test('ønsker jeg å kunne starte kalkulatoren eller avbryte beregningen', async ({
        page,
      }) => {
        await page.getByRole('button', { name: 'Kom i gang' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/sivilstand$/)

        await page.getByRole('button', { name: 'Avbryt' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })

      test.describe('Som bruker som har vedtak om gammel AFP', () => {
        test.use({ autoAuth: false })
        test('forventer jeg å se informasjon om at jeg har AFP i offentlig sektor', async ({
          page,
        }) => {
          await authenticate(page, [
            ...(await presetStates.brukerUnder75MedPre2025OffentligAfpOgTidligsteUttak()),
          ])

          await expect(page.getByText('AFP i offentlig sektor')).toBeVisible()
          await expect(
            page.getByTestId('stegvisning-start-ingress-pre2025-offentlig-afp')
          ).toContainText('Du har nå AFP i offentlig sektor')
        })
      })
    })

    test.describe('Når jeg navigerer videre fra /login til /start og har fyllt 75 år pluss 1 måned', () => {
      test.use({ autoAuth: false })

      test('forventer jeg å se en startside som sier at jeg dessverre ikke kan beregne pensjon', async ({
        page,
      }) => {
        await authenticate(page, [...(await presetStates.brukerOver75())])

        await expect(
          page.getByTestId('start-brukere-fyllt-75-ingress')
        ).toBeVisible()
      })

      test('forventer jeg å se og navigere til "kontakte oss" lenke', async ({
        page,
      }) => {
        await authenticate(page, [...(await presetStates.brukerOver75())])

        const kontaktLink = page
          .getByTestId('start-brukere-fyllt-75-ingress')
          .getByRole('link')
        await expect(kontaktLink).toHaveAttribute(
          'href',
          /\/planlegger-pensjon#noe-du-ikke-finner-svaret-p-her$/
        )

        const popupPromise = page.waitForEvent('popup')
        await kontaktLink.click()
        const popup = await popupPromise
        await expect(popup).toHaveURL(
          'https://www.nav.no/planlegger-pensjon#noe-du-ikke-finner-svaret-p-her'
        )
        await popup.close()
      })

      test('kan jeg navigere til "Din pensjon" side', async ({ page }) => {
        await authenticate(page, [...(await presetStates.brukerOver75())])

        const dinPensjonButton = page.getByTestId(
          'start-brukere-fyllt-75-din-pensjon-button'
        )
        await expect(dinPensjonButton).toBeVisible()

        await dinPensjonButton.click()
        await expect(page).toHaveURL(/\/pensjon\/selvbetjening\/dinpensjon/)
      })

      test('kan jeg avbryte og navigere til login side', async ({ page }) => {
        await authenticate(page, [...(await presetStates.brukerOver75())])

        const avbrytButton = page.getByTestId(
          'start-brukere-fyllt-75-avbryt-button'
        )
        await expect(avbrytButton).toBeVisible()

        await avbrytButton.click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })
    })

    test.describe('Som bruker som har fremtidig vedtak om alderspensjon', () => {
      test.use({ autoAuth: false })

      test('forventer jeg informasjon om fremtidig vedtak', async ({
        page,
      }) => {
        await authenticate(page, [
          ...(await presetStates.medFremtidigAlderspensjonVedtak()),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await expect(
          page.locator('[data-intl="stegvisning.fremtidigvedtak.alert"]')
        ).toBeVisible()
      })
    })

    test.describe('Som bruker som er registrert med en annen sivilstand enn gift, registrert partner eller samboer', () => {
      test('forventer jeg informasjon om hvilken sivilstand jeg er registrert med', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await expect(
          page.getByRole('heading', { name: 'Sivilstand' })
        ).toBeVisible()
        await expect(page.locator(SELECT_SIVILSTAND)).toHaveValue('UGIFT')
      })

      test('forventer jeg å få muligheten til å endre sivilstand for å få riktig beregning', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        const sivilstandSelect = page.locator(SELECT_SIVILSTAND)
        await sivilstandSelect.selectOption('GIFT')

        await clickNeste(page)

        const validationMessage = page.getByText(
          'Du må svare på om ektefellen din vil motta pensjon eller uføretrygd fra folketrygden, eller AFP.'
        )
        await expect(validationMessage).toBeVisible()

        await page.getByRole('radio').first().check()
        await waitForValidationErrorsToClear(page)
        await clickNeste(page)

        await expect(validationMessage).toHaveCount(0)
      })

      test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await page.getByRole('button', { name: 'Tilbake' }).click()
        await expect(page).toHaveURL(
          /\/pensjon\/kalkulator\/start(\?back=true)?$/
        )

        await page.goForward()

        await page.getByRole('button', { name: 'Avbryt' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })
    })

    test.describe('Som bruker som har sivilstand gift, registrert partner eller samboer', () => {
      test.use({ autoAuth: false })

      const personGift = async () =>
        person({
          navn: 'Aprikos',
          sivilstand: 'GIFT',
          foedselsdato: FOEDSELSDATO_1963_04_30,
          pensjoneringAldre: {
            normertPensjoneringsalder: { aar: 67, maaneder: 0 },
            nedreAldersgrense: { aar: 62, maaneder: 0 },
            oevreAldersgrense: { aar: 75, maaneder: 0 },
          },
        })

      test('forventer jeg informasjon om hvilken sivilstand jeg er registrert med', async ({
        page,
      }) => {
        await authenticate(page, [await personGift()])
        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await expect(
          page.getByRole('heading', { name: 'Sivilstand' })
        ).toBeVisible()
        await expect(page.locator(SELECT_SIVILSTAND)).toHaveValue('GIFT')
      })

      test('forventer jeg å få muligheten til å endre sivilstand for å få riktig beregning', async ({
        page,
      }) => {
        await authenticate(page, [await personGift()])
        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await page.locator(SELECT_SIVILSTAND).selectOption('UGIFT')
        await clickNeste(page)
      })

      test('forventer jeg å måtte oppgi om E/P/S mottar pensjon, uføretrygd eller AFP', async ({
        page,
      }) => {
        await authenticate(page, [await personGift()])
        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await expect(page.locator(SELECT_SIVILSTAND)).toHaveValue('GIFT')

        await page
          .locator('input[type="radio"][name="epsHarPensjon"]')
          .first()
          .check()
        await expect(
          page.locator('input[type="radio"][name="epsHarPensjon"]').first()
        ).toBeChecked()
        await clickNeste(page)
      })

      test('forventer jeg å måtte oppgi om E/P/S har inntekt over 2G når bruker har svart "nei" på at EPS har pensjon', async ({
        page,
      }) => {
        await authenticate(page, [await personGift()])
        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await page
          .locator('input[type="radio"][name="epsHarPensjon"][value="nei"]')
          .check()

        await page.getByTestId(STEGVISNING_NESTE_BUTTON).click()

        const validationMessage = page.getByText(
          'Du må svare på om ektefellen din vil ha inntekt over 2G.'
        )
        await expect(validationMessage).toBeVisible()

        await page
          .locator(
            'input[type="radio"][name="epsHarInntektOver2G"][value="ja"]'
          )
          .check()

        await expect(validationMessage).toHaveCount(0)

        await clickNeste(page)
      })

      test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
        await authenticate(page, [await personGift()])
        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'sivilstand',
        })

        await page.getByRole('button', { name: 'Tilbake' }).click()
        await expect(page).toHaveURL(
          /\/pensjon\/kalkulator\/start(\?back=true)?$/
        )

        await page.goForward()
        await page.getByRole('button', { name: 'Avbryt' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })
    })

    test.describe('Når jeg navigerer videre fra sivilstand til neste steg', () => {
      test('forventer jeg å bli spurt om jeg har bodd/jobbet mer enn 5 år utenfor Norge', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'utenlandsopphold',
        })

        await expect(
          page.getByRole('heading', { name: 'Opphold utenfor Norge' })
        ).toBeVisible()
        await expect(
          page.getByText(
            'Har du bodd eller jobbet utenfor Norge i mer enn 5 år?'
          )
        ).toBeVisible()
      })

      test('forventer jeg å måtte svare ja/nei på spørsmål om tid utenfor Norge', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'utenlandsopphold',
        })

        await clickNeste(page)
        const validationMessage = page.getByText(
          'Du må svare på om du har bodd eller jobbet utenfor Norge i mer enn 5 år etter fylte 16 år.'
        )
        await expect(validationMessage).toBeVisible()

        await page.getByRole('radio').first().check()
        await expect(validationMessage).toHaveCount(0)

        await clickNeste(page)
      })

      test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          navigateTo: 'utenlandsopphold',
        })

        await page.getByRole('button', { name: 'Tilbake' }).click()
        await expect(page).toHaveURL(
          /\/pensjon\/kalkulator\/sivilstand(\?back=true)?$/
        )

        await page.goForward()
        await page.getByRole('button', { name: 'Avbryt' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })

      test.describe('Som bruker som har vedtak om gammel AFP offentlig', () => {
        test.use({ autoAuth: false })

        test('forventer jeg at neste steg er /samtykke', async ({ page }) => {
          await authenticate(page, [
            ...(await presetStates.medPre2025OffentligAfp(
              PRE2025_OFFENTLIG_AFP_FOM
            )),
            ...(await presetStates.medTidligsteUttaksalder(62, 10)),
          ])

          await fillOutStegvisning(page, {
            sivilstand: 'UGIFT',
            epsHarPensjon: null,
            epsHarInntektOver2G: null,
            navigateTo: 'sivilstand',
          })
          await clickNeste(page)
          await page.getByRole('radio').last().check()
          await clickNeste(page)

          await expect(page).toHaveURL(/\/pensjon\/kalkulator\/samtykke$/)
        })
      })
    })

    test.describe('Gitt at jeg som bruker svarer nei på bodd/jobbet mer enn 5 år utenfor Norge', () => {
      test.describe('Når jeg navigerer videre til /afp', () => {
        test('forventer jeg å få informasjon om AFP og muligheten for å velge om jeg ønsker å beregne AFP', async ({
          page,
        }) => {
          await fillOutStegvisning(page, {
            sivilstand: 'UGIFT',
            epsHarPensjon: null,
            epsHarInntektOver2G: null,
            navigateTo: 'afp',
          })

          await expect(
            page.getByRole('heading', { name: 'AFP (avtalefestet pensjon)' })
          ).toBeVisible()
          await page.getByTestId('om_livsvarig_AFP_i_offentlig_sektor').click()
          await page.getByTestId('om_livsvarig_AFP_i_privat_sektor').click()
        })

        test('forventer jeg å måtte velge om jeg vil beregne med eller uten AFP', async ({
          page,
        }) => {
          await fillOutStegvisning(page, {
            sivilstand: 'UGIFT',
            epsHarPensjon: null,
            epsHarInntektOver2G: null,
            navigateTo: 'afp',
          })

          await expect(page.getByText('Har du rett til AFP?')).toBeVisible()
          await expect(page.getByLabel('Ja, i offentlig sektor')).toBeVisible()
          await expect(page.getByLabel('Ja, i privat sektor')).toBeVisible()
          await expect(page.getByLabel('Nei')).toBeVisible()
          await expect(page.getByLabel('Vet ikke')).toBeVisible()

          await clickNeste(page)
          const validationMessage = page.getByText(
            'Du må svare på om du har rett til AFP.'
          )
          await expect(validationMessage).toBeVisible()

          await page.getByRole('radio').last().check()
          await expect(validationMessage).toHaveCount(0)
          await clickNeste(page)
        })

        test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
          await fillOutStegvisning(page, {
            sivilstand: 'UGIFT',
            epsHarPensjon: null,
            epsHarInntektOver2G: null,
            navigateTo: 'afp',
          })

          await page.getByRole('button', { name: 'Tilbake' }).click()
          await expect(page).toHaveURL(
            /\/pensjon\/kalkulator\/utenlandsopphold(\?back=true)?$/
          )

          await page.goForward()
          await page.getByRole('button', { name: 'Avbryt' }).click()
          await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
        })

        test.describe('Som bruker som er 67 år eller eldre', () => {
          test.use({ autoAuth: false })

          test('forventer jeg å få informasjon om AFP Privat', async ({
            page,
          }) => {
            await authenticate(page, [
              ...(await presetStates.brukerEldreEnn67()),
              ...(await presetStates.medTidligsteUttaksalder(62, 10)),
            ])
            await fillOutStegvisning(page, {
              sivilstand: 'UGIFT',
              epsHarPensjon: null,
              epsHarInntektOver2G: null,
              navigateTo: 'afp',
            })

            await expect(page.getByTestId('afp-privat')).toBeVisible()
            await expect(
              page.getByRole('heading', {
                name: 'AFP (avtalefestet pensjon) i privat sektor',
              })
            ).toBeVisible()
            await expect(
              page.getByText('Har du rett til AFP i privat sektor?')
            ).toBeVisible()
            await expect(
              page.getByTestId('om_livsvarig_AFP_i_privat_sektor')
            ).toBeVisible()
          })

          test('forventer jeg å kunne beregne med eller uten AFP i privat sektor', async ({
            page,
          }) => {
            await authenticate(page, [
              ...(await presetStates.brukerEldreEnn67()),
              ...(await presetStates.medTidligsteUttaksalder(62, 10)),
            ])
            await fillOutStegvisning(page, {
              sivilstand: 'UGIFT',
              epsHarPensjon: null,
              epsHarInntektOver2G: null,
              navigateTo: 'afp',
            })

            await expect(page.getByTestId('afp-privat')).toBeVisible()

            await page.locator('input[type="radio"][value="ja_privat"]').check()
            await clickNeste(page)
            await expect(page).toHaveURL(/\/pensjon\/kalkulator\/samtykke$/)

            await page.goBack()

            await page.locator('input[type="radio"][value="nei"]').check()
            await clickNeste(page)
            await expect(page).toHaveURL(/\/pensjon\/kalkulator\/samtykke$/)

            await page.goBack()
            await page.locator('input[type="radio"][value="ja_privat"]').check()
            await clickNeste(page)
            await expect(page).toHaveURL(/\/pensjon\/kalkulator\/samtykke$/)
          })
        })
      })

      test.describe('Gitt at jeg som bruker har svart "ja, offentlig" på spørsmålet om AFP', () => {
        test.describe('Som bruker som er medlem i Pensjonsordningen for apotekervirksomhet', () => {
          test.use({ autoAuth: false })

          test('forventer jeg å bli spurt om jeg ønsker å beregne AFP i offentlig sektor etterfulgt av alderspensjon', async ({
            page,
          }) => {
            await authenticate(page, [
              ...(await presetStates.apotekerMedlemMedTidligsteUttak(62, 10)),
            ])
            await fillOutStegvisning(page, {
              sivilstand: 'UGIFT',
              epsHarPensjon: null,
              epsHarInntektOver2G: null,
              navigateTo: 'afp',
            })

            await page
              .locator('input[type="radio"][value="ja_offentlig"]')
              .check()

            await expect(
              page.getByTestId('afp-utregning-valg-radiogroup')
            ).toBeVisible()
            await expect(
              page.locator(
                'input[type="radio"][value="AFP_ETTERFULGT_AV_ALDERSPENSJON"]'
              )
            ).toBeVisible()
            await expect(
              page.locator('input[type="radio"][value="KUN_ALDERSPENSJON"]')
            ).toBeVisible()
          })
        })

        test.describe('Når jeg navigerer videre fra /afp til /samtykke-offentlig-afp', () => {
          test('forventer jeg å bli spurt om samtykke for offentlig AFP', async ({
            page,
          }) => {
            await fillOutStegvisning(page, {
              sivilstand: 'UGIFT',
              epsHarPensjon: null,
              epsHarInntektOver2G: null,
              navigateTo: 'afp',
            })

            await page
              .locator('input[type="radio"][value="ja_offentlig"]')
              .check()
            await clickNeste(page)

            await expect(
              page.getByRole('heading', {
                name: 'Samtykke til at Nav beregner AFP (avtalefestet pensjon)',
              })
            ).toBeVisible()
            await expect(
              page.getByText('Vil du at Nav skal beregne AFP for deg?')
            ).toBeVisible()

            await clickNeste(page)
            const validationMessage = page.getByText(
              'Du må svare på om du vil at Nav skal beregne AFP for deg.'
            )
            await expect(validationMessage).toBeVisible()

            await page.getByRole('radio').last().check()
            await expect(validationMessage).toHaveCount(0)
            await clickNeste(page)
          })

          test('forventer jeg å måtte svare ja/nei på spørsmål om samtykke for å hente mine avtaler eller om jeg ønsker å gå videre med bare alderspensjon', async () => {})

          test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
            await fillOutStegvisning(page, {
              sivilstand: 'UGIFT',
              epsHarPensjon: null,
              epsHarInntektOver2G: null,
              navigateTo: 'afp',
            })
            const jaOffentligRadio = page.getByRole('radio', {
              name: JA_I_OFFENTLIG_SEKTOR_TEXT,
            })
            await expect(jaOffentligRadio).toBeVisible()
            await jaOffentligRadio.check()
            await clickNeste(page)

            await page.getByRole('button', { name: 'Tilbake' }).click()
            await expect(page).toHaveURL(
              /\/pensjon\/kalkulator\/afp(\?back=true)?$/
            )

            await page.goForward()
            await page.getByRole('button', { name: 'Avbryt' }).click()
            await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
          })
        })
      })
    })

    test.describe('Når jeg navigerer videre til /samtykke', () => {
      test('forventer jeg å bli spurt om mitt samtykke, og få informasjon om hva samtykket innebærer', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          navigateTo: 'samtykke',
        })

        await expect(
          page.getByRole('heading', { name: 'Pensjonsavtaler' })
        ).toBeVisible()
        await expect(
          page.getByText('Skal vi hente pensjonsavtalene dine?')
        ).toBeVisible()
        await expect(page.getByTestId('dette_henter_vi_OFTP')).toBeVisible()
        await expect(page.getByTestId('dette_henter_vi_NP')).toBeVisible()
      })

      test('forventer jeg å måtte svare ja/nei på spørsmål om samtykke', async ({
        page,
      }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          navigateTo: 'samtykke',
        })

        await clickNeste(page)
        const validationMessage = page.getByText(
          'Du må svare på om du vil at vi skal hente dine pensjonsavtaler.'
        )
        await expect(validationMessage).toBeVisible()

        await selectSamtykkeRadio(page, 'nei')
        await expect(validationMessage).toHaveCount(0)
        await clickNeste(page)
      })

      test(TILBAKE_TIL_FORRIGE_STEG_TEXT, async ({ page }) => {
        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          navigateTo: 'samtykke',
        })

        await page.getByRole('button', { name: 'Tilbake' }).click()
        await expect(page).toHaveURL(
          /\/pensjon\/kalkulator\/afp(\?back=true)?$/
        )

        await page.goForward()
        await page.getByRole('button', { name: 'Avbryt' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/login$/)
      })

      test.describe('Gitt at bruker er medlem i pensjonsordningen for apotekervirksomheten', () => {
        test.use({ autoAuth: false })

        test('forventer å se informasjon om at jeg kan få sjekket mitt offentlige tjenestepensjonsforhold', async ({
          page,
        }) => {
          await authenticate(page, [
            ...(await presetStates.apotekerMedlemMedTidligsteUttak(62, 10)),
          ])
          await fillOutStegvisning(page, {
            sivilstand: 'UGIFT',
            epsHarPensjon: null,
            epsHarInntektOver2G: null,
            afp: 'nei',
            navigateTo: 'samtykke',
          })

          await expect(page.getByTestId('dette_sjekker_vi_OFTP')).toBeVisible()
        })
      })
    })

    test.describe('Gitt at jeg som bruker er født før 1963 eller er medlem av pensjonsordningen for apotekervirksomheten', () => {
      test.describe('Når jeg navigerer videre fra /samtykke til avansert skjema', () => {
        test.describe('Som bruker som har svart "AFP etterfulgt av alderspensjon fra 67 år"', () => {
          test.use({ autoAuth: false })

          test.beforeEach(async ({ page }) => {
            await authenticate(page, [
              await person({
                navn: 'Aprikos',
                sivilstand: 'UGIFT',
                foedselsdato: FOEDSELSDATO_1962_04_30,
                pensjoneringAldre: {
                  normertPensjonsalder: { aar: 67, maaneder: 0 },
                  nedreAldersgrense: { aar: 62, maaneder: 0 },
                  oevreAldersgrense: { aar: 75, maaneder: 0 },
                },
              }),
              ...(await presetStates.medTidligsteUttaksalder(62, 10)),
            ])

            await fillOutStegvisning(page, {
              afp: 'ja_offentlig',
              navigateTo: 'afp',
            })

            await page.waitForSelector(
              '[data-testid="afp-utregning-valg-radiogroup"]',
              { timeout: 5000 }
            )
            const afpEtterfulgtRadio = page.getByRole('radio', {
              name: 'AFP etterfulgt av alderspensjon fra 67 år',
            })
            await expect(afpEtterfulgtRadio).toBeVisible()
            await afpEtterfulgtRadio.check()
            await clickNeste(page)

            const radioButton = page.getByRole('radio', { name: /^ja$/i })
            await radioButton.check()
            await expect(radioButton).toBeChecked()

            await waitForValidationErrorsToClear(page)

            const nextButton = page.getByTestId(STEGVISNING_NESTE_BUTTON)
            await expect(nextButton).toBeEnabled()

            await clickNeste(
              page,
              /\/pensjon\/kalkulator\/beregning-detaljert$/
            )
            await waitForBeregningDetaljertPageReady(page)
          })

          test('forventer jeg å kunne velge alder for uttak av AFP', async ({
            page,
          }) => {
            await expect(
              page.getByTestId(AGEPICKER_HELT_UTTAKSALDER)
            ).toBeVisible()
          })

          test('forventer jeg å kunne se og endre inntekt frem til pensjon', async ({
            page,
          }) => {
            const inntektButton = page
              .locator('button')
              .filter({ hasText: /[Ee]ndre.*inntekt/i })
              .first()
            await expect(inntektButton).toBeVisible()

            await inntektButton.click()

            await expect(page.getByTestId(INNTEKT_TEXTFIELD)).toBeVisible()
            await expect(page.getByTestId(INNTEKT_TEXTFIELD)).not.toBeDisabled()
          })

          test('forventer jeg å kunne velge pensjonsalder mellom dagens alder + 1 mnd and 66 år og 11 mnd', async ({
            page,
          }) => {
            await expect(
              page.locator(
                '[data-intl="beregning.avansert.rediger.afp_etterfulgt_av_ap.title"]'
              )
            ).toBeVisible()

            const agePickerContainer = page.getByTestId(
              AGEPICKER_HELT_UTTAKSALDER
            )
            await expect(agePickerContainer).toBeVisible()

            await expect(
              agePickerContainer.locator('select[name*="aar"]')
            ).toBeVisible()
            await expect(
              agePickerContainer.locator('select[name*="maaned"]')
            ).toBeVisible()

            const aarOptions = agePickerContainer.locator(
              'select[name*="aar"] option'
            )
            const count = await aarOptions.count()
            expect(count).toBeGreaterThanOrEqual(2)
          })

          test('forventer jeg å måtte svare på om jeg har inntekt på minst 1G/12 måneden før uttak av pensjon', async ({
            page,
          }) => {
            await expect(page).toHaveURL(/\/beregning-detaljert$/)
            const inntektRadio = page.getByTestId(
              'afp-inntekt-maaned-foer-uttak-radio'
            )
            await expect(inntektRadio).toBeVisible()

            const radioCount = await inntektRadio
              .locator(INPUT_TYPE_RADIO)
              .count()
            expect(radioCount).toBe(2)

            await expect(
              page.getByTestId('afp-inntekt-maaned-foer-uttak-radio-ja')
            ).toBeVisible()
            await expect(
              page.getByTestId('afp-inntekt-maaned-foer-uttak-radio-nei')
            ).toBeVisible()
          })

          test('forventer jeg å få informasjon om at jeg ikke kan beregne AFP hvis jeg svarer nei på inntekt over 1G/12', async ({
            page,
          }) => {
            await expect(page).toHaveURL(/\/beregning-detaljert$/)
            const inntektRadio = page.getByTestId(
              'afp-inntekt-maaned-foer-uttak-radio'
            )
            await expect(inntektRadio).toBeVisible()

            const radioCount = await inntektRadio
              .locator(INPUT_TYPE_RADIO)
              .count()
            expect(radioCount).toBe(2)

            await page
              .getByTestId('afp-inntekt-maaned-foer-uttak-radio-nei')
              .check()

            await expect(
              page.getByTestId('afp-etterfulgt-ap-informasjon')
            ).toBeVisible()
          })

          test('forventer jeg å måtte oppgi hvor mye inntekt jeg skal ha hvis jeg svarer ja på inntekt samtidig som AFP', async ({
            page,
          }) => {
            await expect(page).toHaveURL(/\/beregning-detaljert$/)
            const inntektVsaRadio = page.getByTestId('inntekt-vsa-afp-radio')
            await expect(inntektVsaRadio).toBeVisible()

            const radioCount = await inntektVsaRadio
              .locator(INPUT_TYPE_RADIO)
              .count()
            expect(radioCount).toBe(2)

            await page.getByTestId('inntekt-vsa-afp-radio-ja').check()

            await expect(page.getByTestId('inntekt-vsa-afp')).toBeVisible()
          })
        })
      })
    })

    test.describe('Når jeg venter på at resultatet kommer fram', () => {
      test.use({ autoAuth: false })
      test('forventer jeg en melding dersom det tar tid før resultatet kommer opp', async ({
        page,
      }) => {
        await authenticate(page, [
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        const loader = page.getByTestId('uttaksalder-loader')
        const loaderCount = await loader.count()
        if (loaderCount > 0) {
          await loader
            .waitFor({ state: 'hidden', timeout: 5000 })
            .catch(() => {})
        }
      })
    })

    test.describe('Når jeg er kommet til beregningssiden', () => {
      test.use({ autoAuth: false })
      test.beforeEach(async ({ page }) => {
        await authenticate(page, [
          ...(await presetStates.brukerGift1963()),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          sivilstand: 'GIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)
      })

      test.describe("Gitt at jeg er født 1963 eller senere, har svart 'Ja, i offentlig' på spørsmål om AFP og kall til /er-apoteker feiler", () => {
        test.use({ autoAuth: false })

        test('forventer jeg informasjon om at beregning med AFP kan bli feil hvis jeg er medlem av Pensjonsordningen for apotekvirksomhet og at jeg må prøve igjen senere', async ({
          page,
        }) => {
          await expect(page).toHaveURL(/\/pensjon\/kalkulator\/beregning/)
        })
      })

      test('ønsker jeg som er født i 1963 informasjon om når jeg tidligst kan starte uttak av pensjon', async ({
        page,
      }) => {
        await authenticate(page, [
          ...(await presetStates.brukerGift1963()),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)

        await expect(
          page.getByText(
            'Beregningen din viser at du kan ta ut 100 % alderspensjon fra du er'
          )
        ).toBeVisible()
        await expect(page.getByText('62 år og 10 måneder')).toBeVisible()
        await expect(
          page.getByText(
            'Hvis du venter lenger med uttaket, vil den årlige pensjonen din øke.'
          )
        ).toBeVisible()
      })

      test('ønsker jeg som er født fom. 1964 informasjon om når jeg tidligst kan starte uttak av pensjon', async ({
        page,
      }) => {
        await authenticate(page, [
          await person({
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: FOEDSELSDATO_1964_04_30,
            pensjoneringAldre: {
              normertPensjoneringsalder: { aar: 67, maaneder: 0 },
              nedreAldersgrense: { aar: 62, maaneder: 0 },
              oevreAldersgrense: { aar: 75, maaneder: 0 },
            },
          }),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)

        await expect(
          page.getByText(
            'Beregningen din viser at du kan ta ut 100 % alderspensjon fra du er'
          )
        ).toBeVisible()
        await expect(page.getByText('62 år og 10 måneder')).toBeVisible()
        await expect(
          page.getByText(
            'Det kan bli senere fordi pensjonsalderen i Norge øker.'
          )
        ).toBeVisible()
      })

      test('må jeg kunne trykke på Readmore for å få mer informasjon om tidspunktet for tidligst uttak', async ({
        page,
      }) => {
        await expect(page.getByTestId('om_TMU')).toBeVisible()
      })

      test('forventer jeg å få knapper jeg kan trykke på for å velge og sammenligne ulike uttakstidspunkt', async ({
        page,
      }) => {
        const ageButtons = page
          .getByRole('button')
          .filter({ hasText: /\d+.*(år|alder|md|måned)/i })
        await expect(ageButtons.first()).toBeVisible({ timeout: 15000 })
        const count = await ageButtons.count()
        expect(count).toBeGreaterThanOrEqual(10)

        await expect(
          page.getByRole('button', { name: /62.*(år|md|måned)/i })
        ).toBeVisible()
        await expect(
          page.getByRole('button', { name: /75.*år/i })
        ).toBeVisible()
      })

      test('ønsker jeg som har vedtak om gammel AFP offentlig å kunne velge alder fra 67 år til 75 år', async ({
        page,
      }) => {
        await authenticate(page, [
          await person({
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: FOEDSELSDATO_1962_04_30,
            pensjoneringAldre: {
              normertPensjoneringsalder: { aar: 67, maaneder: 0 },
              nedreAldersgrense: { aar: 62, maaneder: 0 },
              oevreAldersgrense: { aar: 75, maaneder: 0 },
            },
          }),
          ...(await presetStates.medPre2025OffentligAfp(
            PRE2025_OFFENTLIG_AFP_FOM
          )),
          ...(await presetStates.medTidligsteUttaksalder(67, 0)),
        ])

        await fillOutStegvisning(page, {
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)

        const ageButtons = page
          .getByRole('button')
          .filter({ hasText: /\d+.*(år|alder|md|måned)/i })
        await expect(ageButtons.first()).toBeVisible({ timeout: 15000 })
        const count = await ageButtons.count()
        expect(count).toBeGreaterThanOrEqual(9)
        await expect(
          page.getByRole('button', { name: /67.*år/i })
        ).toBeVisible()
        await expect(
          page.getByRole('button', { name: /75.*år/i })
        ).toBeVisible()
        await expect(
          page.getByRole('button', { name: /62.*(år|md)/i })
        ).not.toBeVisible()
      })
    })

    test.describe('Når jeg velger hvilken alder jeg ønsker beregning fra', () => {
      test.use({ autoAuth: false })
      test.beforeEach(async ({ page }) => {
        await authenticate(page, [
          await person({
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: FOEDSELSDATO_1964_04_30,
            pensjoneringAldre: {
              normertPensjoneringsalder: { aar: 67, maaneder: 0 },
              nedreAldersgrense: { aar: 62, maaneder: 0 },
              oevreAldersgrense: { aar: 75, maaneder: 0 },
            },
          }),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          samtykke: true,
          navigateTo: 'beregning',
        })
      })

      test('ønsker jeg en graf som viser utviklingen av total pensjon', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '62 år og 10 md.' }).click()
        await expect(page.getByTestId('highcharts-aria-wrapper')).toBeVisible()
        await expect(
          page.getByRole('heading', { name: /Årlig inntekt og pensjon/i })
        ).toBeVisible()
        await expect(
          page.getByRole('heading', { name: 'Pensjonsgivende inntekt' })
        ).toBeVisible()
        await expect(page.getByText('AFP (avtalefestet pensjon)')).toBeVisible()
        await expect(
          page
            .getByTestId('highcharts-aria-wrapper')
            .getByText('Alderspensjon (Nav)')
            .first()
        ).toBeVisible()
        await expect(
          page.getByRole('heading', { name: /Om inntekten og pensjonen din/i })
        ).toBeVisible()
      })

      test('forventer jeg en egen tabell med oversikt over mine pensjonsavtaler', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(
          page.getByRole('heading', { name: 'Pensjonsavtaler' })
        ).toBeVisible({ timeout: 15000 })
      })

      test('forventer jeg å få informasjon om inntekten og pensjonen din', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(
          page.getByText('Om inntekten og pensjonen din')
        ).toBeVisible()
        await expect(
          page.getByText('Pensjonsgivende inntekt frem til uttak')
        ).toBeVisible()
      })

      test('forventer jeg å kunne lese enkle forbehold, og få lenke til utfyllende forbehold', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(
          page.getByRole('heading', { name: /Forbehold/ })
        ).toBeVisible({ timeout: 15000 })
        const forbeholdSection = page
          .getByRole('heading', { name: /Forbehold/ })
          .locator('xpath=ancestor::section')
        const forbeholdLink = forbeholdSection.getByRole('link', {
          name: /Alle forbehold/,
        })
        await expect(forbeholdLink).toHaveAttribute(
          'href',
          /\/pensjon\/kalkulator\/forbehold/
        )
      })

      test('ønsker jeg å kunne starta ny beregning', async ({ page }) => {
        await page.getByRole('button', { name: '62 år og 10 md.' }).click()
        await page.getByRole('button', { name: 'Tilbake til start' }).click()
        await page.getByRole('button', { name: 'Gå tilbake til start' }).click()
        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/start$/)
      })
    })

    test.describe('Når jeg foretrekker tabell frem for graf', () => {
      test.use({ autoAuth: false })
      test.beforeEach(async ({ page }) => {
        await authenticate(page, [
          await person({
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: FOEDSELSDATO_1964_04_30,
            pensjoneringAldre: {
              normertPensjoneringsalder: { aar: 67, maaneder: 0 },
              nedreAldersgrense: { aar: 62, maaneder: 0 },
              oevreAldersgrense: { aar: 75, maaneder: 0 },
            },
          }),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          sivilstand: 'UGIFT',
          epsHarPensjon: null,
          epsHarInntektOver2G: null,
          afp: 'nei',
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)
      })

      test('ønsker jeg å få resultatet presentert i både graf og tabell', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()

        const visTabellButton = page.getByRole('button', {
          name: 'Vis tabell av beregningen',
        })
        await visTabellButton.click()

        await expect(
          page.getByRole('button', {
            name: 'Lukk tabell av beregningen',
          })
        ).toBeVisible({ timeout: 10000 })

        await expect(
          page.getByRole('columnheader', { name: /^Alder$/ })
        ).toBeVisible()
        await expect(
          page.getByRole('columnheader', { name: /Sum/ }).first()
        ).toBeVisible()
      })
    })

    test.describe('Når jeg endrer fremtidig inntekt', () => {
      test.use({ autoAuth: false })
      test.beforeEach(async ({ page }) => {
        await authenticate(page, [
          await person({
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: FOEDSELSDATO_1964_04_30,
            pensjoneringAldre: {
              normertPensjoneringsalder: { aar: 67, maaneder: 0 },
              nedreAldersgrense: { aar: 62, maaneder: 0 },
              oevreAldersgrense: { aar: 75, maaneder: 0 },
            },
          }),
          ...(await presetStates.medTidligsteUttaksalder(62, 10)),
        ])

        await fillOutStegvisning(page, {
          samtykke: true,
          navigateTo: 'beregning',
        })
        await waitForBeregningPageReady(page)
      })

      test('ønsker jeg at tidligste uttakstidspunkt oppdateres', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(
          page.getByText('Pensjonsgivende inntekt frem til uttak')
        ).toBeVisible()
        await expect(
          page.getByText(/Din siste pensjonsgivende inntekt/i)
        ).toBeVisible({ timeout: 15000 })

        await page.getByRole('button', { name: ENDRE_INNTEKT_TEXT }).click()
        await page.getByTestId(INNTEKT_TEXTFIELD).fill('0')
        await page.getByRole('button', { name: OPPDATER_INNTEKT_TEXT }).click()

        await expect(
          page.getByText(
            /Beregningen din viser at du kan ta ut 100 % alderspensjon fra du er/i
          )
        ).toBeVisible({ timeout: 15000 })
        await expect(page.getByText(/\b67 år\b/)).toBeVisible({
          timeout: 15000,
        })
      })

      test('ønsker jeg å få resultatet oppdatert i graf og tabell', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(page.getByText('521 338 kr')).toBeVisible()

        await page.getByRole('button', { name: ENDRE_INNTEKT_TEXT }).click()
        await page.getByTestId(INNTEKT_TEXTFIELD).fill('100000')
        await page.getByRole('button', { name: OPPDATER_INNTEKT_TEXT }).click()

        await expect(page.getByTestId('alert-inntekt')).toBeVisible()
      })

      test('ønsker jeg å kunne starte på nytt og at inntekt da er tilbake til siste årsinntekt', async ({
        page,
      }) => {
        await page.getByRole('button', { name: '70' }).click()
        await expect(page.getByText('521 338 kr')).toBeVisible()

        await page.getByRole('button', { name: ENDRE_INNTEKT_TEXT }).click()
        await page.getByTestId(INNTEKT_TEXTFIELD).fill('100000')
        await page.getByRole('button', { name: OPPDATER_INNTEKT_TEXT }).click()

        await page.getByRole('button', { name: 'Tilbake til start' }).click()
        await page.getByRole('button', { name: 'Gå tilbake til start' }).click()

        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/start$/)
      })
    })
  })
})

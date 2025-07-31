import {
  expect,
  loginWithApiAlterations,
  setupInterceptions,
  test,
} from '../../../base'

test.describe('Henvisning', () => {
  test.describe('Når jeg som bruker som er medlem av apotekerne logger inn,', () => {
    test.beforeEach(async ({ page }) => {
      await setupInterceptions(page, [
        {
          url: /\/pensjon\/kalkulator\/api\/v2\/ekskludert/,
          jsonResponse: { ekskludert: true, aarsak: 'ER_APOTEKER' },
        },
      ])
    })

    test('forventer jeg informasjon om at jeg ikke kan bruke enkel kalkulator. Jeg ønsker å kunne gå til detaljert kalkulator eller avbryte.', async ({
      page,
    }) => {
      await loginWithApiAlterations(page)
      await expect(page.locator('text=Kom i gang')).toHaveCount(0)
      await expect(
        page.locator('text=Du kan dessverre ikke bruke denne kalkulatoren')
      ).toBeVisible()

      await page.click('button:has-text("Detaljert pensjonskalkulator")')
      await expect(page).toHaveURL(
        '/pensjon/kalkulator/redirect/detaljert-kalkulator'
      )
      await page.goto('/pensjon/kalkulator/start')
      await page.click('button:has-text("Avbryt")')
      await expect(page).toHaveURL('/pensjon/kalkulator/login')
    })
  })
})

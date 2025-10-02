import { expect, setupInterceptions, test } from '../../../base'
import { handlePageError } from '../../../utils/error'
import { login } from '../../../utils/navigation'

test.beforeEach(async ({ page }) => {
  await setupInterceptions(page)
  page.on('pageerror', handlePageError)
})

test.describe('Språkvelger', () => {
  test('setter Norsk Bokmål som default språk i løsningen for innhold styrt av react-intl og Sanity', async ({
    page,
  }) => {
    await login(page)

    await page.click('button:has-text("Kom i gang")')

    await expect(
      page.getByRole('heading', { name: 'Sivilstand' })
    ).toBeVisible()
    await page.click('button:has-text("Neste")')

    await expect(
      page.getByRole('heading', { name: 'Opphold utenfor Norge' })
    ).toBeVisible()
    await expect(
      page.locator('text=Hva som er opphold utenfor Norge')
    ).toBeVisible()
  })
})

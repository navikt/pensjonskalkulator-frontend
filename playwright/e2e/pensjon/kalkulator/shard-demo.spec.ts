import { expect, test } from '@playwright/test'

const totalTests = 12

for (let i = 1; i <= totalTests; i++) {
  test(`shard demo #${i} navigates to kalkulator`, async ({ page }) => {
    const path = `/pensjon/kalkulator?shardDemo=${i}`

    await page.goto(path)
    await page.waitForLoadState('domcontentloaded')

    const currentUrl = page.url()
    expect(currentUrl).toContain(`/pensjon/kalkulator`)
    expect(currentUrl).toContain(`shardDemo=${i}`)

    // Ensure the app rendered something
    await expect(page.locator('body')).toBeVisible()
  })
}

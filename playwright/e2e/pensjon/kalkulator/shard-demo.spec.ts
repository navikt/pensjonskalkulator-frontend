import {
  expect,
  handlePageError,
  setupInterceptions,
  test,
} from '../../../base'

const totalTests = 12

test.beforeEach(async ({ page }) => {
  await setupInterceptions(page)
  page.on('pageerror', handlePageError)
})

for (let i = 1; i <= totalTests; i++) {
  test(`shard demo #${i} loads kalkulator shell`, async ({ page }) => {
    await page.goto('/pensjon/kalkulator/', { waitUntil: 'load' })

    await expect(page.locator('body')).toBeVisible()
  })
}

import { Page } from '@playwright/test'

export async function selectDropdown(
  page: Page,
  selector: string,
  value: string | number
) {
  const select = page.locator(selector)
  await select.waitFor({ state: 'visible' })
  await select.selectOption(
    typeof value === 'number' ? { index: value } : value
  )
}

export async function checkRadio(page: Page, name: string, value: string) {
  const radio = page.locator(`input[name="${name}"][value="${value}"]`)
  await radio.waitFor({ state: 'visible' })
  await radio.check({ force: true })
}

export async function checkRadioByTestId(page: Page, testId: string) {
  const radio = page.getByTestId(testId)
  await radio.waitFor({ state: 'visible' })
  await radio.check({ force: true })
}

export async function fillTextField(
  page: Page,
  testId: string,
  value: string,
  options?: { clear?: boolean }
) {
  const input = page.getByTestId(testId)
  await input.waitFor({ state: 'visible' })

  if (options?.clear) {
    await input.clear()
  }

  await input.fill(value)
}

export async function typeTextField(
  page: Page,
  testId: string,
  value: string,
  options?: { clear?: boolean }
) {
  const input = page.getByTestId(testId)
  await input.waitFor({ state: 'visible' })

  if (options?.clear) {
    await input.clear()
  }

  await input.pressSequentially(value)
}

export async function clickButton(
  page: Page,
  testId: string,
  options?: { force?: boolean }
) {
  const button = page.getByTestId(testId)
  await button.waitFor({ state: 'visible' })
  await button.click({ force: options?.force })
}

export async function fillAgePicker(
  page: Page,
  baseName: string,
  age: { aar: string; maaneder: string }
) {
  const yearSelect = page.getByTestId(`age-picker-${baseName}-aar`)
  const monthSelect = page.getByTestId(`age-picker-${baseName}-maaneder`)

  await yearSelect.waitFor({ state: 'visible' })
  await yearSelect.selectOption(age.aar)

  await monthSelect.waitFor({ state: 'visible' })
  await monthSelect.selectOption(age.maaneder)
}

export async function expectElementVisible(page: Page, testId: string) {
  const element = page.getByTestId(testId)
  await element.waitFor({ state: 'visible' })
  return element
}

export async function testIdExists(
  page: Page,
  testId: string
): Promise<boolean> {
  try {
    await page.getByTestId(testId).waitFor({ state: 'visible', timeout: 1000 })
    return true
  } catch {
    return false
  }
}
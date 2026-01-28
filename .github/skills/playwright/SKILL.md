---
name: playwright
description: Write Playwright E2E tests using established patterns, mock helpers, and preset states
---

# Playwright Skill

This skill provides patterns for writing Playwright E2E tests in this repository.

## Critical Rules

1. **NEVER use text selectors** - Use `getByTestId()` or `getByRole()` only
2. **NEVER use CSS selectors** - No classes or IDs (except `input[name="..."]` for forms)
3. **NEVER use raw JSON mocks** - Always use type-safe mock helpers
4. **NEVER use arbitrary waits** - Use Playwright's auto-waiting

## File Location

All specs go in `playwright/e2e/pensjon/kalkulator/`

## Import Pattern

```typescript
import type { Page } from '@playwright/test'
import { fillOutStegvisning } from 'utils/navigation'

import { expect, setupInterceptions, test } from '../../../base'
import { authenticate } from '../../../utils/auth'
import {
  loependeVedtak,
  person,
  tidligsteUttaksalder,
} from '../../../utils/mocks'
import { presetStates } from '../../../utils/presetStates'
```

## Authentication Patterns

### Auto-auth (default)
```typescript
test('my test', async ({ page }) => {
  // Already at /start, authenticated
  await expect(page.getByTestId('stegvisning.start.title')).toBeVisible()
})
```

### Custom user data
```typescript
test.use({ autoAuth: false })

test('custom scenario', async ({ page }) => {
  await authenticate(page, [
    await person({ sivilstand: 'GIFT', foedselsdato: '1963-04-30' }),
    ...(await presetStates.medTidligsteUttaksalder(62, 10)),
  ])
})
```

### Unauthenticated flow
```typescript
test.describe('Login tests', () => {
  test.use({ autoAuth: false })

  test.beforeEach(async ({ page }) => {
    await setupInterceptions(page, [{ url: /\/oauth2\/session/, status: 401 }])
    await page.goto('/pensjon/kalkulator/')
  })
})
```

## Selector Strategy

```typescript
// ✅ 1st priority: getByTestId
page.getByTestId('stegvisning.start.title')
page.getByTestId('stegvisning-neste-button')

// ✅ 2nd priority: getByRole
page.getByRole('button', { name: 'Kom i gang' })
page.getByRole('heading', { name: 'Pensjonsavtaler' })

// ✅ 3rd priority: locator for form inputs only
page.locator('input[name="samtykke"][value="ja"]')
page.locator('select[name="sivilstand"]')

// ❌ NEVER use text selectors
page.getByText('...')  // WRONG!
page.locator('text=...')  // WRONG!

// ❌ NEVER use CSS selectors
page.locator('.class')  // WRONG!
page.locator('#id')  // WRONG!
```

## Mock Helpers

```typescript
// ✅ Good - type-safe helpers
await authenticate(page, [
  await person({ sivilstand: 'GIFT' }),
  await tidligsteUttaksalder({ aar: 62, maaneder: 10 }),
])

// ✅ Good - using presets
await authenticate(page, [
  ...(await presetStates.brukerGift1963()),
  ...(await presetStates.medTidligsteUttaksalder(62, 10)),
])

// ❌ Bad - raw JSON
await setupInterceptions(page, [{
  url: /\/api\/v6\/person/,
  overrideJsonResponse: { foedselsdato: '1963-04-30' },
}])
```

### Available Mock Helpers

| Helper | Purpose |
|--------|---------|
| `person(options)` | User data (sivilstand, foedselsdato, alder) |
| `tidligsteUttaksalder({ aar, maaneder })` | Earliest withdrawal age |
| `loependeVedtak(options)` | Current pension decisions |
| `apoteker(options)` | Pharmacy association membership |
| `alderspensjon(options)` | Old-age pension simulation |
| `ekskludert(options)` | Exclusion status |
| `inntekt(options)` | Income data |
| `offentligTp(options)` | Public service pension |
| `omstillingsstoenadOgGjenlevende(options)` | Adjustment/survivor benefits |
| `pensjonsavtaler(options)` | Pension agreements |
| `representasjonBanner(options)` | Representation banner |
| `toggleConfig(options)` | Feature flags |

### Preset States

| Preset | Description |
|--------|-------------|
| `brukerUnder75()` | User aged 65 |
| `brukerOver75()` | User aged 75+ |
| `brukerGift1963()` | Married user born 1963 |
| `brukerEldreEnn67()` | User older than 67 |
| `apotekerMedlem()` | Pharmacy association member |
| `medPre2025OffentligAfp(fom)` | With pre-2025 public AFP |
| `medFremtidigAlderspensjonVedtak()` | With future pension decision |
| `medTidligsteUttaksalder(aar, maaneder)` | With specific earliest age |

## Navigation Helper

```typescript
// Skip wizard steps by dispatching Redux state
await fillOutStegvisning(page, {
  sivilstand: 'GIFT',
  epsHarPensjon: null,
  epsHarInntektOver2G: null,
  afp: 'nei',
  samtykke: true,
  navigateTo: 'beregning',  // Required
})

// NavigationStep options:
// 'sivilstand' | 'utenlandsopphold' | 'afp' | 'ufoeretrygd-afp' |
// 'samtykke-offentlig-afp' | 'samtykke' | 'beregning' | 'beregning-detaljert'
```

## Helper Function Pattern

```typescript
test.describe('Feature', () => {
  // Extract helpers when used 3+ times
  const clickNeste = async (page: Page, expectedUrl?: RegExp) => {
    await test.step('Click "Neste" button', async () => {
      await page.getByTestId('stegvisning-neste-button').click()
      if (expectedUrl) {
        await expect(page).toHaveURL(expectedUrl, { timeout: 20000 })
      }
    })
  }

  const selectRadio = async (page: Page, name: string, value: string) => {
    await test.step(`Select ${name}: ${value}`, async () => {
      const radio = page.locator(`input[name="${name}"][value="${value}"]`)
      await radio.check()
      await expect(radio).toBeChecked()
    })
  }

  test('uses helpers', async ({ page }) => {
    await selectRadio(page, 'samtykke', 'ja')
    await clickNeste(page, /\/beregning$/)
  })
})
```

## Assertions

```typescript
// ✅ Auto-waiting (preferred)
await expect(page.getByTestId('result')).toBeVisible()
await expect(page).toHaveURL(/\/beregning$/)

// ✅ With timeout when needed
await expect(page.getByTestId('loader')).toBeHidden({ timeout: 5000 })
await expect(page.getByTestId('error')).toHaveCount(0, { timeout: 5000 })

// ❌ NEVER use arbitrary waits
await page.waitForTimeout(2000)  // WRONG!
```

## Running Tests

```bash
# Run all tests
npm run pw:test

# Run specific file
npx playwright test hovedhistorie

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

## Code Style

```typescript
// No semicolons
// Single quotes
// Trailing commas
// 2-space indent

// ✅ Correct
const element = page.getByTestId('my-element')
await element.click()

// ❌ Wrong
const element = page.getByTestId("my-element");
await element.click();
```

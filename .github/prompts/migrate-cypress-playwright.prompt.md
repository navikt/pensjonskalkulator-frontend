---
agent: agent
---

## Task

Migrate a Cypress test to Playwright following the established patterns in this repository.

**Gold standard:** Reference `playwright/e2e/pensjon/kalkulator/hovedhistorie.spec.ts` for all patterns.

---

## Core Rules

1. **Never use text selectors** - Use `getByTestId()` or `getByRole()` only
2. **Never use CSS selectors** - No classes or IDs (except `input[name="..."]` for forms)
3. **Use type-safe mocks** - Always use mock helpers, never raw JSON
4. **Use helpers for navigation** - `fillOutStegvisning()` instead of raw Redux dispatch
5. **Extract helpers** - Create helper functions for patterns used 3+ times
6. **Wrap in test.step()** - For complex multi-step operations

---

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
  // ... only import what you need
} from '../../../utils/mocks'
import { presetStates } from '../../../utils/presetStates'
```

---

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

---

## Selector Strategy

| Priority | Pattern | Example |
|----------|---------|---------|
| 1st | `getByTestId()` | `page.getByTestId('stegvisning.start.title')` |
| 2nd | `getByRole()` | `page.getByRole('button', { name: 'Kom i gang' })` |
| 3rd | `locator()` for forms | `page.locator('input[name="samtykke"][value="ja"]')` |
| ❌ | NEVER text | `page.getByText('...')` |
| ❌ | NEVER CSS | `page.locator('.class')` |

---

## Cypress → Playwright Cheat Sheet

| Cypress | Playwright |
|---------|------------|
| `cy.visit('/path')` | `await page.goto('/path')` |
| `cy.get('[data-testid="x"]')` | `page.getByTestId('x')` |
| `cy.contains('text')` | Use `getByTestId()` or `getByRole()` |
| `.click()` | `await element.click()` |
| `.should('be.visible')` | `await expect(element).toBeVisible()` |
| `.should('have.text', 'x')` | Use test ID instead |
| `cy.intercept()` | Use mock helpers with `authenticate()` |
| `cy.wait('@alias')` | Remove - auto-waiting handles it |
| `cy.login()` | `autoAuth: true` (default) |
| `cy.fillOutStegvisning({})` | `await fillOutStegvisning(page, {})` |

---

## Helper Function Pattern

```typescript
test.describe('Feature', () => {
  // Extract helpers for patterns used 3+ times
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

---

## Navigation with State

```typescript
// Skip wizard steps by dispatching Redux state directly
await fillOutStegvisning(page, {
  sivilstand: 'GIFT',
  epsHarPensjon: null,
  epsHarInntektOver2G: null,
  afp: 'nei',
  samtykke: true,
  navigateTo: 'beregning',
})
```

---

## Mock Helpers

**Always prefer type-safe helpers over raw JSON:**

```typescript
// ✅ Good
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

**Available helpers:**
`person`, `tidligsteUttaksalder`, `loependeVedtak`, `apoteker`, `alderspensjon`,
`ekskludert`, `inntekt`, `offentligTp`, `omstillingsstoenadOgGjenlevende`,
`pensjonsavtaler`, `representasjonBanner`, `toggleConfig`

**Preset states:**
`brukerUnder75`, `brukerOver75`, `brukerGift1963`, `brukerEldreEnn67`,
`apotekerMedlem`, `medPre2025OffentligAfp`, `medFremtidigAlderspensjonVedtak`,
`medTidligsteUttaksalder`

---

## Assertions

```typescript
// Auto-waiting (preferred)
await expect(page.getByTestId('result')).toBeVisible()
await expect(page).toHaveURL(/\/beregning$/)

// With timeout when needed
await expect(page.getByTestId('loader')).toBeHidden({ timeout: 5000 })
await expect(page.getByTestId('error')).toHaveCount(0, { timeout: 5000 })

// ❌ Never use arbitrary waits
await page.waitForTimeout(2000)
```

---

## Migration Checklist

For each test:

- [ ] Replace `cy.get('[data-testid="x"]')` → `page.getByTestId('x')`
- [ ] Replace `cy.contains()` → `getByTestId()` or `getByRole()`
- [ ] Replace `cy.intercept()` → mock helpers with `authenticate()`
- [ ] Replace `cy.login()` → use `autoAuth` (default) or `authenticate()`
- [ ] Replace `.should()` → `await expect(...).toBe...()`
- [ ] Remove `cy.wait('@alias')` - auto-waiting handles it
- [ ] Extract helpers for repeated patterns (3+ uses)
- [ ] Wrap complex steps in `test.step()`
- [ ] Remove all hardcoded waits
- [ ] Update checklist file when test passes

---

## Code Style

- No semicolons
- Single quotes
- Trailing commas
- 2-space indent

---
agent: agent
---

## Task

Prepare a Cypress test file for migration by creating a **checklist** and **skeleton spec**.

## Inputs

- **Cypress Test File**: The `.cy.ts` file attached or specified.

## Outputs

1. **Checklist**: `playwright/e2e/pensjon/kalkulator/{name}.checklist.md`
2. **Skeleton**: `playwright/e2e/pensjon/kalkulator/{name}.spec.ts`

---

## Instructions

### 1. Analyze the Cypress File

- Identify all `describe` and `it` blocks
- Note nesting structure and `beforeEach` hooks
- Count total test cases

### 2. Create Checklist File

Format:
```markdown
# {TestName} Migration Checklist

**Source:** `cypress/e2e/pensjon/kalkulator/{name}.cy.ts`
**Target:** `playwright/e2e/pensjon/kalkulator/{name}.spec.ts`
**Total tests:** {count}

## Progress: 0/{count} (0%)

### {Describe Block Name}
1. [ ] test description
2. [ ] test description

### {Nested Describe Block}
3. [ ] test description
```

### 3. Create Skeleton Spec File

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

test.describe('{Main describe}', () => {
  // Helper functions will go here (extract when used 3+ times)

  test.describe('{Nested describe}', () => {
    test.beforeEach(async ({ page }) => {
      // TODO: Migrate setup from Cypress beforeEach
    })

    // 1
    test('{test description}', async ({ page }) => {
      // TODO: Migrate
    })

    // 2
    test('{test description}', async ({ page }) => {
      // TODO: Migrate
    })
  })
})
```

**Rules:**
- Number comments match checklist numbers
- Preserve `describe` nesting structure
- Add placeholder `beforeEach` if Cypress has one
- Import only what the Cypress file actually uses (check for `cy.intercept` patterns to determine needed mocks)
- Do NOT implement any test logic yet

---

## Quick Reference

**Auth patterns the Cypress file might use:**
- `cy.login()` → `autoAuth: true` (default, no code needed)
- `cy.login()` with custom data → `authenticate(page, [mockHelpers])`
- No login / 401 tests → `test.use({ autoAuth: false })`

**Navigation patterns:**
- `cy.fillOutStegvisning({...})` → `await fillOutStegvisning(page, {...})`

**Available mock helpers:**
`person`, `tidligsteUttaksalder`, `loependeVedtak`, `apoteker`, `alderspensjon`,
`ekskludert`, `inntekt`, `offentligTp`, `omstillingsstoenadOgGjenlevende`,
`pensjonsavtaler`, `representasjonBanner`, `toggleConfig`

**Available preset states:**
`brukerUnder75`, `brukerOver75`, `brukerGift1963`, `brukerEldreEnn67`,
`apotekerMedlem`, `medPre2025OffentligAfp`, `medFremtidigAlderspensjonVedtak`,
`medTidligsteUttaksalder`, `apotekerMedlemMedTidligsteUttak`,
`brukerUnder75MedPre2025OffentligAfpOgTidligsteUttak`

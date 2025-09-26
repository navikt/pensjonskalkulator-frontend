import {
  expect,
  fillOutStegvisning,
  loadJSONFixture,
  login,
  setupInterceptions,
  test,
} from '../../../base'

type PersonFixture = { foedselsdato?: string } & Record<string, unknown>
type LoependeVedtakFixture = {
  pre2025OffentligAfp?: { fom: string }
} & Record<string, unknown>

test.beforeEach(async ({ page }) => {
  const person = (await loadJSONFixture('person.json')) as PersonFixture
  person.foedselsdato = '1960-01-01'

  const loependeVedtak = (await loadJSONFixture(
    'loepende-vedtak.json'
  )) as LoependeVedtakFixture
  loependeVedtak.pre2025OffentligAfp = { fom: '2024-08-01' }

  await setupInterceptions(page, [
    {
      url: /\/pensjon\/kalkulator\/api\/v5\/person/,
      jsonResponse: person,
    },
    {
      url: /\/pensjon\/kalkulator\/api\/v4\/vedtak\/loepende-vedtak/,
      jsonResponse: loependeVedtak,
    },
  ])
})

test.describe('AFP offentlig etterfulgt av AP', () => {
  test.describe('Gitt at bruker er innlogget og har vedtak om pre2025AfpOffentlig', () => {
    test.describe('Start side med vedtak om AFP offentlig', () => {
      test('forventer riktig ingress i start side med vedtak om AFP offentlig', async ({
        page,
      }) => {
        await login(page)
        await expect(
          page.getByTestId('stegvisning-start-ingress-pre2025-offentlig-afp')
        ).toBeVisible()
      })
    })

    test.describe('Når jeg fullfører de første stegene', () => {
      test('forventer jeg å komme til beregningsside', async ({ page }) => {
        await login(page)
        await fillOutStegvisning(page, {
          samtykke: true,
          sivilstand: 'UGIFT',
          afp: 'vet_ikke',
        })

        await expect(page).toHaveURL(/\/pensjon\/kalkulator\/beregning/)
      })
    })
  })
})

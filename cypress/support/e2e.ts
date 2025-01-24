import 'cypress-axe'

import { userInputActions } from '../../src/state/userInput/userInputReducer'

beforeEach(() => {
  cy.intercept(
    {
      method: 'GET',
      url: `/auth?`,
    },
    { fixture: 'decorator-auth.json' }
  ).as('getDecoratorPersonAuth')

  cy.intercept('GET', `https://login.nav.no/oauth2/session`, {
    statusCode: 200,
  }).as('getDecoratorLoginAuth')

  cy.intercept('GET', `/collect`, {
    statusCode: 200,
  }).as('getDecoratoCollect')

  cy.intercept(
    {
      method: 'GET',
      url: `/api/ta`,
    },
    { fixture: 'decorator-ta.json' }
  ).as('getDecoratorTa')

  cy.intercept(
    {
      method: 'GET',
      url: `/main-menu?*`,
    },
    { fixture: 'decorator-main-menu.html' }
  ).as('getDecoratorMainMenu')

  cy.intercept(
    {
      method: 'GET',
      url: `/user-menu?*`,
    },
    { fixture: 'decorator-user-menu.html' }
  ).as('getDecoratorUserMenu')

  cy.intercept(
    {
      method: 'GET',
      url: `/ops-messages`,
    },
    { fixture: 'decorator-ops.json' }
  ).as('getDecoratorOpsMessages')

  // /env?chatbot=false&logoutWarning=true&redirectToUrl=https://www.nav.no/pensjon/kalkulator/start
  // https://dekoratoren.ekstern.dev.nav.no/env?chatbot=false&logoutWarning=true&redirectToUrl=https://www.nav.no/pensjon/kalkulator/start
  cy.intercept(
    {
      method: 'GET',
      url: `${Cypress.env(
        'DEV_DECORATOR_URL'
      )}/env?chatbot=false&logoutWarning=true&redirectToUrl=https://www.nav.no/pensjon/kalkulator/start`,
    },
    { fixture: 'decorator-env-features.json' }
  ).as('getDecoratorEnvFeatures')

  cy.intercept('POST', 'https://amplitude.nav.no/collect-auto', {
    statusCode: 200,
  }).as('amplitudeCollect')

  cy.intercept('GET', '/pensjon/kalkulator/oauth2/session', {
    statusCode: 200,
  }).as('getAuthSession')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.disable-spraakvelger',
    },
    { fixture: 'toggle-disable-spraakvelger.json' }
  ).as('getFeatureToggleSpraakvelger')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.enable-redirect-1963',
    },
    { fixture: 'toggle-enable-redirect-1963.json' }
  ).as('getFeatureToggleRedirect1963')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.hent-tekster-fra-sanity',
    },
    { fixture: 'toggle-enable-sanity.json' }
  ).as('getFeatureToggleRedirect1963')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/v2/ekskludert',
    },
    { fixture: 'ekskludert-status.json' }
  ).as('getEkskludertStatus')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse',
    },
    { fixture: 'omstillingsstoenad-og-gjenlevende.json' }
  ).as('getOmstillingsstoenadOgGjenlevende')

  cy.intercept(
    {
      method: 'GET',
      url: '/pensjon/kalkulator/api/v2/vedtak/loepende-vedtak',
    },
    { fixture: 'loepende-vedtak.json' }
  ).as('getLoependeVedtak')

  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/v4/person' },
    { fixture: 'person.json' }
  ).as('getPerson')

  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/inntekt' },
    { fixture: 'inntekt.json' }
  ).as('getInntekt')

  cy.intercept(
    { method: 'POST', url: '/pensjon/kalkulator/api/v2/simuler-oftp' },
    { fixture: 'offentlig-tp.json' }
  ).as('fetchOffentligTp')

  cy.intercept(
    {
      method: 'POST',
      url: '/pensjon/kalkulator/api/v2/tidligste-hel-uttaksalder',
    },
    { fixture: 'tidligste-uttaksalder.json' }
  ).as('fetchTidligsteUttaksalder')

  cy.intercept(
    { method: 'POST', url: '/pensjon/kalkulator/api/v3/pensjonsavtaler' },
    { fixture: 'pensjonsavtaler.json' }
  ).as('fetchPensjonsavtaler')

  cy.intercept(
    {
      method: 'POST',
      url: '/pensjon/kalkulator/api/v8/alderspensjon/simulering',
    },
    { fixture: 'alderspensjon.json' }
  ).as('fetchAlderspensjon')

  cy.intercept(
    {
      method: 'GET',
      url: `https://g2by7q6m.apicdn.sanity.io/v2023-05-03/data/query/development?query=*%5B_type+%3D%3D+%22readmore%22+%26%26*`,
    },
    { fixture: 'sanity-readmore-data.json' }
  ).as('fetchSanityReadMoreData')

  cy.intercept(
    {
      method: 'GET',
      url: `https://g2by7q6m.apicdn.sanity.io/v2023-05-03/data/query/development?query=*%5B_type+%3D%3D+%22forbeholdAvsnitt%22+%26%26*`,
    },
    { fixture: 'sanity-forbehold-avsnitt-data.json' }
  ).as('fetchSanityForbeholdAvsnittData')
})

Cypress.Commands.add('login', () => {
  cy.visit('/pensjon/kalkulator/')
  cy.wait('@getAuthSession')
  // TODO reaktivere når dekoratøren er i produksjon
  // cy.wait('@getDecoratorMainMenu')
  cy.contains('button', 'Pensjonskalkulator').click()
  // På start steget kjøres automatisk kall til  /person, /ekskludert, /inntekt, /loepende-omstillingsstoenad-eller-gjenlevendeytelse
  cy.wait('@getPerson')
  cy.wait('@getEkskludertStatus')
  cy.wait('@getInntekt')
  cy.wait('@getOmstillingsstoenadOgGjenlevende')
  cy.wait('@getLoependeVedtak')
})

Cypress.Commands.add('fillOutStegvisning', (args) => {
  const {
    samtykke = false,
    afp = 'vet_ikke',
    samtykkeAfpOffentlig = true,
    samboer = true,
  } = args

  cy.window()
    .its('store')
    .invoke('dispatch', userInputActions.setSamtykke(samtykke))

  if (afp === 'ja_offentlig') {
    // Setter samtykke til beregning av AFP-offentlig når brukeren har valgt AFP-offentlig
    cy.window()
      .its('store')
      .invoke(
        'dispatch',
        userInputActions.setSamtykkeOffentligAFP(samtykkeAfpOffentlig)
      )
  }

  cy.window().its('store').invoke('dispatch', userInputActions.setAfp(afp))

  cy.window()
    .its('store')
    .invoke('dispatch', userInputActions.setSamboer(samboer))
  cy.window().its('router').invoke('navigate', '/beregning')
})

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Amplitude')) {
    // prevents Amplitude errors to fail tests
    return false
  } else if (
    err.stack?.includes(
      'https://representasjon-banner-frontend-borger-q2.ekstern.dev.nav.no'
    )
  ) {
    // prevents Representasjon banner errors to fail tests
    return false
  }
  return true
})

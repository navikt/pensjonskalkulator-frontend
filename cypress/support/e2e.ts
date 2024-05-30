import 'cypress-axe'

import { userInputActions } from '../../src/state/userInput/userInputReducer'

beforeEach(() => {
  cy.intercept('GET', `/person/nav-dekoratoren-api/auth`, {
    statusCode: 200,
    body: {
      auth: {
        authenticated: true,
        name: 'APRIKOS NORDMANN',
        securityLevel: '4',
      },
      usermenuHtml:
        '<dropdown-menu data-hj-suppress><button  class="_iconButton_sc0x4_1 _userMenuButton_ricn0_12" ><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img" class="_icon_ricn0_19" ><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75a8.25 8.25 0 0 0-5.144 14.7 5.25 5.25 0 0 1 10.288 0A8.25 8.25 0 0 0 12 3.75Zm3.747 15.602a3.75 3.75 0 0 0-7.494 0A8.215 8.215 0 0 0 12 20.25c1.35 0 2.623-.324 3.747-.898ZM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 7.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM8.25 9.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" fill="currentColor" ></path></svg><span class="_iconButtonSpan_sc0x4_49">PLEIENDE BEDRIFT</span></button><div class="_dropdownMenuContainer_y4n9k_1 _userMenuDropdown_ricn0_1"><div class="_userMenu_5tezh_1"><div class="_menuItems_5tezh_17"><div class="_menuHeader_5tezh_26"><div class="_loggedIn_5tezh_30">Logget inn</div><div class="_name_5tezh_37">PLEIENDE BEDRIFT</div></div><a href="https://www.intern.dev.nav.no/minside" class="_menuItem_5tezh_17"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img" class="_menuItemIcon_5tezh_64" ><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75a8.25 8.25 0 0 0-5.144 14.7 5.25 5.25 0 0 1 10.288 0A8.25 8.25 0 0 0 12 3.75Zm3.747 15.602a3.75 3.75 0 0 0-7.494 0A8.215 8.215 0 0 0 12 20.25c1.35 0 2.623-.324 3.747-.898ZM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 7.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM8.25 9.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" fill="currentColor" ></path></svg><span>Min side</span></a><a href="https://www.intern.dev.nav.no/person/personopplysninger" class="_menuItem_5tezh_17"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img" class="_menuItemIcon_5tezh_64" ><path fill-rule="evenodd" clip-rule="evenodd" d="M10 4.25a.75.75 0 0 0-.75.75v1.25H3a.75.75 0 0 0-.75.75v12c0 .414.336.75.75.75h18a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75h-6.25V5a.75.75 0 0 0-.75-.75h-4Zm3.25 2v-.5h-2.5v.5h2.5ZM10 7.75H3.75v10.5h16.5V7.75H10ZM5.25 10A.75.75 0 0 1 6 9.25h3a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-6Zm1.5.75v4.5h1.5v-4.5h-1.5ZM12 9.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6ZM11.25 13a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" fill="currentColor" ></path></svg><span>Personopplysninger</span></a></div><div class="_notifications_5tezh_69"><div class="_notifications_1d5h4_1"><h2 class="_notificationsHeading_1d5h4_1">Varsler</h2><div class="_notificationsEmpty_vo5ot_1"><div><h2 class="_heading_vo5ot_11">Du har ingen nye varsler</h2><p class="_description_vo5ot_18">Vi varsler deg når noe skjer.</p><a class="_link_vo5ot_25" href="/tidligere-varsler" >Se tidligere varsler</a></div><svg xmlns="http://www.w3.org/2000/svg" width="163" height="188" viewBox="0 0 163 188" fill="none" aria-hidden="true" class="_image_vo5ot_38" ><path fill="#262626" fill-rule="evenodd" d="m117.584 187.022-16.497-13.813c-5.862 2.271-12.49 3.549-19.509 3.549-7.017 0-13.644-1.278-19.506-3.548L45.58 187.018a.941.941 0 0 1-1.537-.596l-4.839-35.979a25.837 25.837 0 0 1-.924-6.85c0-18.316 19.385-33.165 43.298-33.165 23.914 0 43.299 14.849 43.299 33.165 0 .312-.006.623-.017.932l.017-.011-.023.167a25.803 25.803 0 0 1-.662 4.82l-5.071 36.927a.942.942 0 0 1-1.537.594Z" clip-rule="evenodd" /><circle cx="60.155" cy="148.892" r="9.441" fill="#FFC166" transform="rotate(-180 60.155 148.892)" /><circle cx="60.163" cy="148.892" r="7.768" fill="#262626" transform="rotate(-180 60.163 148.892)" /><circle cx="65.765" cy="153.39" r="1.679" fill="#fff" transform="rotate(-180 65.765 153.39)" /><circle cx="102.539" cy="148.892" r="9.441" fill="#FFC166" transform="rotate(-180 102.539 148.892)" /><circle cx="102.538" cy="148.892" r="7.768" fill="#262626" transform="rotate(-180 102.538 148.892)" /><circle cx="108.149" cy="153.389" r="1.679" fill="#fff" transform="rotate(-180 108.149 153.389)" /><path fill="#E18071" d="M81.205 148.2c1.59 0 3.229-.228 4.437-.458.662-.127.886-.922.415-1.403l-4.199-4.293a.883.883 0 0 0-1.283.023l-3.947 4.323c-.435.476-.224 1.226.407 1.358 1.091.227 2.599.45 4.17.45Z" /><path stroke="#262626" stroke-linecap="round" stroke-width=".957" d="M114.883 149.352c5.414 2.612 18.307 7.688 43.154 7.091M47.95 149.352c-5.413 2.612-18.306 7.688-43.153 7.091M119.345 143.996c4.468-.159 17.964 1.439 33.913-4.462M43.488 143.996c-4.467-.159-17.963 1.439-33.913-4.462" /><path stroke="#262626" stroke-linecap="round" stroke-width=".883" d="M121.187 147.74c6.449 1.381 23.031 3.224 40.535-.001M41.647 147.74c-6.449 1.381-23.031 3.224-40.535-.001" /><path fill="#D47B00" fill-rule="evenodd" d="M20.815 143.269v-6.133h36.794v6.133c0 10.16-8.236 18.397-18.397 18.397-10.16 0-18.397-8.237-18.397-18.397Z" clip-rule="evenodd" /><path fill="#FA3" fill-rule="evenodd" d="M39.212 161.666c9.258 0 4.92-18.397-18.397-18.397 0 10.16 8.237 18.397 18.397 18.397Z" clip-rule="evenodd" /><path fill="#262626" fill-rule="evenodd" d="M30.183 162.771c-2.752-.954-5.83-2.927-8.348-5.749-3.79-4.246-5.213-9.182-4.52-12.284a6.205 6.205 0 0 1 12.364-.494 6.193 6.193 0 0 1 4.745 2.072 6.197 6.197 0 0 1 1.445 5.396 6.384 6.384 0 0 1 1.9 1.457c2.317 2.597 2.123 6.552-.434 8.834-2.012 1.796-4.889 2.02-7.152.768Z" clip-rule="evenodd" /><path fill="#FFC166" d="M89.55 8.05a8.05 8.05 0 1 0-16.1 0v8.05c0 .19.007.38.02.568-27.317 3.897-48.32 27.387-48.32 55.782v11.083a51.332 51.332 0 0 1-9.209 29.336L2.444 132.25A8.049 8.049 0 0 0 9.05 144.9h144.9a8.05 8.05 0 0 0 6.606-12.65l-13.497-19.381a51.332 51.332 0 0 1-9.209-29.336V72.45c0-28.395-21.002-51.884-48.32-55.782.014-.188.02-.377.02-.568V8.05Z" /><path fill="#fff" fill-rule="evenodd" d="M102.849 42.421a4.715 4.715 0 0 1 4.181 4.181l1.812 16.758a.726.726 0 0 0 1.444 0l1.812-16.758a4.715 4.715 0 0 1 4.181-4.181l16.757-1.812a.726.726 0 0 0 0-1.444l-16.757-1.811a4.715 4.715 0 0 1-4.181-4.181l-1.812-16.758a.726.726 0 0 0-1.444 0l-1.812 16.758a4.715 4.715 0 0 1-4.181 4.18l-16.758 1.812a.726.726 0 0 0 0 1.444l16.758 1.812Z" clip-rule="evenodd" /></svg></div><a class="_allNotificationsLink_1d5h4_24" href="/tidligere-varsler" >Tidligere varsler</a></div></div><a href="https://login.ekstern.dev.nav.no/oauth2/logout" class="_menuItem_5tezh_17 _logout_5tezh_75"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img" class="" ><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 5c0-.966.784-1.75 1.75-1.75h3.5a.75.75 0 0 1 0 1.5H5a.25.25 0 0 0-.25.25v14c0 .138.112.25.25.25h3.5a.75.75 0 0 1 0 1.5H5A1.75 1.75 0 0 1 3.25 19V5Zm4.5 7a.75.75 0 0 1 .75-.75h9.69l-3.22-3.22a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H8.5a.75.75 0 0 1-.75-.75Z" fill="currentColor" ></path></svg><span>Logg ut</span></a></div></div></dropdown-menu>',
    },
  }).as('getDecoratorPersonAuth')

  cy.intercept('GET', `https://login.nav.no/oauth2/session`, {
    statusCode: 200,
  }).as('getDecoratorLoginAuth')

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
    { fixture: 'decorator-ops-messages.html' }
  ).as('getDecoratorOpsMessages')

  cy.intercept(
    {
      method: 'GET',
      url: `${Cypress.env(
        'DECORATOR_URL'
      )}/env?chatbot=false&redirectToUrl=https://www.nav.no/pensjon/kalkulator/start`,
    },
    { fixture: 'decorator-env-features.json' }
  ).as('getDecoratorEnvFeatures')

  cy.intercept('POST', '/collect', {
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
      url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.enable-highcharts-accessibility-plugin',
    },
    { fixture: 'toggle-enable-highcharts-accessibility-plugin.json' }
  ).as('getFeatureToggleHighcharts')

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
      url: '/pensjon/kalkulator/api/v1/ufoeregrad',
    },
    { fixture: 'ufoeregrad.json' }
  ).as('getUfoeregrad')

  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/v2/person' },
    { fixture: 'person.json' }
  ).as('getPerson')

  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/inntekt' },
    { fixture: 'inntekt.json' }
  ).as('getInntekt')

  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/tpo-medlemskap' },
    { fixture: 'tpo-medlemskap.json' }
  ).as('getTpoMedlemskap')

  cy.intercept(
    {
      method: 'POST',
      url: '/pensjon/kalkulator/api/v1/tidligste-hel-uttaksalder',
    },
    { fixture: 'tidligste-uttaksalder.json' }
  ).as('fetchTidligsteUttaksalder')

  cy.intercept(
    { method: 'POST', url: '/pensjon/kalkulator/api/v2/pensjonsavtaler' },
    { fixture: 'pensjonsavtaler.json' }
  ).as('fetchPensjonsavtaler')

  cy.intercept(
    {
      method: 'POST',
      url: '/pensjon/kalkulator/api/v5/alderspensjon/simulering',
    },
    { fixture: 'alderspensjon.json' }
  ).as('fetchAlderspensjon')
})

Cypress.Commands.add('login', () => {
  cy.visit('/pensjon/kalkulator/')
  cy.wait('@getAuthSession')
  cy.contains('button', 'Enkel kalkulator').click()
  cy.wait('@getPerson')
  cy.wait('@getInntekt')
})

Cypress.Commands.add('fillOutStegvisning', (args) => {
  const { samtykke, afp = 'vet_ikke', samboer = true } = args
  cy.window()
    .its('store')
    .invoke('dispatch', userInputActions.setSamtykke(samtykke))
  cy.window().its('store').invoke('dispatch', userInputActions.setAfp(afp))
  cy.window()
    .its('store')
    .invoke('dispatch', userInputActions.setSamboer(samboer))
  cy.window().its('router').invoke('navigate', '/beregning')
})

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Amplitude')) {
    // prevents Amplitude errors to fail tests
    return false
  }
})

import 'cypress-axe'

beforeEach(() => {
  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/tidligste-uttaksalder' },
    { fixture: 'tidligste-uttaksalder.json' }
  )
  cy.intercept(
    { method: 'GET', url: '/pensjon/kalkulator/api/person' },
    { fixture: 'person.json' }
  )
})

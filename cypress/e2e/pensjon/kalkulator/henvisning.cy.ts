describe('Henvisning', () => {
  describe('Når jeg som bruker som er medlem av apotekerne logger inn,', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', url: '/pensjon/kalkulator/api/v2/ekskludert' },
        {
          ekskludert: true,
          aarsak: 'ER_APOTEKER',
        }
      ).as('getEkskludertStatus')
    })
    it('forventer jeg informasjon om at jeg ikke kan bruke enkel kalkulator. Jeg ønsker å kunne gå til detaljert kalkulator eller avbryte.', () => {
      cy.login()
      cy.wait('@getAuthSession')
      cy.contains('Kom i gang').should('not.exist')
      cy.contains('Du kan dessverre ikke bruke enkel kalkulator').should(
        'exist'
      )
      cy.contains('button', 'Detaljert pensjonskalkulator').click()
      cy.origin('https://login.idporten.no', () => {
        cy.get('h1').contains('Velg innloggingsmetode')
      })
      cy.visit('/pensjon/kalkulator/start')
      cy.contains('button', 'Avbryt').click()
      cy.location('href').should(
        'eq',
        'http://localhost:4173/pensjon/kalkulator/login'
      )
    })
  })
})

export {}

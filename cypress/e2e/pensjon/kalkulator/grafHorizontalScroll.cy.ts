describe('Graf Horizontal scroll', () => {
  context('Gitt at grafen rendres på desktop,', () => {
    beforeEach(() => {
      cy.login()
      cy.fillOutStegvisning({})
    })

    it('brukeren kan se og bruke navigasjonsknappene når antall søyler passer i skjermens bredde.', () => {
      cy.wait('@fetchTidligsteUttaksalder')

      cy.contains('button', '70 år').click()
      cy.wait('@fetchAlderspensjon')
      cy.contains('button', 'Færre år').should('not.exist')
      cy.contains('button', 'Flere år').should('not.exist')
    })

    it('brukeren kan se og bruke navigasjonsknappene når det er flere søyler enn skjermens bredde.', () => {
      cy.wait('@fetchTidligsteUttaksalder')

      cy.viewport('iphone-xr')
      cy.contains('button', '67 år').click()
      cy.wait('@fetchAlderspensjon')
      cy.contains('button', 'Færre år').should('not.exist')
      cy.contains('button', 'Flere år').should('exist')

      // Scroller til høyre slik at begge knappene blir synlige
      cy.contains('button', 'Flere år').click({ force: true })
      cy.contains('button', 'Færre år').should('exist')
      cy.contains('button', 'Flere år').should('exist')
      // Scroller maksimalt til høyre slik at Flere år skjules
      cy.contains('button', 'Flere år').click({ force: true })
      cy.contains('button', 'Flere år').click({ force: true })
      cy.contains('button', 'Flere år').click({ force: true })
      cy.contains('button', 'Flere år').should('not.exist')
      // Scroller til venstre slik at begge knappene blir synlige igjen
      cy.contains('button', 'Færre år').click({ force: true })
      cy.contains('button', 'Færre år').should('exist')
      cy.contains('button', 'Flere år').should('exist')
      // Scroller maksimalt til venstre slik at Færre år skjules
      cy.contains('button', 'Færre år').click({ force: true })
      cy.contains('button', 'Færre år').click({ force: true })
      cy.contains('button', 'Færre år').click({ force: true })
      cy.contains('button', 'Færre år').should('not.exist')
      cy.contains('button', 'Flere år').should('exist')
    })
  })
})

export {}

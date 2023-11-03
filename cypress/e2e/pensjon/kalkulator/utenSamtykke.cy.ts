describe('Uten samtykke', () => {
  describe('Som bruker som har logget inn på kalkulatoren,', () => {
    describe('Gitt at jeg ikke samtykker til innhenting av avtaler,', () => {
      describe('Når jeg navigerer videre fra /samtykke til /offentlig-tp', () => {
        beforeEach(() => {
          cy.login()
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
        })
        it('forventer jeg at det ikke hentes informasjon om pensjonsavtaler eller tjenestepensjon.', () => {
          cy.contains(
            'h2',
            'Du kan ha rett til offentlig tjenestepensjon'
          ).should('not.exist')
          cy.contains(
            'h2',
            'Vi klarte ikke å sjekke om du har pensjonsavtaler fra offentlig sektor'
          ).should('not.exist')
        })
      })

      describe('Når jeg er kommet til beregningssiden og velger hvilken alder jeg ønsker beregning fra,', () => {
        beforeEach(() => {
          cy.login()
          cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: false })
          cy.wait('@fetchTidligsteUttaksalder')
        })

        it('ønsker jeg en graf som viser utviklingen av total pensjon (Inntekt, AFP, alderspensjon) fra uttaksalderen jeg har valgt. Jeg forventer at resultatet ikke viser tjenestepensjon og pensjonsavtaler siden jeg ikke har gitt samtykke til innhenting av opplysninger fra Norsk pensjon og offentlige tjenestepensjonsordninger.', () => {
          cy.contains('button', '62 år og 10 md.').click()
          cy.wait('@fetchAlderspensjon')
          cy.contains('Beregning').should('exist')
          cy.contains('Pensjonsgivende inntekt').should('exist')
          cy.contains('AFP (Avtalefestet pensjon)').should('exist')
          cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should(
            'not.exist'
          )
          cy.contains('Alderspensjon (NAV)').should('exist')
          cy.contains('Tusen kroner').should('exist')
          cy.contains('61').should('exist')
          cy.contains('77+').should('exist')
          cy.contains('button', '70 år').click({ force: true })
          cy.wait('@fetchAlderspensjon')
          cy.contains('69').should('exist')
          cy.contains('77+').should('exist')

          cy.contains('Vis tabell av beregningen').click({ force: true })
          cy.contains('Lukk tabell av beregningen').should('exist')
          cy.contains('Alder').should('exist')
          cy.contains('Sum (kr)').should('exist')
          cy.get('.navds-table__toggle-expand-button')
            .first()
            .click({ force: true })
          cy.contains('0').should('exist')
          cy.contains('dt', 'Pensjonsgivende inntekt').should('exist')
          cy.contains('dt', 'AFP (Avtalefestet pensjon)').should('exist')
          cy.contains('dt', 'Pensjonsavtaler (arbeidsgivere m.m.)').should(
            'not.exist'
          )
          cy.contains('dt', 'Alderspensjon (NAV)').should('exist')
        })

        it('forventer jeg å få informasjon om grunnlaget for beregningen og at pensjonsavtaler ikke er hentet.', () => {
          cy.contains('button', '70').click()
          cy.contains('Grunnlaget for beregningen').should('exist')
          cy.contains('Pensjonsavtaler:').click()
          cy.contains('Ikke innhentet').should('exist')
          cy.contains(
            'Du har ikke samtykket til å hente inn pensjonsavtaler'
          ).should('exist')
        })

        it('ønsker jeg å kunne starte ny beregning, eller avbryte beregningen.', () => {
          cy.contains('button', '62 år og 10 md.').click()
          cy.contains('button', 'Tilbake til start').click()
          cy.location('href').should('include', '/pensjon/kalkulator/start')
          cy.fillOutStegvisning({ samtykke: false })
          cy.contains('button', 'Avbryt').click()
          cy.location('href').should('include', '/pensjon/kalkulator/login')
        })
      })
    })
  })
})

export {}

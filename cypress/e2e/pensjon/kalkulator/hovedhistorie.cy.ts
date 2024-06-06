describe('Hovedhistorie', () => {
  describe('Når jeg som bruker navigerer på nav.no/din pensjon og velger å prøve den nye kalkulatoren,', () => {
    it('ønsker jeg å få informasjon om ny kalkulator og om jeg er i målgruppen for å bruke den.', () => {
      cy.visit('https://www.nav.no/planlegger-pensjon')
      cy.contains('a', 'Prøv pensjonskalkulatoren')
        .should('have.attr', 'href')
        .and(
          'include',
          'https://tjenester.nav.no/pselv/publisering/dinpensjon.jsf'
        )
    })
  })

  describe('Gitt at jeg som bruker ikke er pålogget,', () => {
    beforeEach(() => {
      cy.intercept('GET', '/pensjon/kalkulator/oauth2/session', {
        statusCode: 401,
      }).as('getAuthSession')
      cy.visit('/pensjon/kalkulator/')
      cy.wait('@getAuthSession')
    })

    describe('Hvis jeg ikke er i målgruppen for ny kalkulator eller ikke bør bruke kalkulatoren,', () => {
      it('forventer jeg tilgang til detaljert kalkulator og uinnlogget kalkulator.', () => {
        Cypress.on('uncaught:exception', (err) => {
          // prevents Cypress from failing when catching errors in uinnlogget kalkulator
          return false
        })
        cy.contains('button', 'Logg inn i pensjonskalkulator').should('exist')
        cy.contains('button', 'Logg inn i detaljert pensjonskalkulator').click()

        cy.origin('https://login.idporten.no', () => {
          cy.get('h1').contains('Velg elektronisk ID')
        })
        // Denne må deaktiveres foreløpig på grunn av OWASP CSRFGuard JavaScript was included from within an unauthorized domain!
        // cy.visit('/pensjon/kalkulator/')
        // cy.contains('button', 'Uinnlogget kalkulator').click()
        // cy.origin('https://www.nav.no/pselv', () => {
        //   cy.get('h1').contains('Forenklet pensjonsberegning')
        // })
      })
    })

    describe('Når jeg vil logge inn for å teste kalkulatoren,', () => {
      it('ønsker jeg å få informasjon om ny kalkulator og om jeg er i målgruppen for å bruke den.', () => {
        cy.contains('a', 'Personopplysninger som brukes i pensjonskalkulator')
          .should('have.attr', 'href')
          .and('include', '/pensjon/kalkulator/personopplysninger')
      })

      it('forventer jeg å kunne logge inn med ID-porten.', () => {
        cy.contains('button', 'Logg inn i pensjonskalkulator').click()
        cy.location('href').should(
          'eq',
          'http://localhost:4173/pensjon/kalkulator/oauth2/login?redirect=%2Fpensjon%2Fkalkulator%2Fstart'
        )
      })
    })
  })

  describe('Som bruker som har logget inn på kalkulatoren,', () => {
    describe('Når jeg navigerer videre fra /login til /start,', () => {
      beforeEach(() => {
        cy.visit('/pensjon/kalkulator/')
        cy.wait('@getAuthSession')
      })
      it('forventer jeg å se en startside som ønsker meg velkommen.', () => {
        cy.contains('button', 'Detaljert pensjonskalkulator').should('exist')
        cy.contains('button', 'Pensjonskalkulator').click()
        cy.contains('Hei Aprikos!')
      })
      it('ønsker jeg informasjon om hvilke personopplysninger som brukes i kalkulatoren.', () => {
        cy.contains('button', 'Pensjonskalkulator').click()
        cy.contains('a', 'Personopplysninger som brukes i pensjonskalkulator')
          .should('have.attr', 'href')
          .and('include', '/pensjon/kalkulator/personopplysninger')
      })
      it('ønsker jeg å kunne starte kalkulatoren eller avbryte beregningen.', () => {
        cy.contains('button', 'Pensjonskalkulator').click()
        cy.contains('button', 'Kom i gang').click()
        cy.location('href').should(
          'include',
          '/pensjon/kalkulator/utenlandsopphold'
        )
        cy.go('back')
        cy.contains('button', 'Avbryt').click()
        cy.location('href').should('include', '/pensjon/kalkulator/login')
      })
    })

    describe('Når jeg navigerer videre fra /start til /utenlandsopphold,', () => {
      beforeEach(() => {
        cy.login()
        cy.contains('button', 'Kom i gang').click()
      })
      it('forventer jeg å bli spurt om jeg har bodd/jobbet mer enn 5 år utenfor Norge.', () => {
        cy.contains('h2', 'Utenlandsopphold').should('exist')
        cy.contains(
          'Har du bodd eller jobbet utenfor Norge i mer enn 5 år etter fylte 16 år?'
        ).should('exist')
      })
      it('forventer å måtte svare ja/nei på spørsmål om tid utenfor Norge.', () => {
        cy.contains('button', 'Neste').click()
        cy.contains(
          'Du må svare på om du har bodd eller jobbet utenfor Norge i mer enn 5 år etter fylte 16 år.'
        ).should('exist')
        cy.get('[type="radio"]').first().check()
        cy.contains(
          'Du må svare på om du har bodd eller jobbet utenfor Norge i mer enn 5 år etter fylte 16 år.'
        ).should('not.exist')
        cy.contains('button', 'Neste').click()
      })
      it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
        cy.contains('button', 'Tilbake').click()
        cy.location('href').should('include', '/pensjon/kalkulator/start')
        cy.go('back')
        cy.contains('button', 'Avbryt').click()
        cy.location('href').should('include', '/pensjon/kalkulator/login')
      })
    })

    describe('Gitt at jeg som bruker svarer nei på bodd/jobbet mer enn 5 år utenfor Norge,', () => {
      describe('Når jeg navigerer videre fra /utenlandsopphold til /samtykke,', () => {
        beforeEach(() => {
          cy.login()
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
        })
        it('forventer jeg å bli spurt om mitt samtykke, og få informasjon om hva samtykket innebærer.', () => {
          cy.contains('h2', 'Pensjonsavtaler').should('exist')
          cy.contains('Skal vi hente pensjonsavtalene dine?').should('exist')
          cy.contains('Disse opplysningene henter vi').should('exist')
        })
        it('forventer å måtte svare ja/nei på spørsmål om samtykke for å hente mine avtaler eller om jeg ønsker å gå videre med bare alderspensjon.', () => {
          cy.contains('button', 'Neste').click()
          cy.contains(
            'Du må svare på om du vil at vi skal hente dine pensjonsavtaler.'
          ).should('exist')
          cy.get('[type="radio"]').last().check()
          cy.contains(
            'Du må svare på om du vil at vi skal hente dine pensjonsavtaler.'
          ).should('not.exist')
          cy.contains('button', 'Neste').click()
        })
        it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
          cy.contains('button', 'Tilbake').click()
          cy.location('href').should(
            'include',
            '/pensjon/kalkulator/utenlandsopphold'
          )
          cy.go('back')
          cy.contains('button', 'Avbryt').click()
          cy.location('href').should('include', '/pensjon/kalkulator/login')
        })
      })
    })

    describe('Gitt at jeg som bruker har samtykket til innhenting av avtaler og har TP tilhørighet,', () => {
      describe('Når jeg navigerer videre fra /samtykke til /offentlig-tp', () => {
        beforeEach(() => {
          cy.login()
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
          cy.wait('@getTpoMedlemskap')
        })
        it('forventer jeg å få informasjon om jeg er eller har vært medlem av en offentlig tjenestepensjonsordning.', () => {
          cy.contains(
            'h2',
            'Du kan ha rett til offentlig tjenestepensjon'
          ).should('exist')
        })
        it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
          cy.contains('button', 'Tilbake').click()
          cy.location('href').should('include', '/pensjon/kalkulator/samtykke')
          cy.go('back')
          cy.contains('button', 'Avbryt').click()
          cy.location('href').should('include', '/pensjon/kalkulator/login')
        })
      })
    })

    describe('Når jeg navigerer videre fra /offentlig-tp til /afp,', () => {
      beforeEach(() => {
        cy.login()
        cy.contains('button', 'Kom i gang').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click()
        cy.wait('@getTpoMedlemskap')
        cy.contains('button', 'Neste').click()
      })
      it('forventer jeg å få informasjon om AFP og muligheten for å velge om jeg ønsker å beregne AFP.', () => {
        cy.contains('h2', 'Avtalefestet pensjon').should('exist')
        cy.contains('Om avtalefestet pensjon i offentlig sektor').click()
        cy.contains('Om avtalefestet pensjon i privat sektor').click()
        cy.contains('a', 'AFP i privat sektor på afp.no')
          .should('have.attr', 'href')
          .and('include', 'https://www.afp.no')
      })
      it('forventer jeg å måtte  velge om jeg vil beregne med eller uten AFP både i privat og offentlig sektor. Jeg må kunne svare nei for å bare beregne alderspensjon, eller vet ikke hvis jeg er usikker.', () => {
        cy.contains('Har du rett til AFP?').should('exist')
        cy.contains('Ja, i offentlig sektor').should('exist')
        cy.contains('Ja, i privat sektor').should('exist')
        cy.contains('Nei').should('exist')
        cy.contains('Vet ikke').should('exist')
        cy.contains('button', 'Neste').click()
        cy.contains('Du må svare på om du har rett til AFP.').should('exist')
        cy.get('[type="radio"]').last().check()
        cy.contains('Du må svare på om du har rett til AFP.').should(
          'not.exist'
        )
        cy.contains('button', 'Neste').click()
      })
      it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
        cy.contains('button', 'Tilbake').click()
        cy.location('href').should(
          'include',
          '/pensjon/kalkulator/offentlig-tp'
        )
        cy.go('back')
        cy.contains('button', 'Avbryt').click()
        cy.location('href').should('include', '/pensjon/kalkulator/login')
      })
    })

    describe('Gitt at jeg som bruker har svart "ja, offentlig" på spørsmålet om AFP,', () => {
      describe('Når jeg navigerer videre fra /afp til /samtykke-offentlig-afp,', () => {
        beforeEach(() => {
          cy.login()
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
          cy.wait('@getTpoMedlemskap')
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
        })
        it('forventer jeg å bli spurt om mitt samtykke for beregning av offentlig-AFP, og få informasjon om hva samtykket innebærer.', () => {
          cy.contains(
            'h2',
            'Samtykke til at NAV beregner avtalefestet pensjon'
          ).should('exist')
          cy.contains('Vil du at NAV skal beregne AFP for deg?').should('exist')
          cy.contains('button', 'Neste').click()
          cy.contains(
            'Du må svare på om du vil at NAV skal beregne AFP for deg.'
          ).should('exist')
          cy.get('[type="radio"]').last().check()
          cy.contains(
            'Du må svare på om du vil at NAV skal beregne AFP for deg.'
          ).should('not.exist')
          cy.contains('button', 'Neste').click()
        })

        it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
          cy.contains('button', 'Tilbake').click()
          cy.location('href').should('include', '/pensjon/kalkulator/afp')
          cy.go('back')
          cy.contains('button', 'Avbryt').click()
          cy.location('href').should('include', '/pensjon/kalkulator/login')
        })
      })
    })

    describe('Gitt at jeg som bruker er registrert med en annen sivilstand enn gift eller registrert partner,', () => {
      describe('Når jeg navigerer videre fra /afp til /sivilstand,', () => {
        beforeEach(() => {
          cy.login()
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
          cy.wait('@getTpoMedlemskap')
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
        })
        it('forventer jeg å måtte opplyse om at jeg har samboer eller ikke for å få riktig beregning.', () => {
          cy.contains('h2', 'Din sivilstand').should('exist')
          cy.contains('button', 'Beregn pensjon').click()
          cy.contains('Du må svare på om du har samboer.').should('exist')
          cy.get('[type="radio"]').last().check()
          cy.contains('Du må svare på om du har samboer.').should('not.exist')
          cy.contains('button', 'Beregn pensjon').click()
        })
        it('ønsker jeg å kunne gå tilbake til forrige steg, eller avbryte beregningen.', () => {
          cy.contains('button', 'Tilbake').click()
          cy.location('href').should('include', '/pensjon/kalkulator/afp')
          cy.go('back')
          cy.contains('button', 'Avbryt').click()
          cy.location('href').should('include', '/pensjon/kalkulator/login')
        })
      })
    })

    describe('Når jeg venter på at resultatet kommer fram,', () => {
      it('forventer jeg en melding dersom det tar tid før resultatet kommer opp. ', () => {
        cy.login()
        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v1/tidligste-hel-uttaksalder',
          },
          (req) => {
            req.on('response', (res) => {
              res.setDelay(1000)
            })
          }
        )
        cy.fillOutStegvisning({ samtykke: false })
        cy.get('[data-testid="uttaksalder-loader"]').should('exist')
      })
    })

    describe('Når jeg er kommet til beregningssiden,', () => {
      it('ønsker jeg som er født i 1963 informasjon om når jeg tidligst kan starte uttak av pensjon.', () => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains(
          'Din opptjening gjør at du tidligst kan ta ut 100 % alderspensjon når du er'
        ).should('exist')
        cy.contains('62 år og 10 måneder').should('exist')
        cy.contains('Jo lenger du venter, desto mer får du i året.').should(
          'exist'
        )
      })
      it('ønsker jeg som er født fom. 1964 informasjon om når jeg tidligst kan starte uttak av pensjon.', () => {
        cy.intercept(
          { method: 'GET', url: '/pensjon/kalkulator/api/v2/person' },
          {
            navn: 'Aprikos',
            sivilstand: 'UGIFT',
            foedselsdato: '1964-04-30',
          }
        ).as('getPerson')
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains(
          'Din opptjening gjør at du tidligst kan ta ut 100 % alderspensjon når du er'
        ).should('exist')
        cy.contains('62 år og 10 måneder').should('exist')
        cy.contains('Det kan bli senere pga. økt pensjonsalder.').should(
          'exist'
        )
      })
      it('må jeg kunne trykke på Readmore for å få mer informasjon om pensjonsalder', () => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Om pensjonsalder').click()
        cy.contains('Den oppgitte alderen er et estimat.').should('exist')
      })
      it('forventer jeg å få knapper jeg kan trykke på for å velge og sammenligne ulike uttakstidspunkt. Bruker må også kunne sammenligne uttak mellom 62 år og 10 md. (første mulige) og 75 år.', () => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.get('.VelgUttaksalder--wrapper button').should('have.length', 14)
        cy.contains('button', '62 år og 10 md.').should('exist')
        cy.contains('button', '75 år').should('exist')
      })
    })

    describe('Når jeg velger hvilken alder jeg ønsker beregning fra,', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: true })
        cy.wait('@fetchTidligsteUttaksalder')
      })

      it('ønsker jeg en graf som viser utviklingen av total pensjon (Inntekt, AFP, Pensjonsavtaler, alderspensjon) fra uttaksalderen jeg har valgt. Jeg forventer å kunne velge ny uttaksalder for å sammenligne hvordan pensjon blir ved ulike uttaksaldre.', () => {
        cy.contains('button', '62 år og 10 md.').click()
        cy.contains('Beregning').should('exist')
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('AFP (Avtalefestet pensjon)').should('exist')
        cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should('exist')
        cy.contains('Alderspensjon (NAV)').should('exist')
        cy.contains('Tusen kroner').should('be.visible')
        cy.contains('61').should('be.visible')
        cy.contains('87+').should('exist')
        cy.contains('button', '70 år').click({ force: true })
        cy.contains('61').should('not.be.visible')
        cy.contains('69').should('be.visible')
        cy.contains('87+').should('exist')
      })

      it('forventer jeg en egen tabell med oversikt over mine pensjonsavtaler. Jeg må kunne trykke på trykk vis mer for å se all informasjon, og vis mindre for å skjule informasjon om pensjonsavtaler.', () => {
        cy.contains('button', '70').click()
        cy.contains('Pensjonsavtaler').should('be.visible')
        cy.get('[data-testid="showmore-button"]').click()
        cy.contains('Andre avtaler').should('be.visible')
        cy.contains('Privat tjenestepensjon').should('be.visible')
        cy.contains('Offentlig tjenestepensjon').should('be.visible')
        cy.contains('Individuelle ordninger').should('be.visible')
        cy.contains('Vis mindre').should('be.visible')
      })

      it('forventer jeg å få informasjon om øvrig grunnlag for beregningen. Jeg må kunne trykke på de ulike faktorene for å få opp mer informasjon.', () => {
        cy.contains('button', '70').click()
        cy.contains('Øvrig grunnlag for beregningen').should('exist')
        cy.contains('Uttaksgrad:').click({ force: true })
        cy.contains('Inntekt frem til uttak:').click({ force: true })
        cy.contains('Sivilstand:').click({ force: true })
        cy.contains('Opphold i Norge:').click({ force: true })
        cy.contains('AFP:').click({ force: true })
      })

      it('forventer jeg å kunne lese enkle forbehold, og få lenke til utfyllende forbehold.', () => {
        cy.contains('button', '70').click()
        cy.contains('Forbehold').should('exist')
        cy.contains('a', 'Alle forbehold')
          .should('have.attr', 'href')
          .and('include', '/pensjon/kalkulator/forbehold')
        cy.contains('a', 'detaljert pensjonskalkulator')
          .should('have.attr', 'href')
          .and('include', 'https://www.nav.no/pselv/simulering.jsf')
      })

      it('ønsker jeg å kunne starte ny beregning.', () => {
        cy.contains('button', '62 år og 10 md.').click()
        cy.contains('button', 'Tilbake til start').click({ force: true })
        cy.location('href').should('include', '/pensjon/kalkulator/start')
      })
    })

    describe('Når jeg foretrekker tabell frem for graf,', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: true })
        cy.wait('@fetchTidligsteUttaksalder')
      })

      it('ønsker jeg å få resultatet presentert i både graf og tabell, og mulighet til å lukke/åpne tabellen.', () => {
        cy.contains('button', '70').click()
        cy.contains('Beregning').should('exist')
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
          'exist'
        )
        cy.contains('dt', 'Alderspensjon (NAV)').should('exist')
      })
    })

    describe('Når jeg endrer fremtidig inntekt,', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: true })
        cy.wait('@fetchTidligsteUttaksalder')
      })

      it('ønsker jeg at tidligste uttakstidspunkt oppdateres og at knapper jeg kan trykke på for å velge uttakstidspunkt tilpasses oppdatert uttakstidspunkt.', () => {
        cy.contains('button', '70').click()
        cy.get('.highcharts-series-group .highcharts-series-0 path')
          .first()
          .click()
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('521 338 kr').should('exist')
        cy.contains('Inntekt frem til uttak: 521 338 kr').should('exist')
        cy.contains(
          'Din opptjening gjør at du tidligst kan ta ut 100 % alderspensjon når du er 62 år og 10 måneder'
        ).should('exist')

        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v1/tidligste-hel-uttaksalder',
          },
          {
            aar: 67,
            maaneder: 0,
          }
        ).as('fetchTidligsteUttaksalder')
        cy.contains('button', 'Inntekt frem til uttak').click()
        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').type('0')
        cy.contains('button', 'Oppdater inntekt').click()
        cy.get('62 år og 10 måneder').should('not.exist')
        cy.contains(
          'Din opptjening gjør at du tidligst kan ta ut 100 % alderspensjon når du er 67 år.'
        ).should('exist')
      })

      it('ønsker jeg å få resultatet oppdatert i graf og tabell og å kunne endre inntekt flere ganger for å sammenligne pensjon ved ulike inntekter.', () => {
        cy.contains('button', '70').click()
        cy.get('.highcharts-series-group .highcharts-series-0 path')
          .first()
          .click()
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('521 338 kr').should('exist')
        cy.contains('Inntekt frem til uttak: 521 338 kr').should('exist')
        cy.contains('button', 'Inntekt frem til uttak').click()

        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').type('100000')
        cy.contains('button', 'Oppdater inntekt').click()
        cy.get('[data-testid="alert-inntekt"]').should('exist')

        cy.contains('button', '70').click()
        cy.get('[data-testid="alert-inntekt"]').should('not.exist')
        cy.contains('Inntekt frem til uttak: 100 000 kr').should('exist')
        cy.get('.highcharts-series-group .highcharts-series-0 path')
          .first()
          .click({ force: true })
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('100 000 kr').should('exist')
        cy.contains('Vis tabell av beregningen').click({ force: true })
        cy.get('.TabellVisning--table tbody tr').first().click({ force: true })
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('100 000').should('exist')

        cy.contains('button', 'Inntekt frem til uttak').click()
        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').clear().type('800000')
        cy.contains('button', 'Oppdater inntekt').click()

        cy.contains('button', '70').click()
        cy.contains('Inntekt frem til uttak: 800 000 kr').should('exist')
        cy.get('.highcharts-series-group .highcharts-series-0 path')
          .first()
          .click()
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('800 000 kr').should('exist')
      })

      it('ønsker jeg å kunne starte på nytt og at inntekt da er tilbake til siste årsinntekt.', () => {
        cy.contains('button', '70').click()
        cy.get('.highcharts-series-group .highcharts-series-0 path')
          .first()
          .click()
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('521 338 kr').should('exist')
        cy.contains('Inntekt frem til uttak: 521 338 kr').should('exist')
        cy.contains('button', 'Inntekt frem til uttak').click({ force: true })

        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').type('100000')
        cy.contains('button', 'Oppdater inntekt').click()
        cy.contains('button', '70').click()
        cy.contains('Inntekt frem til uttak: 100 000 kr').should('exist')

        cy.contains('button', 'Tilbake').click({ force: true })
        cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: true })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('button', '70').click()
        cy.contains('Inntekt frem til uttak: 521 338 kr').should('exist')
      })
    })
  })
})

export {}

describe('Ufoeretrygd', () => {
  describe('Som bruker som har logget inn på kalkulatoren,', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.enable-ufoere',
        },
        {
          enabled: true,
        }
      ).as('getFeatureToggleUfoere')
      cy.login()
    })

    describe('Som bruker som mottar uføretrygd,', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', url: '/pensjon/kalkulator/api/v1/ufoeregrad' },
          {
            ufoeregrad: 100,
          }
        ).as('getUfoeregrad')
        cy.contains('button', 'Kom i gang').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.contains('button', 'Neste').click()
      })

      describe('Når jeg svarer "nei" på spørsmål om AFP,', () => {
        it('forventer jeg å kunne gå videre til neste steg.', () => {
          cy.contains('Har du rett til AFP?').should('exist')
          cy.contains('Ja, i offentlig sektor').should('exist')
          cy.contains('Ja, i privat sektor').should('exist')
          cy.contains('Nei').should('exist')
          cy.contains('Vet ikke').should('exist')
          cy.get('[type="radio"]').eq(2).check()
          cy.contains('button', 'Neste').click()
          cy.contains('Din sivilstand').should('exist')
        })
        it('forventer jeg å få informasjon i grunnlaget tilpasset valgt svar på AFP steg ', () => {
          cy.get('[type="radio"]').eq(2).check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
          cy.contains('button', '67 år').click()
          cy.contains('AFP: Nei').click()
          cy.contains(
            'Starter du i jobb hos en arbeidsgiver som har avtale om AFP, må du være oppmerksom på at AFP og uføretrygd ikke kan kombineres. Du må velge mellom AFP og uføretrygd før du er 62 år.'
          ).should('exist')
        })
      })

      describe('Når jeg svarer "vet ikke" på spørsmål om AFP,', () => {
        it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres, og at jeg må velge før fylte 62 år. Jeg kan gå videre til neste steg.', () => {
          cy.contains('Har du rett til AFP?').should('exist')
          cy.contains('Ja, i offentlig sektor').should('exist')
          cy.contains('Ja, i privat sektor').should('exist')
          cy.contains('Nei').should('exist')
          cy.contains('Vet ikke').should('exist')
          cy.get('[type="radio"]').eq(3).check()
          cy.contains('button', 'Neste').click()
          cy.contains('Uføretrygd og avtalefestet pensjon').should('exist')
          cy.contains(
            'Du kan ikke beregne AFP i kalkulatoren. Gå videre for å se alderspensjon fra NAV og pensjonsavtaler i privat sektor.'
          ).should('exist')
          cy.contains('button', 'Neste').click()
          cy.contains('Din sivilstand').should('exist')
        })
        it('forventer jeg å få informasjon i grunnlaget tilpasset valgt svar på AFP steg ', () => {
          cy.get('[type="radio"]').eq(3).check()
          cy.contains('button', 'Neste').click()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
          cy.contains('button', '67 år').click()
          cy.contains('AFP: Vet ikke').click()
          cy.contains(
            'Hvis du er usikker på om du har AFP bør du spørre arbeidsgiveren din.'
          ).should('exist')
        })
      })

      describe('Når jeg svarer "ja, offentlig" på spørsmål om AFP,', () => {
        it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres, og at jeg må velge før fylte 62 år. Jeg kan gå videre til neste steg.', () => {
          cy.contains('Har du rett til AFP?').should('exist')
          cy.contains('Ja, i offentlig sektor').should('exist')
          cy.contains('Ja, i privat sektor').should('exist')
          cy.contains('Nei').should('exist')
          cy.contains('Vet ikke').should('exist')
          cy.get('[type="radio"]').eq(0).check()
          cy.contains('button', 'Neste').click()
          cy.contains('Uføretrygd og avtalefestet pensjon').should('exist')
          cy.contains(
            'Du kan ikke beregne AFP i kalkulatoren. Gå videre for å se alderspensjon fra NAV og pensjonsavtaler i privat sektor.'
          ).should('exist')
          cy.contains('button', 'Neste').click()
          cy.contains('Din sivilstand').should('exist')
        })
        it('forventer jeg å få informasjon i grunnlaget tilpasset valgt svar på AFP steg', () => {
          cy.get('[type="radio"]').eq(0).check()
          cy.contains('button', 'Neste').click()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
          cy.contains('button', '67 år').click()
          cy.contains('AFP: Offentlig (ikke beregnet)').click()
          cy.contains(
            'Vi kan ikke vise din AFP fordi regelverket for ny AFP i offentlig sektor ikke er endelig avklart. For mer informasjon, sjekk din tjenestepensjonsordning.'
          ).should('exist')
        })
      })

      describe('Når jeg svarer "ja, privat" på spørsmål om AFP,', () => {
        it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres, og at jeg må velge før fylte 62 år. Jeg kan gå videre til neste steg.', () => {
          cy.contains('Har du rett til AFP?').should('exist')
          cy.contains('Ja, i offentlig sektor').should('exist')
          cy.contains('Ja, i privat sektor').should('exist')
          cy.contains('Nei').should('exist')
          cy.contains('Vet ikke').should('exist')
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Neste').click()
          cy.contains('Uføretrygd og avtalefestet pensjon').should('exist')
          cy.contains(
            'Du kan ikke beregne AFP i kalkulatoren. Gå videre for å se alderspensjon fra NAV og pensjonsavtaler i privat sektor.'
          ).should('exist')
          cy.contains('button', 'Neste').click()
          cy.contains('Din sivilstand').should('exist')
        })
        it('forventer jeg å få informasjon i grunnlaget tilpasset valgt svar på AFP steg', () => {
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Neste').click()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
          cy.contains('button', '67 år').click()
          cy.contains('AFP: Privat (ikke beregnet)').click()
          cy.contains(
            'Når du mottar uføretrygd, kan du ikke selv beregne AFP i kalkulatoren. AFP og uføretrygd kan ikke kombineres, og får du utbetalt uføretrygd etter fylte 62 år mister du retten til AFP.'
          ).should('exist')
        })
      })
    })

    describe('Som bruker som mottar 100 % uføretrygd og som ikke har rett til AFP', () => {
      describe('Når jeg er kommet til beregningssiden', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', url: '/pensjon/kalkulator/api/v1/ufoeregrad' },
            {
              ufoeregrad: 100,
            }
          ).as('getUfoeregrad')
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
          cy.wait('@getTpoMedlemskap')
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(2).check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
        })

        it('forventer jeg informasjon om hvilken grad uføretrygd jeg har.', () => {
          cy.contains('Du har 100 % uføretrygd.').should('exist')
        })

        it('forventer jeg tilpasset informasjon i read more «om pensjonsalder og uføretrygd»', () => {
          cy.contains('Om pensjonsalder og uføretrygd').click()
          cy.contains(
            '100 % uføretrygd kan ikke kombineres med alderspensjon. Det er derfor ikke mulig å beregne alderspensjon før 67 år i kalkulatoren. Ved 67 år går 100 % uføretrygd automatisk over til 100 % alderspensjon.'
          ).should('exist')
        })

        it('forventer jeg å kunne velge alder fra 67 år til 75 år.', () => {
          cy.contains('Når vil du ta ut alderspensjon?').should('exist')
          const agesInRange = [67, 68, 69, 70, 71, 72, 73, 74, 75]
          agesInRange.forEach((age) => {
            cy.contains('button', `${age} år`).should('exist')
          })
          cy.contains('button', `66 år`).should('not.exist')
          cy.contains('button', `76 år`).should('not.exist')
        })
      })
    })

    describe('Som bruker som mottar gradert uføretrygd og som ikke har rett til AFP', () => {
      describe('Når jeg er kommet til beregningssiden', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', url: '/pensjon/kalkulator/api/v1/ufoeregrad' },
            {
              ufoeregrad: 75,
            }
          ).as('getUfoeregrad')
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').first().check()
          cy.contains('button', 'Neste').click()
          cy.wait('@getTpoMedlemskap')
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(2).check()
          cy.contains('button', 'Neste').click()
          cy.get('[type="radio"]').eq(1).check()
          cy.contains('button', 'Beregn pensjon').click()
        })

        it('forventer jeg informasjon om hvilken grad uføretrygd jeg har.', () => {
          cy.contains(
            'Du har 75 % uføretrygd. Her kan du beregne 100 % alderspensjon fra 67 år.'
          ).should('exist')
        })

        it('forventer jeg tilpasset informasjon i read more «om pensjonsalder og uføretrygd»', () => {
          cy.contains('Om pensjonsalder og uføretrygd').click()
          cy.contains(
            'Det er mulig å kombinere gradert uføretrygd og gradert alderspensjon fra 62 år, så lenge du har høy nok opptjening til å ta ut alderspensjon. Graden av uføretrygd og alderspensjon kan ikke overstige 100 %.'
          ).should('exist')
        })

        it('forventer jeg å kunne velge alder fra 67 år til 75 år.', () => {
          cy.contains('Når vil du ta ut alderspensjon?').should('exist')
          const agesInRange = [67, 68, 69, 70, 71, 72, 73, 74, 75]
          agesInRange.forEach((age) => {
            cy.contains('button', `${age} år`).should('exist')
          })
          cy.contains('button', `66 år`).should('not.exist')
          cy.contains('button', `76 år`).should('not.exist')
        })
      })
    })

    describe('Som bruker som mottar 100 % uføretrygd, som ikke har rett til AFP og som ønsker en avansert beregning', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', url: '/pensjon/kalkulator/api/v1/ufoeregrad' },
          {
            ufoeregrad: 100,
          }
        ).as('getUfoeregrad')
        cy.contains('button', 'Kom i gang').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').eq(2).check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').eq(1).check()
        cy.contains('button', 'Beregn pensjon').click()
        cy.contains('button', 'Avansert').click()
      })

      describe('Når jeg er kommet til avansert beregning,', () => {
        it('forventer jeg å kunne velge pensjonsalder mellom 67 år + 0 md og 75 år og 0 md', () => {
          cy.contains('Når vil du ta ut alderspensjon?').should('exist')
          cy.contains('Velg år').should('exist')
          cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
            (selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(10)
              expect(options.eq(1).text()).equal('67 år')
              expect(options.eq(9).text()).equal('75 år')
            }
          )
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('67')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('6')
          cy.get('[data-testid="uttaksgrad"]').select('50 %')
          cy.get(
            '[data-testid="age-picker-uttaksalder-gradert-uttak-aar"]'
          ).then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(10)
            expect(options.eq(1).text()).equal('67 år')
            expect(options.eq(9).text()).equal('75 år')
          })
          cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
            (selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(10)
              expect(options.eq(1).text()).equal('67 år')
              expect(options.eq(9).text()).equal('75 år')
            }
          )
        })

        it('forventer jeg å få tilpasset informasjon i read more «Om pensjonsalder og uføretrygd»', () => {
          cy.contains('Om pensjonsalder og uføretrygd').click()
          cy.contains(
            '100 % uføretrygd kan ikke kombineres med alderspensjon. Det er derfor ikke mulig å beregne alderspensjon før 67 år i kalkulatoren. Ved 67 år går 100 % uføretrygd automatisk over til 100 % alderspensjon.'
          ).should('exist')
        })
      })
    })

    describe('Som bruker som mottar gradert uføretrygd, som ikke har rett til AFP og som ønsker en avansert beregning', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', url: '/pensjon/kalkulator/api/v1/ufoeregrad' },
          {
            ufoeregrad: 40,
          }
        ).as('getUfoeregrad')
        cy.contains('button', 'Kom i gang').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').eq(2).check()
        cy.contains('button', 'Neste').click()
        cy.get('[type="radio"]').eq(1).check()
        cy.contains('button', 'Beregn pensjon').click()
        cy.contains('button', 'Avansert').click()
      })

      describe('Når jeg er kommet til avansert beregning,', () => {
        it('forventer jeg å kunne velge pensjonsalder mellom 62 år + 0 md og 75 år og 0 md, og jeg kan velge pensjonsalder mellom 67 år + 0 md og 75 år og 0 md for når jeg ønsker øke til hel alderspensjon', () => {
          cy.contains('Når vil du ta ut alderspensjon?').should('exist')
          cy.contains('Velg år').should('exist')
          cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
            (selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(15)
              expect(options.eq(1).text()).equal('62 år')
              expect(options.eq(14).text()).equal('75 år')
            }
          )
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('63')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('6')
          cy.get('[data-testid="uttaksgrad"]').select('50 %')
          cy.get(
            '[data-testid="age-picker-uttaksalder-gradert-uttak-aar"]'
          ).then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(15)
            expect(options.eq(1).text()).equal('62 år')
            expect(options.eq(14).text()).equal('75 år')
          })
          cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
            (selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(10)
              expect(options.eq(1).text()).equal('67 år')
              expect(options.eq(9).text()).equal('75 år')
            }
          )
        })

        it('forventer jeg å få tilpasset informasjon i read more «Om pensjonsalder og uføretrygd»', () => {
          cy.contains('Om pensjonsalder og uføretrygd').click()
          cy.contains(
            'Din opptjening i folketrygden bestemmer når du kan ta ut alderspensjon. Ved 67 år må pensjonen minst tilsvare garantipensjon. Uttak før 67 år betyr at du fordeler pensjonen din over flere år, og dermed får du mindre hvert år.'
          ).should('exist')
        })
      })

      describe('Når jeg har valgt pensjonsalder mellom 62 år og 0 md og 66 år og 11 md.', () => {
        beforeEach(() => {
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('63')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('6')
        })
        it('forventer jeg at mulige uttaksgrader begrenses til uttaksgradene som er mulig å kombinere med uføretrygd.', () => {
          cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(5)
            expect(options.eq(1).text()).equal('20 %')
            expect(options.eq(4).text()).equal('60 %')
          })
        })
        it('forventer jeg å få tilpasset informasjon i read more "om uttaksgrad og uføretrygd"', () => {
          cy.contains('button', 'Om uttaksgrad og uføretrygd').click()
          cy.contains(
            'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Grad av uføretrygd og alderspensjon kan ikke overstige 100 %. Fra 67 år kan du fritt velge gradert uttak (20, 40, 50, 60 eller 80 %), eller hel alderspensjon (100 %).'
          ).should('exist')
        })
        it('forventer jeg tilpasset informasjon om inntekt samtidig som uttak av pensjon.', () => {
          cy.get('[data-testid="uttaksgrad"]').select('50 %')
          cy.contains(
            'Forventer du å ha inntekt samtidig som du tar ut 50 % pensjon?'
          ).should('exist')
          cy.contains(
            'Alderspensjonen påvirker ikke inntektsgrensen for uføretrygden din.'
          ).should('exist')
          cy.contains('button', 'Om inntekt og uføretrygd').click()
          cy.contains(
            'Alderspensjon er ikke pensjonsgivende inntekt og påvirker ikke inntektsgrensen for uføretrygden din. Du beholder inntektsgrensen din ved kombinasjon av uføretrygd og alderspensjon fra folketrygden.'
          ).should('exist')
        })
      })

      describe('Når jeg har valgt pensjonsalder etter 67 år og 0 md', () => {
        beforeEach(() => {
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('69')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('3')
        })
        it('forventer jeg å kunne velge alle uttaksgrader.', () => {
          cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(7)
            expect(options.eq(1).text()).equal('20 %')
            expect(options.eq(6).text()).equal('100 %')
          })
        })
        it('forventer jeg å få tilpasset informasjon i read more "om uttaksgrad og uføretrygd"', () => {
          cy.contains('button', 'Om uttaksgrad og uføretrygd').click()
          cy.contains(
            'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Grad av uføretrygd og alderspensjon kan ikke overstige 100 %. Fra 67 år kan du fritt velge gradert uttak (20, 40, 50, 60 eller 80 %), eller hel alderspensjon (100 %).'
          ).should('exist')
        })

        it('forventer jeg vanlig informasjon om inntekt samtidig som uttak av pensjon.', () => {
          cy.get('[data-testid="uttaksgrad"]').select('50 %')
          cy.contains(
            'Forventer du å ha inntekt samtidig som du tar ut 50 % pensjon?'
          ).should('exist')
          cy.contains(
            'Du kan tjene så mye du vil, samtidig som du tar ut pensjon.'
          ).should('exist')
        })
      })
    })
  })
})

export {}

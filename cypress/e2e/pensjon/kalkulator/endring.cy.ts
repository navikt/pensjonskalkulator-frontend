describe('Endring av alderspensjon', () => {
  describe('Som bruker som har logget inn på kalkulatoren,', () => {
    describe('Som bruker som har gjeldende vedtak på alderspensjon,', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/pensjon/kalkulator/api/v2/vedtak/loepende-vedtak',
          },
          { fixture: 'loepende-vedtak-endring.json' }
        ).as('getLoependeVedtak')
        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v7/alderspensjon/simulering',
          },
          { fixture: 'alderspensjon_endring.json' }
        ).as('fetchAlderspensjon')
        cy.clock(new Date(2028, 7, 1, 12, 0, 0), ['Date'])
        cy.login()
      })

      it('forventer jeg informasjon på startsiden om at jeg har alderspensjon og hvilken uttaksgrad.', () => {
        cy.contains('Hei Aprikos!')
        cy.contains('Du har nå 100 % alderspensjon.')
      })

      it('forventer jeg å kunne gå videre ved å trykke kom i gang ', () => {
        cy.contains('button', 'Kom i gang').click()
      })

      describe('Som bruker som har fremtidig vedtak om endring av alderspensjon,', () => {
        beforeEach(() => {
          cy.intercept(
            {
              method: 'GET',
              url: '/pensjon/kalkulator/api/v2/vedtak/loepende-vedtak',
            },
            {
              alderspensjon: {
                grad: 100,
                fom: '2010-10-10',
              },
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: true,
            }
          ).as('getLoependeVedtak')
          cy.login()
        })

        it('forventer jeg informasjon om at jeg har endret alderspensjon, men ikke startet nytt uttak enda.', () => {
          cy.contains(
            'Du har endret alderspensjon din, men ikke startet nytt uttak enda. Du kan beregne ny endring her frem til uttak.'
          )
        })
      })

      describe('Når jeg har trykt kom i gang,', () => {
        beforeEach(() => {
          cy.contains('button', 'Kom i gang').click()
        })
        it('forventer jeg at neste steg er AFP.', () => {
          cy.contains('AFP (avtalefestet pensjon)')
        })
      })

      describe('Som bruker som har svart på spørsmål om AFP,', () => {
        beforeEach(() => {
          cy.contains('button', 'Kom i gang').click()
          cy.get('[type="radio"]').last().check()
          cy.contains('button', 'Neste').click()
        })

        describe('Når jeg er kommet til beregningssiden i redigeringsmodus,', () => {
          it('forventer jeg informasjon om når jeg startet eller sist endret alderspensjon, og hvilken grad jeg har.', () => {
            cy.contains('Beregn endring av alderspensjon')
            cy.contains('Fra 10.10.2010 har du mottatt 100 % alderspensjon.')
          })

          it('forventer jeg å kunne endre inntekt frem til endring.', () => {
            cy.contains('Pensjonsgivende inntekt frem til endring')
            cy.contains('button', 'Endre inntekt').click()
            cy.get('[data-testid="inntekt-textfield"]').clear().type('550000')
            cy.contains('button', 'Oppdater inntekt').click()
            cy.contains('550 000 kr per år før skatt')
          })

          it('forventer jeg å kunne velge pensjonsalder for endring mellom dagens alder + 1 md og 75 år + 0 md.', () => {
            // datoen som er mocked er 01. August 2028. Brukeren som er født 1963-04-30 er 65 år gammel og 3 md.
            cy.contains('Når vil du endre alderspensjonen din?').should('exist')
            cy.contains('Velg år').should('exist')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).then((selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(12)
              expect(options.eq(1).text()).equal('65 år')
              expect(options.eq(11).text()).equal('75 år')
            })
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('65')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).then((selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(9)
              expect(options.eq(1).text()).equal('4 md. (sep.)')
              expect(options.eq(8).text()).equal('11 md. (apr.)')
            })
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('75')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).then((selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(2)
              expect(options.eq(1).text()).equal('0 md. (mai)')
            })
          })

          it('forventer jeg å kunne velge mellom 0, 20, 40, 50, 60, 80 og 100% uttaksgrad.', () => {
            cy.contains('Hvor mye alderspensjon vil du ta ut?').should('exist')
            cy.contains('Velg ny uttaksgrad').should('exist')
            cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(8)
              expect(options.eq(1).text()).equal('0 %')
              expect(options.eq(2).text()).equal('20 %')
              expect(options.eq(3).text()).equal('40 %')
              expect(options.eq(4).text()).equal('50 %')
              expect(options.eq(5).text()).equal('60 %')
              expect(options.eq(6).text()).equal('80 %')
              expect(options.eq(7).text()).equal('100 %')
            })
          })

          it('forventer jeg å kunne oppgi inntekt ved siden av 100% alderspensjon og beregne ny pensjon.', () => {
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('65')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).select('4')
            cy.get('[data-testid="uttaksgrad"]').select('100 %')
            cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
            cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')
            cy.contains(
              'Til hvilken alder forventer du å ha inntekten?'
            ).should('exist')
            cy.contains('Velg år').should('exist')
            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
            ).then((selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(12)
              expect(options.eq(1).text()).equal('65 år')
              expect(options.eq(11).text()).equal('75 år')
            })
            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
            ).select('70')

            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
            ).select('75')
            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
            ).select('3')

            cy.contains('Beregn ny pensjon').click()

            cy.contains('Beregning').should('exist')
            cy.contains('Valgene dine').click({ force: true })
            cy.contains('65 år og 4 md. (01.09.2028)').should('exist')
            cy.contains('Alderspensjon: 100 %').should('exist')
            cy.contains(
              'Pensjonsgivende årsinntekt t.o.m. 75 år og 3 md.: 100 000 kr før skatt'
            ).should('exist')
          })
        })

        describe('Når jeg velger å endre til en annen uttaksgrad enn 100%,', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('65')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).select('4')
            cy.get('[data-testid="uttaksgrad"]').select('40 %')
          })

          it('forventer jeg å kunne oppgi inntekt ved siden av gradert alderspensjon og 100 % alderspensjon og beregne pensjon.', () => {
            cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
            cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('67')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).select('0')
            cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
            cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')

            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
            ).select('75')
            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
            ).select('0')

            cy.contains('Beregn ny pensjon').click()
            cy.contains('Beregning').should('exist')
          })
        })

        describe('Som bruker som har valgt endringer,', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('65')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).select('4')
            cy.get('[data-testid="uttaksgrad"]').select('40 %')
            cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
            cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
            ).select('67')
            cy.get(
              '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
            ).select('0')
            cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
            cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')

            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
            ).select('75')
            cy.get(
              '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
            ).select('0')
          })

          describe('Når jeg er kommet til beregningssiden i resultatmodus,', () => {
            beforeEach(() => {
              cy.contains('Beregn ny pensjon').click()
              cy.contains('Beregning').should('exist')
            })

            it('forventer jeg informasjon om hvilken uttaksgrad på alderspensjon jeg har i dag.', () => {
              cy.contains('Du har i dag 100 % alderspensjon.')
            })

            it('forventer jeg informasjon om hva siste månedlige utbetaling var og hva månedlig alderspensjon vil bli de månedene jeg har valgt å endre fra.', () => {
              cy.contains('Alderspensjon før skatt når du er')
              cy.contains('65 år og 4 md. (40 %): 12 342 kr/md.')
              cy.contains('67 år (100 %): 28 513 kr/md.')
            })

            it('forventer jeg en knapp for å endre mine valg.', () => {
              cy.contains('Endre valgene dine')
            })

            it('forventer jeg å se resultatet for alderspensjon i graf og tabell.', () => {
              cy.contains('Beregning').should('exist')
              cy.contains('Pensjonsgivende inntekt').should('exist')
              cy.contains('AFP (avtalefestet pensjon)').should('not.exist')
              cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should(
                'not.exist'
              )
              cy.contains('Alderspensjon (Nav)').should('exist')
              cy.contains('Tusen kroner').should('exist')
              cy.contains('65').should('exist')
              cy.contains('77+').should('exist')
            })

            it('forventer jeg ett resultatkort hvor jeg ser mine valg og kan endre mine valg.', () => {
              cy.contains('Beregning').should('exist')
              cy.contains('Valgene dine').click({ force: true })
              cy.contains('65 år og 4 md. (01.09.2028)').should('exist')
              cy.contains('Alderspensjon: 40 %').should('exist')
              cy.contains(
                'Pensjonsgivende årsinntekt: 300 000 kr før skatt'
              ).should('exist')
              cy.contains('67 år (01.05.2030)').should('exist')
              cy.contains('Alderspensjon: 100 %').should('exist')
              cy.contains(
                'Pensjonsgivende årsinntekt til 75 år: 100 000 kr før skatt'
              ).should('exist')
            })

            it('forventer jeg informasjon om at pensjonsavtaler ikke er med i beregningen.', () => {
              cy.contains(
                'Pensjonsavtaler fra arbeidsgivere og egen sparing er ikke med i beregningen.'
              ).should('exist')
            })

            it('forventer jeg tilpasset informasjon i grunnlag: at opphold utenfor Norge er hentet fra vedtak og at AFP vises ut fra hva jeg har svart. ', () => {
              cy.contains('Beregning').should('exist')
              cy.contains('Øvrig grunnlag for beregningen').should('exist')
              cy.contains('Sivilstand:').click({ force: true })
              cy.contains('Opphold utenfor Norge:').click({ force: true })
              cy.contains('Fra vedtak').should('exist')
              cy.contains(
                'Beregningen bruker trygdetiden du har i Norge fra vedtaket ditt om alderspensjon.'
              ).should('exist')
              cy.contains('AFP:').click({ force: true })
              cy.contains('Vet ikke').should('exist')
            })

            it('forventer jeg lenke til søknad om endring av alderspensjon.', () => {
              cy.contains('Klar til å søke om endring?').should('exist')
              cy.contains('a', 'Din pensjon')
                .should('have.attr', 'href')
                .and('include', '/pensjon/opptjening/nb/')
            })
          })
        })
      })
    })

    describe('Som bruker som har gjeldende vedtak på alderspensjon og AFP privat', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/pensjon/kalkulator/api/v2/vedtak/loepende-vedtak',
          },
          {
            alderspensjon: {
              grad: 80,
              fom: '2010-10-10',
            },
            afpPrivat: { fom: '2010-10-10' },
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          }
        ).as('getLoependeVedtak')
        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v7/alderspensjon/simulering',
          },
          { fixture: 'alderspensjon_endring.json' }
        ).as('fetchAlderspensjon')
        cy.clock(new Date(2028, 7, 1, 12, 0, 0), ['Date'])
        cy.login()
      })

      it('forventer jeg informasjon på startsiden om at jeg har alderspensjon og AFP privat og hvilken uttaksgrad.', () => {
        cy.contains('Hei Aprikos!')
        cy.contains('Du har nå 80 % alderspensjon og AFP i privat sektor')
      })

      it('forventer jeg å kunne gå videre ved å trykke kom i gang ', () => {
        cy.contains('button', 'Kom i gang').click()
      })

      describe('Som bruker som har fremtidig vedtak om endring av alderspensjon,', () => {
        beforeEach(() => {
          cy.intercept(
            {
              method: 'GET',
              url: '/pensjon/kalkulator/api/v2/vedtak/loepende-vedtak',
            },
            {
              alderspensjon: {
                grad: 80,
                fom: '2010-10-10',
              },
              afpPrivat: { fom: '2010-10-10' },
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: true,
            }
          ).as('getLoependeVedtak')
          cy.login()
        })

        it('forventer jeg informasjon om at jeg har endret alderspensjon, men ikke startet nytt uttak enda.', () => {
          cy.contains(
            'Du har endret alderspensjon din, men ikke startet nytt uttak enda. Du kan beregne ny endring her frem til uttak.'
          )
        })
      })

      describe('Når jeg har trykt kom i gang og er kommet til beregningssiden i redigeringsmodus,', () => {
        beforeEach(() => {
          cy.contains('button', 'Kom i gang').click()
        })

        it('forventer jeg informasjon om når jeg startet eller sist endret alderspensjon, og hvilken grad jeg har.', () => {
          cy.contains('Beregn endring av alderspensjon')
          cy.contains('Fra 10.10.2010 har du mottatt 80 % alderspensjon.')
        })

        it('forventer jeg å kunne endre inntekt frem til endring.', () => {
          cy.contains('Pensjonsgivende inntekt frem til endring')
          cy.contains('button', 'Endre inntekt').click()
          cy.get('[data-testid="inntekt-textfield"]').clear().type('550000')
          cy.contains('button', 'Oppdater inntekt').click()
          cy.contains('550 000 kr per år før skatt')
        })

        it('forventer jeg å kunne velge pensjonsalder for endring mellom dagens alder + 1 md og 75 år + 0 md.', () => {
          // datoen som er mocked er 01. August 2028. Brukeren som er født 1963-04-30 er 65 år gammel og 3 md.
          cy.contains('Når vil du endre alderspensjonen din?').should('exist')
          cy.contains('Velg år').should('exist')
          cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
            (selectElements) => {
              const options = selectElements.find('option')
              expect(options.length).equal(12)
              expect(options.eq(1).text()).equal('65 år')
              expect(options.eq(11).text()).equal('75 år')
            }
          )
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('65')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(9)
            expect(options.eq(1).text()).equal('4 md. (sep.)')
            expect(options.eq(8).text()).equal('11 md. (apr.)')
          })
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('75')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(2)
            expect(options.eq(1).text()).equal('0 md. (mai)')
          })
        })

        it('forventer jeg å kunne velge mellom 0, 20, 40, 50, 60, 80 og 100% uttaksgrad.', () => {
          cy.contains('Hvor mye alderspensjon vil du ta ut?').should('exist')
          cy.contains('Velg ny uttaksgrad').should('exist')
          cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(8)
            expect(options.eq(1).text()).equal('0 %')
            expect(options.eq(2).text()).equal('20 %')
            expect(options.eq(3).text()).equal('40 %')
            expect(options.eq(4).text()).equal('50 %')
            expect(options.eq(5).text()).equal('60 %')
            expect(options.eq(6).text()).equal('80 %')
            expect(options.eq(7).text()).equal('100 %')
          })
        })

        it('forventer jeg å kunne oppgi inntekt ved siden av 100% alderspensjon og beregne ny pensjon.', () => {
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('65')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('4')
          cy.get('[data-testid="uttaksgrad"]').select('100 %')
          cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
          cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')
          cy.contains('Til hvilken alder forventer du å ha inntekten?').should(
            'exist'
          )
          cy.contains('Velg år').should('exist')
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
          ).then((selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(12)
            expect(options.eq(1).text()).equal('65 år')
            expect(options.eq(11).text()).equal('75 år')
          })
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
          ).select('70')

          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
          ).select('75')
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
          ).select('3')

          cy.contains('Beregn ny pensjon').click()

          cy.contains('Beregning').should('exist')
          cy.contains('Valgene dine').click({ force: true })
          cy.contains('65 år og 4 md. (01.09.2028)').should('exist')
          cy.contains('Alderspensjon: 100 %').should('exist')
          cy.contains(
            'Pensjonsgivende årsinntekt t.o.m. 75 år og 3 md.: 100 000 kr før skatt'
          ).should('exist')
        })
      })

      describe('Når jeg velger å endre til en annen uttaksgrad enn 100%,', () => {
        beforeEach(() => {
          cy.contains('button', 'Kom i gang').click()
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('65')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('4')
          cy.get('[data-testid="uttaksgrad"]').select('40 %')
        })

        it('forventer jeg å kunne oppgi inntekt ved siden av gradert alderspensjon og 100 % alderspensjon og beregne pensjon.', () => {
          cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
          cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('67')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('0')
          cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
          cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')

          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
          ).select('75')
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
          ).select('0')

          cy.contains('Beregn ny pensjon').click()
          cy.contains('Beregning').should('exist')
        })
      })

      describe('Som bruker som har valgt endringer,', () => {
        beforeEach(() => {
          cy.contains('button', 'Kom i gang').click()
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('65')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('4')
          cy.get('[data-testid="uttaksgrad"]').select('40 %')
          cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
          cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('67')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('0')
          cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
          cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')

          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
          ).select('75')
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
          ).select('0')
        })

        describe('Når jeg er kommet til beregningssiden i resultatmodus,', () => {
          beforeEach(() => {
            cy.contains('Beregn ny pensjon').click()
            cy.contains('Beregning').should('exist')
          })

          it('forventer jeg informasjon om hvilken uttaksgrad på alderspensjon jeg har i dag.', () => {
            cy.contains('Du har i dag 80 % alderspensjon.')
          })

          it('forventer jeg informasjon om hva siste månedlige utbetaling var og hva månedlig alderspensjon vil bli de månedene jeg har valgt å endre fra.', () => {
            cy.contains('Alderspensjon før skatt når du er')
            cy.contains('65 år og 4 md. (40 %): 12 342 kr/md.')
            cy.contains('67 år (100 %): 28 513 kr/md.')
          })

          it('forventer jeg en knapp for å endre mine valg.', () => {
            cy.contains('Endre valgene dine')
          })

          it('forventer jeg å se resultatet for alderspensjon i graf og tabell med min AFP Privat.', () => {
            cy.contains('Beregning').should('exist')
            cy.contains('Pensjonsgivende inntekt').should('exist')
            cy.contains('AFP (avtalefestet pensjon)').should('exist')
            cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should(
              'not.exist'
            )
            cy.contains('Alderspensjon (Nav)').should('exist')
            cy.contains('Tusen kroner').should('exist')
            cy.contains('65').should('exist')
            cy.contains('77+').should('exist')
          })

          it('forventer jeg ett resultatkort hvor jeg ser mine valg og kan endre mine valg.', () => {
            cy.contains('Beregning').should('exist')
            cy.contains('Valgene dine').click({ force: true })
            cy.contains('65 år og 4 md. (01.09.2028)').should('exist')
            cy.contains('Alderspensjon: 40 %').should('exist')
            cy.contains(
              'Pensjonsgivende årsinntekt: 300 000 kr før skatt'
            ).should('exist')
            cy.contains('67 år (01.05.2030)').should('exist')
            cy.contains('Alderspensjon: 100 %').should('exist')
            cy.contains(
              'Pensjonsgivende årsinntekt til 75 år: 100 000 kr før skatt'
            ).should('exist')
          })

          it('forventer jeg informasjon om at pensjonsavtaler ikke er med i beregningen.', () => {
            cy.contains(
              'Pensjonsavtaler fra arbeidsgivere og egen sparing er ikke med i beregningen.'
            ).should('exist')
          })

          it('forventer jeg tilpasset informasjon i grunnlag: at opphold utenfor Norge er hentet fra vedtak og at AFP Privat er uendret ', () => {
            cy.contains('Beregning').should('exist')
            cy.contains('Øvrig grunnlag for beregningen').should('exist')
            cy.contains('Sivilstand:').click({ force: true })
            cy.contains('Opphold utenfor Norge:').click({ force: true })
            cy.contains('Fra vedtak').should('exist')
            cy.contains(
              'Beregningen bruker trygdetiden du har i Norge fra vedtaket ditt om alderspensjon.'
            ).should('exist')
            cy.contains('AFP:').click({ force: true })
            cy.contains('Privat (Uendret)').should('exist')
          })

          it('forventer jeg lenke til søknad om endring av alderspensjon.', () => {
            cy.contains('Klar til å søke om endring?').should('exist')
            cy.contains('a', 'Din pensjon')
              .should('have.attr', 'href')
              .and('include', '/pensjon/opptjening/nb/')
          })
        })
      })
    })
  })
})

export {}

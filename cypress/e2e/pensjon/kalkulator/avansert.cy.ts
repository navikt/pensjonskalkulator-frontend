describe('Avansert', () => {
  describe.skip('Gitt at jeg som bruker har gjort en enkel beregning,', () => {
    describe('Når jeg ønsker en avansert beregning', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
      })

      it('forventer jeg å kunne velge «Avansert fane» for å få flere valgmuligheter', () => {
        cy.contains('Avansert').click()
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
      })

      it('forventer også å kunne gå til Avansert fra «Uttaksgrad» og «Inntekt frem til uttak» i Grunnlaget', () => {
        cy.contains('button', '70').click()
        cy.contains('Uttaksgrad:').click({ force: true })
        cy.contains('Gå til avansert kalkulator').click({ force: true })
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
        cy.contains('Enkel').click()
        cy.contains('button', '70').click()
        cy.contains('Inntekt frem til uttak:').click({ force: true })
        cy.contains('Gå til avansert kalkulator').click({ force: true })
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
      })

      it('ønsker jeg å kunne starte ny beregning', () => {
        cy.contains('Avansert').click()
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
        cy.contains('button', 'Tilbake til start').click({ force: true })
        cy.location('href').should('include', '/pensjon/kalkulator/start')
      })
    })
  })

  describe.skip('Gitt at jeg som bruker har valgt "Avansert",', () => {
    describe('Når jeg er kommet inn i avansert', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Avansert').click()
      })

      it('forventer jeg å se, og kunne endre inntekt frem til pensjon.', () => {
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
        cy.contains('521 338 kr per år før skatt').should('exist')
        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').type('0')
        cy.contains('button', 'Oppdater inntekt').click()
        cy.contains('0 kr per år før skatt').should('exist')
      })

      it('forventer jeg å kunne velge pensjonsalder mellom 62 år + 0 md og 75 år og 0 md.', () => {
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
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(13)
          expect(options.eq(1).text()).equal('0 md. (mai)')
          expect(options.eq(12).text()).equal('11 md. (apr.)')
        })
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '75'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(2)
          expect(options.eq(1).text()).equal('0 md. (mai)')
        })
      })

      it('forventer jeg å kunne velge mellom  20, 40, 50, 60, 80 og 100% uttaksgrad.', () => {
        cy.contains('Hvor mye alderspensjon vil du ta ut?').should('exist')
        cy.contains('Velg uttaksgrad').should('exist')
        cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(7)
          expect(options.eq(1).text()).equal('20 %')
          expect(options.eq(2).text()).equal('40 %')
          expect(options.eq(3).text()).equal('50 %')
          expect(options.eq(4).text()).equal('60 %')
          expect(options.eq(5).text()).equal('80 %')
          expect(options.eq(6).text()).equal('100 %')
        })
      })

      it('forventer jeg å kunne nullstille mine valg', () => {
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('3')
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
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

        cy.contains('Nullstill valg').click()

        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').should(
          'have.value',
          null
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).should('have.value', null)
        cy.get('[data-testid="uttaksgrad"]').should('have.value', null)
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').should(
          'not.exist'
        )
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').should(
          'not.exist'
        )
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').should('not.exist')
        cy.get(
          '[data-testid="age-picker-uttaksalder-gradert-uttak-aar"]'
        ).should('not.exist')
        cy.get(
          '[data-testid="age-picker-uttaksalder-gradert-uttak-maaneder"]'
        ).should('not.exist')

        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').should(
          'not.exist'
        )
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').should(
          'not.exist'
        )
        cy.get('[data-testid="inntekt-vsa-helt-uttak"]').should('not.exist')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
        ).should('not.exist')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
        ).should('not.exist')
      })
    })

    describe('Når jeg har valgt ut pensjonsalder og ønsker 100 % alderspensjon', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Avansert').click()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('3')
        cy.get('[data-testid="uttaksgrad"]').select('100 %')
      })

      it('forventer jeg å kunne oppgi inntekt mens jeg tar ut 100% pensjon. Jeg forventer å kunne legge inn til hvilken alder jeg vil ha inntekt, men ikke lenger enn 75 år + 11 md.', () => {
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
        ).select('65')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(9)
          expect(options.eq(1).text()).equal('4 md. (sep.)')
          expect(options.eq(8).text()).equal('11 md. (apr.)')
        })
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
        ).select('75')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(13)
          expect(options.eq(1).text()).equal('0 md. (mai)')
          expect(options.eq(12).text()).equal('11 md. (apr.)')
          cy.get(
            '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
          ).select('3')

          cy.contains('Beregn pensjon').click()
          cy.contains('Beregning').should('exist')
          cy.contains('Se og endre dine valg').click({ force: true })
          cy.contains('65 år og 3 md. (01.08.2028)').should('exist')
          cy.contains('Alderspensjon: 100 %').should('exist')
          cy.contains(
            'Pensjonsgivende årsinntekt t.o.m. 75 år og 3 md.: 100 000 kr før skatt'
          ).should('exist')
        })
      })

      it('forventer jeg å kunne svare nei på spørsmål om inntekt vsa. 100 % alderspensjon og beregne pensjon', () => {
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
        cy.contains('Beregn pensjon').click()
        cy.contains('Beregning').should('exist')
        cy.contains('Se og endre dine valg').click({ force: true })
        cy.contains('65 år og 3 md. (01.08.2028)').should('exist')
        cy.contains('Alderspensjon: 100 %').should('exist')
      })
    })

    describe('Når jeg har valgt ut pensjonsalder og ønsker en annen uttaksgrad enn 100% alderspensjon', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Avansert').click()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('3')
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
      })

      it('forventer jeg å kunne oppgi alder for når jeg ønsker å øke til 100% alderspensjon. Jeg forventer å kunne velge pensjonsalder mellom alder for gradert uttak + 1md og 75 år og 0 md.', () => {
        cy.contains('Når vil du ta ut 100 % alderspensjon?').should('exist')
        cy.contains('Velg år').should('exist')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
          (selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(15)
            expect(options.eq(1).text()).equal('62 år')
            expect(options.eq(14).text()).equal('75 år')
          }
        )
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(13)
          expect(options.eq(1).text()).equal('0 md. (mai)')
          expect(options.eq(12).text()).equal('11 md. (apr.)')
        })
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '75'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(2)
          expect(options.eq(1).text()).equal('0 md. (mai)')
        })
      })

      it('forventer jeg å kunne oppgi inntekt mens jeg tar ut gradert alderspensjon og 100 % alderspensjon og beregne pensjon', () => {
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
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

        cy.contains('Beregn pensjon').click()
        cy.contains('Beregning').should('exist')
      })

      it('forventer jeg å kunne svare nei på spørsmål om inntekt vsa. gradert alderspensjon og beregne pensjon', () => {
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
        cy.contains('Beregn pensjon').click()
        cy.contains('Beregning').should('exist')
      })
    })

    describe('Når jeg har for lav opptjening til valgt pensjonsalder og/eller uttaksgrad,', () => {
      beforeEach(() => {
        cy.login()

        cy.fillOutStegvisning({ samtykke: false })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Avansert').click()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('1')
        cy.get('[data-testid="uttaksgrad"]').select('100 %')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()

        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v3/alderspensjon/simulering',
          },
          {
            alderspensjon: [],
            afpPrivat: [],
            vilkaarsproeving: {
              vilkaarErOppfylt: false,
              alternativ: {
                heltUttaksalder: { aar: 65, maaneder: 3 },
              },
            },
          }
        ).as('fetchAlderspensjon')

        cy.contains('Beregn pensjon').click()
      })

      it('forventer jeg informasjon om at jeg ikke har høy nok opptjening, og at jeg må øke alderen eller sette ned uttaksgraden', () => {
        cy.contains('Beregning').should('not.exist')
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
        cy.contains(
          'Opptjeningen din er ikke høy nok til ønsket uttak. Du må øke alderen eller sette ned uttaksgraden.'
        ).should('exist')
        cy.contains(
          'Du kan ved 65 år og 3 måneder ta ut 100 % alderspensjon. Du kan også prøve andre kombinasjoner.'
        ).should('exist')
      })

      it('forventer jeg å kunne endre på inntekt, pensjonsalder og uttaksgrad, og å kunne beregne pensjon', () => {
        cy.contains('Beregning').should('not.exist')
        cy.contains('Pensjonsgivende inntekt frem til pensjon').should('exist')
        cy.contains('button', 'Endre inntekt').should('exist')
        cy.contains('Når vil du ta ut alderspensjon?').should('exist')

        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('3')
        cy.contains('Hvor mye alderspensjon vil du ta ut?').should('exist')
        cy.get('[data-testid="uttaksgrad"]').should('exist')
        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v3/alderspensjon/simulering',
          },
          { fixture: 'alderspensjon.json' }
        ).as('fetchAlderspensjon')
        cy.contains('Beregn pensjon').click()
        cy.contains('Beregning').should('exist')
      })

      it('ønsker jeg å kunne starte ny beregning', () => {
        cy.contains('Beregning').should('not.exist')
        cy.contains('button', 'Tilbake til start').click({ force: true })
        cy.location('href').should('include', '/pensjon/kalkulator/start')
      })
    })
  })

  describe('Gitt at jeg som bruker har valgt "Avansert", fylt ut skjemaet og klikket på "Beregn Pensjon"', () => {
    describe('Når jeg er kommet til beregningssiden', () => {
      beforeEach(() => {
        cy.login()
        cy.fillOutStegvisning({ afp: 'ja_privat', samtykke: true })
        cy.wait('@fetchTidligsteUttaksalder')
        cy.contains('Avansert').click()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('3')
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('300000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
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
        cy.contains('Beregn pensjon').click()
      })

      it('forventer jeg samme visninger av graf og tabell som i enkel', () => {
        cy.contains('Beregning').should('exist')
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('AFP (Avtalefestet pensjon)').should('exist')
        cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should('exist')
        cy.contains('Alderspensjon (NAV)').should('exist')
        cy.contains('Tusen kroner').should('exist')
        cy.contains('61').should('exist')
        cy.contains('87+').should('exist')

        cy.contains('Pensjonsavtaler').should('exist')
        cy.get('[data-testid="showmore-button"]').click()
        cy.contains('Andre avtaler').should('exist')
        cy.contains('Privat tjenestepensjon').should('exist')
        cy.contains('Offentlig tjenestepensjon').should('exist')
        cy.contains('Individuelle ordninger').should('exist')
        cy.contains('Vis mindre').should('exist')
      })

      it('forventer jeg å få informasjon om øvrig grunnlag for beregningen uten "Uttaksgrad" og "Inntekt"', () => {
        cy.contains('Beregning').should('exist')
        cy.contains('Øvrig grunnlag for beregningen').should('exist')
        cy.contains('Uttaksgrad:').should('not.exist')
        cy.contains('Inntekt frem til uttak:').should('not.exist')
        cy.contains('Sivilstand:').click({ force: true })
        cy.contains('Opphold i Norge:').click({ force: true })
        cy.contains('AFP:').click({ force: true })
      })

      it('forventer jeg ett resultatkort hvor jeg ser mine valg og kan endre mine valg', () => {
        cy.contains('Beregning').should('exist')
        cy.contains('Se og endre dine valg').click({ force: true })
        cy.contains('62 år og 3 md. (01.08.2025)').should('exist')
        cy.contains('Alderspensjon: 40 %').should('exist')
        cy.contains('Pensjonsgivende årsinntekt: 300 000 kr før skatt').should(
          'exist'
        )
        cy.contains('67 år (01.05.2030)').should('exist')
        cy.contains('Alderspensjon: 100 %').should('exist')
        cy.contains(
          'Pensjonsgivende årsinntekt til 75 år: 100 000 kr før skatt'
        ).should('exist')
      })
    })
  })
})

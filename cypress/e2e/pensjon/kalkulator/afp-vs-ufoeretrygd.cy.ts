import { format, sub } from 'date-fns'

import loependeVedtakMock from '../../../fixtures/loepende-vedtak.json'
import personMock from '../../../fixtures/person.json'

const fødselsdatoYngreEnn62 = format(
  sub(new Date(), { years: 61, months: 1, days: 5 }),
  'yyyy-MM-dd'
)

describe('AFP vs uføretrygd', () => {
  describe('Som bruker som har logget inn i kalkulatoren, har gradert uføretrygd og er mindre enn 62 år', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', url: '/pensjon/kalkulator/api/v4/person' },
        {
          ...personMock,
          foedselsdato: fødselsdatoYngreEnn62,
        }
      ).as('getPerson')
      cy.intercept(
        {
          method: 'GET',
          url: '/pensjon/kalkulator/api/v4/vedtak/loepende-vedtak',
        },
        {
          ...loependeVedtakMock,
          ufoeretrygd: { grad: 40 },
        } satisfies LoependeVedtak
      ).as('getLoependeVedtak')
      cy.intercept(
        {
          method: 'GET',
          url: '/pensjon/kalkulator/api/feature/pensjonskalkulator.gradert-ufoere-afp',
        },
        {
          statusCode: 200,
          body: {
            enabled: true,
          },
        }
      ).as('getVedlikeholdsmodusFeatureToggle')
      cy.login()
    })

    describe('Når jeg svarer "Ja" på AFP offentlig', () => {
      beforeEach(() => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
      })

      it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres.', () => {
        cy.get('[type="radio"]').first().check() // AFP Offentlig
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('AFP og uføretrygd kan ikke kombineres.').should('exist')
      })

      it('forventer jeg å må samtykke til å beregne AFP.', () => {
        cy.get('[type="radio"]').first().check() // AFP Offentlig
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('button', 'Neste').click() // -> AFP Info
        cy.contains(
          'Samtykke til at Nav beregner AFP (avtalefestet pensjon)'
        ).should('exist')
      })

      it('forventer jeg å kunne gå videre til beregningssiden', () => {
        cy.get('[type="radio"]').first().check() // AFP Offentlig
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('button', 'Neste').click() // -> AFP Info
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click() // -> Samtykke
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click() // -> Pensjonsavtaler
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.contains('Hva vil du beregne?').should('exist') // Med/uten AFP
      })
    })

    describe('Når jeg svarer "Ja" på AFP privat', () => {
      beforeEach(() => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
      })

      it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres.', () => {
        cy.get('[type="radio"]').eq(1).check() // AFP Privat
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('AFP og uføretrygd kan ikke kombineres.').should('exist')
      })

      it('forventer jeg å kunne gå videre til beregningssiden.', () => {
        cy.get('[type="radio"]').eq(1).check() // AFP Privat
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('button', 'Neste').click() // -> AFP Info
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click() // -> Pensjonsavtaler
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.contains('Hva vil du beregne?').should('exist') // Med/uten AFP
      })
    })

    describe('Når jeg er kommet til beregningssiden', () => {
      describe('Som bruker som har samtykket til å beregne AFP offentlig', () => {
        beforeEach(() => {
          cy.fillOutStegvisning({
            afp: 'ja_offentlig',
            samtykke: true,
          })
        })

        it('forventer jeg informasjon om at jeg har x-prosent uføretrygd.', () => {
          cy.contains('Du har 40 % uføretrygd.').should('exist')
        })

        it('forventer jeg å kunne beregne 100% alderspensjon fra 67 år og senere.', () => {
          cy.contains(
            'Her kan du beregne 100 % alderspensjon og pensjonsavtaler fra 67 år.'
          ).should('exist')
        })

        it('forventer jeg å kunne velge "avansert".', () => {
          cy.get('[data-testid="toggle-avansert"]').should('exist')
        })
      })

      describe('Som bruker som ikke har samtykket til å beregne AFP offentlig', () => {
        beforeEach(() => {
          cy.fillOutStegvisning({
            afp: 'ja_offentlig',
            samtykkeAfpOffentlig: false,
          })
          cy.get('[data-testid="toggle-avansert"]').within(() => {
            cy.contains('Avansert').click()
          })
        })

        it('forventer jeg å ikke få mulighet til å beregne AFP.', () => {
          cy.contains('Hva vil du beregne?').should('not.exist')
        })

        it('forventer jeg informasjon i grunnlag om at "AFP ikke er beregnet grunnet ikke samtykket".', () => {
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-aar"]'
          ).select('67')
          cy.get(
            '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
          ).select('3')
          cy.get('[data-testid="uttaksgrad"]').select('100 %')
          cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()

          cy.contains('Beregn pensjon').click()

          cy.contains(
            'Du har oppgitt AFP i offentlig sektor, men du har ikke samtykket til at Nav beregner den. Derfor vises ikke AFP i beregningen.'
          ).should('exist')
        })
      })

      describe('Som bruker som har rett til AFP privat', () => {
        beforeEach(() => {
          cy.fillOutStegvisning({
            afp: 'ja_privat',
          })
        })

        it('forventer jeg informasjon om at jeg har x-prosent uføretrygd.', () => {
          cy.contains('Du har 40 % uføretrygd.').should('exist')
        })

        it('forventer jeg å kunne beregne 100% alderspensjon fra 67 år og senere.', () => {
          cy.contains(
            'Her kan du beregne 100 % alderspensjon og pensjonsavtaler fra 67 år.'
          ).should('exist')
        })

        it('forventer jeg å kunne velge "avansert".', () => {
          cy.get('[data-testid="toggle-avansert"]').should('exist')
        })
      })
    })

    describe('Når jeg ønsker en avansert beregning', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
      })

      it('forventer jeg informasjon om at jeg har uføretrygd, og må velge mellom uføretrygd og alderspensjon før 62 år.', () => {
        cy.contains(
          'Du har 40 % uføretrygd. Før du blir 62 år må du velge enten uføretrygd eller AFP.'
        ).should('exist')
      })

      it('forventer jeg å kunne velge å beregne Alderspensjon og uføretrygd, uten AFP.', () => {
        cy.get('[type="radio"]').first().check()
      })

      it('forventer jeg å kunne velge å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år.', () => {
        cy.get('[type="radio"]').eq(1).check()
      })
    })

    describe('Når jeg velger å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').eq(1).check()
      })

      it('forventer jeg at 62 år (nedre pensjonsalder) er fast laveste uttaksalder.', () => {
        cy.get('input[name="uttaksalder-helt-uttak-aar"][value="62"]').should(
          'have.value',
          '62'
        )
      })

      it('forventer jeg å kunne endre inntekt frem til pensjon.', () => {
        cy.contains('Pensjonsgivende årsinntekt frem til pensjon').should(
          'exist'
        )
        cy.contains('521 338 kr per år før skatt').should('exist')
        cy.contains('button', 'Endre inntekt').click()
        cy.get('[data-testid="inntekt-textfield"]').type('0')
        cy.contains('button', 'Oppdater inntekt').click()
        cy.contains('0 kr per år før skatt').should('exist')
      })

      it('forventer jeg å kunne velge uttaksgrad fra 20 - 100 %.', () => {
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

      it('forventer jeg å kunne velge uttaksalder for 100% fra 62 år (nedre pensjonsalder) + 1 md.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('1')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
      })

      it('forventer jeg å kunne legge til inntekt samtidig som pensjon.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('100000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('1')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-helt-uttak"]').type('100000')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-aar"]'
        ).select('75')
        cy.get(
          '[data-testid="age-picker-inntekt-vsa-helt-uttak-slutt-alder-maaneder"]'
        ).select('0')
      })

      it('forventer jeg å kunne beregne pensjon.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('100000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('1')
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
    })

    describe('Når jeg har for lav opptjening til valgt uttak', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').eq(1).check()
      })

      it('forventer jeg informasjon om at jeg ikke har høy nok opptjening, og at jeg må sette ned uttaksgraden.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('100 %')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v8/alderspensjon/simulering',
          },
          {
            alderspensjon: [],
            vilkaarsproeving: {
              vilkaarErOppfylt: false,
              alternativ: {
                heltUttaksalder: { aar: 65, maaneder: 3 },
              },
            },
          }
        ).as('fetchAlderspensjon')
        cy.contains('Beregn pensjon').click()

        cy.contains('Beregning').should('not.exist')
        cy.contains('Pensjonsgivende årsinntekt frem til pensjon').should(
          'exist'
        )
        cy.contains(
          'Opptjeningen din er ikke høy nok til ønsket uttak. Du må sette ned uttaksgraden.'
        ).should('exist')
      })
    })

    describe('Når jeg har for lav opptjening til valgt uttak', () => {
      // TODO: Sjekk om NAU er riktig for test-case.
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').eq(1).check()
      })
      // Som bruker som har valgt gradert uttak fra 62 år (nedre pensjonsalder) og 100 % tidligere enn 67 år (normert pensjonsalder)

      it('forventer jeg ett alternativt forslag om å sette ned uttaksgraden og øke alder for 100% uttak.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('80 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '65'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()

        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v8/alderspensjon/simulering',
          },
          {
            alderspensjon: [],
            vilkaarsproeving: {
              vilkaarErOppfylt: false,
              alternativ: {
                heltUttaksalder: { aar: 67, maaneder: 0 },
              },
            },
          }
        ).as('fetchAlderspensjon')
        cy.contains('Beregn pensjon').click()

        cy.contains('Beregning').should('not.exist')
        cy.contains('Pensjonsgivende årsinntekt frem til pensjon').should(
          'exist'
        )
        cy.contains(
          'Opptjeningen din er ikke høy nok til ønsket uttak. Du må sette ned uttaksgraden.'
        ).should('exist')
      })
    })

    describe('Når jeg har for lav opptjening til å gjøre noe uttak fra 62 år.', () => {
      // TODO: Sjekk om NAU er riktig for test-case.
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').eq(1).check()
      })

      // Som bruker som har lav opptjening opptjening til 20 % fra 62 år (nedre pensjonsalder) og 100% fra 67 år (normert pensjonsalder)

      it('forventer jeg informasjon om at opptjeningen ikke er høy nok til uttak av alderspensjon ved 62 år (nedre pensjonsalder), og at kalkulatoren ikke kan beregne uttak etter nedre alder.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('20 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()

        cy.intercept(
          {
            method: 'POST',
            url: '/pensjon/kalkulator/api/v8/alderspensjon/simulering',
          },
          {
            alderspensjon: [],
            vilkaarsproeving: {
              vilkaarErOppfylt: false,
              alternativ: {
                heltUttaksalder: { aar: 67, maaneder: 0 },
              },
            },
          }
        ).as('fetchAlderspensjon')
        cy.contains('Beregn pensjon').click()

        cy.contains('Beregning').should('not.exist')
        cy.contains('Pensjonsgivende årsinntekt frem til pensjon').should(
          'exist'
        )
        cy.contains(
          'Opptjeningen din er ikke høy nok til ønsket uttak. Du må sette ned uttaksgraden.'
        ).should('exist')
      })
    })

    describe('Når jeg er kommet til beregningssiden - detaljert', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
          samtykke: true,
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').eq(1).check()
        cy.get('[data-testid="uttaksgrad"]').select('40 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-ja"]').check()
        cy.get('[data-testid="inntekt-vsa-gradert-uttak"]').type('100000')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '62'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('1')
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

      it('forventer jeg en ingress med informasjon om at "hvis du velger AFP, får du ikke uføretrygd etter at du 62 år. Uføretrygd vises ikke i beregningen"', () => {
        cy.contains(
          'Hvis du velger AFP, får du ikke uføretrygd etter at du blir 62 år. Uføretrygd vises ikke i beregningen.'
        ).should('exist')
      })

      it('forventer jeg at graf og tabell viser alderspensjon og AFP.', () => {
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('AFP (avtalefestet pensjon)').should('exist')
        cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should('exist')
        cy.contains('Alderspensjon (Nav)').should('exist')
        cy.contains('Tusen kroner').should('exist')
        cy.contains('61').should('exist')
        cy.contains('87+').should('exist')
        cy.contains('Pensjonsavtaler').should('exist')
        cy.get('[data-testid="showmore-button"]').click()
        cy.contains('Andre avtaler').should('exist')
        cy.contains('Privat tjenestepensjon').should('exist')
        cy.contains('Individuelle ordninger').should('exist')
        cy.contains('Vis mindre').should('exist')
      })

      it('forventer jeg ett veilederpanel som anbefaler å ta kontakt for hjelp.', () => {
        cy.get('[data-testid="vurderer_du_a_velge_afp"]').should('exist')
      })

      it('forventer jeg informasjon i grunnlag om hvilken AFP som er beregnet.', () => {
        cy.contains('Øvrig grunnlag for beregningen').should('exist')
        cy.contains('AFP: Privat').should('exist')
      })

      it('forventer jeg å kunne endre avanserte valg.', () => {
        cy.contains('Endre avanserte valg').click()
        cy.get('[data-testid="uttaksgrad"]').select('50 %')
        cy.contains('Oppdater pensjon').click()
        cy.contains('Estimert pensjon').should('exist')
      })
    })

    describe('Når jeg velger å beregne Alderspensjon og uføretrygd, uten AFP.', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
          samtykke: true,
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').first().check()
      })

      it('forventer jeg å kunne velge pensjonsalder mellom 62 år + 0 md og 75 år og 0 md, og jeg kan velge pensjonsalder mellom 67 år + 0 md og 75 år og 0 md for når jeg ønsker øke til hel alderspensjon.', () => {
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
          '67'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(13)
          expect(options.eq(1).text()).equal('0 md. (apr.)')
          expect(options.eq(12).text()).equal('11 md. (mars)')
        })
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="uttaksgrad"]').select('50 %')
        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.contains('Når vil du ta ut 100 % alderspensjon?').should('exist')
        cy.contains('Velg år').should('exist')
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').then(
          (selectElements) => {
            const options = selectElements.find('option')
            expect(options.length).equal(10)
            expect(options.eq(1).text()).equal('67 år')
            expect(options.eq(9).text()).equal('75 år')
          }
        )
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '70'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(13)
          expect(options.eq(1).text()).equal('0 md. (apr.)')
          expect(options.eq(12).text()).equal('11 md. (mars)')
        })
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
      })

      it('forventer jeg å få tilpasset informasjon i read more «Om pensjonsalder og uføretrygd».', () => {
        cy.contains('Om pensjonsalder og uføretrygd').should('exist')
      })
    })

    describe('Når jeg har valgt pensjonsalder mellom 62 år og 0 md og 66 år og 11 md.', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
          samtykke: true,
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').first().check()
      })

      it('forventer jeg at mulige uttaksgrader begrenses til uttaksgradene som er mulig å kombinere med uføretrygd.', () => {
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '66'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="uttaksgrad"]').then((selectElements) => {
          const options = selectElements.find('option')
          expect(options.length).equal(5)
          expect(options.eq(1).text()).equal('20 %')
          expect(options.eq(2).text()).equal('40 %')
          expect(options.eq(3).text()).equal('50 %')
          expect(options.eq(4).text()).equal('60 %')
        })
      })

      it('forventer jeg å få tilpasset informasjon i read more "Om uttaksgrad og uføretrygd".', () => {
        cy.contains('Om uttaksgrad og uføretrygd').should('exist')
      })

      it('forventer jeg tilpasset informasjon om inntekt samtidig som uttak av pensjon.', () => {
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '66'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="uttaksgrad"]').select('50 %')
        cy.contains(
          'Om alderspensjon og inntektsgrensen for uføretrygd'
        ).should('exist')
      })
    })

    describe('Når jeg har valgt pensjonsalder 67 år og 0 md eller senere', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
          samtykke: true,
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').first().check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
      })

      it('forventer jeg å kunne velge alle uttaksgrader.', () => {
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

      it('forventer jeg å få tilpasset informasjon i read more "Om uttaksgrad og uføretrygd"', () => {
        cy.contains('Om uttaksgrad og uføretrygd').should('exist')
      })

      it('forventer jeg vanlig informasjon om inntekt samtidig som uttak av pensjon.', () => {
        cy.get('[data-testid="uttaksgrad"]').select('50 %')
        cy.contains(
          'Du kan tjene så mye du vil samtidig som du tar ut pensjon.'
        ).should('exist')
      })
    })

    describe('​Når jeg er kommet til beregningssiden - detaljert', () => {
      beforeEach(() => {
        cy.fillOutStegvisning({
          afp: 'ja_privat',
          samtykke: true,
        })
        cy.get('[data-testid="toggle-avansert"]').within(() => {
          cy.contains('Avansert').click()
        })
        cy.get('[type="radio"]').first().check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '67'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="uttaksgrad"]').select('40 %')

        cy.get('[data-testid="inntekt-vsa-gradert-uttak-radio-nei"]').check()
        cy.get('[data-testid="age-picker-uttaksalder-helt-uttak-aar"]').select(
          '75'
        )
        cy.get(
          '[data-testid="age-picker-uttaksalder-helt-uttak-maaneder"]'
        ).select('0')
        cy.get('[data-testid="inntekt-vsa-helt-uttak-radio-nei"]').check()
        cy.contains('Beregn pensjon').click()
      })

      it('forventer jeg en ingress med informasjon om at jeg har uføretrygd, men at den ikke vises i bergningen.', () => {
        cy.contains(
          'Du har 40 % uføretrygd. Den kommer i tillegg til inntekt og pensjon frem til du blir 67 år. Uføretrygd vises ikke i beregningen.'
        ).should('exist')
      })

      it('forventer jeg at graf og tabell viser alderspensjon.', () => {
        cy.contains('Pensjonsgivende inntekt').should('exist')
        cy.contains('AFP (avtalefestet pensjon)').should('exist')
        cy.contains('Pensjonsavtaler (arbeidsgivere m.m.)').should('exist')
        cy.contains('Alderspensjon (Nav)').should('exist')
        cy.contains('Tusen kroner').should('exist')
        cy.contains('66').should('exist')
        cy.contains('87+').should('exist')
        cy.contains('Pensjonsavtaler').should('exist')
        cy.get('[data-testid="showmore-button"]').click()
        cy.contains('Andre avtaler').should('exist')
        cy.contains('Privat tjenestepensjon').should('exist')
        cy.contains('Individuelle ordninger').should('exist')
        cy.contains('Vis mindre').should('exist')
      })

      it('forventer jeg informasjon i grunnlag om at AFP ikke er beregnet.', () => {
        cy.contains('AFP: Privat (Ikke beregnet)').should('exist')
      })

      it('forventer jeg å kunne endre avanserte valg.', () => {
        cy.contains('Endre avanserte valg').click()
        cy.get('[data-testid="uttaksgrad"]').select('50 %')
        cy.contains('Oppdater pensjon').click()
        cy.contains('Estimert pensjon').should('exist')
      })
    })
  })
})

export {}

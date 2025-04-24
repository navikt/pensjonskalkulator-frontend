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
          ufoeretrygd: { grad: 90 },
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
          cy.contains('Du har 90 % uføretrygd.').should('exist')
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
          cy.contains('Du har 90 % uføretrygd.').should('exist')
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
  })

  describe('Når jeg ønsker en avansert beregning', () => {
    // TODO: Som bruker som har valgt avansert beregning
    // TODO: Som bruker som har rett til Livsvarig AFP eller AFP Privat

    it('forventer jeg informasjon om at jeg har uføretrygd, og må velge mellom uføretrygd og alderspensjon før 62 år.', () => {})

    it('forventer jeg å kunne velge å beregne Alderspensjon og uføretrygd, uten AFP.', () => {})

    it('forventer jeg å kunne velge å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år.', () => {})
  })

  describe('Når jeg velger å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {
    // TODO: Som bruker som har valgt avansert beregning
    // TODO: Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år

    it('forventer jeg at 62 år (nedre pensjonsalder) er fast laveste uttaksalder.', () => {})
    it('forventer jeg å kunne endre inntekt frem til pensjon.', () => {})
    it('forventer jeg å kunne velge uttaksgrad fra 20 - 100 %.', () => {})
    it('forventer jeg å kunne velge uttaksalder for 100% fra 62 år (nedre pensjonsalder) + 1 md.', () => {})
    it('forventer jeg å kunne legge til inntekt samtidig som pensjon.', () => {})
    it('forventer jeg å kunne beregn pensjon.', () => {})
  })

  describe('Når jeg har for lav opptjening til valgt uttak', () => {
    // TODO: Som bruker som ønsker avansert beregning
    // TODO: Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år
    // TODO: Som bruker som har lav opptjening

    it('forventer jeg informasjon om at jeg ikke har høy nok opptjening, og at jeg må sette ned uttaksgraden.', () => {})
  })

  describe('Når jeg har for lav opptjening til valgt uttak', () => {
    // TODO: Som bruker som ønsker avansert beregning
    // TODO: Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år
    // TODO: Som bruker som har lav opptjening
    // TODO: Som bruker som har valgt gradert uttak fra 62 år (nedre pensjonsalder) og 100 % tidligere enn 67 år (normert pensjonsalder)

    it('forventer jeg ett alternativt forslag om å sette ned uttaksgraden og øke alder for 100% uttak.', () => {})
  })

  describe('Når jeg har for lav opptjening til å gjøre noe uttak fra 62 år.', () => {
    // TODO: Som bruker som ønsker avansert beregning
    // TODO: Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år
    // TODO: Som bruker som har lav opptjening opptjening til 20 % fra 62 år (nedre pensjonsalder) og 100% fra 67 år (normert pensjonsalder)

    it('forventer jeg informasjon om at opptjeningen ikke er høy nok til uttak av alderspensjon ved 62 år (nedre pensjonsalder), og at kalkulatoren ikke kan beregne uttak etter nedre alder.', () => {})
  })

  describe('Når jeg er kommet til beregningssiden - detaljert', () => {
    // TODO: Som bruker som har gjort avansert beregning av Alderspensjon og AFP, uten uføretrygd fra 62 år

    it('forventer jeg en ingress med informasjon om at "hvis du velger AFP, får du ikke uføretrygd etter at du 62 år. Uføretrygd vises ikke i beregningen"', () => {})
    it('forventer jeg at graf og tabell viser alderspensjon og AFP.', () => {})
    it('forventer jeg ett veilederpanel som anbefaler å ta kontakt for hjelp.', () => {})
    it('forventer jeg informasjon i grunnlag om hvilken AFP som er beregnet.', () => {})
    it('forventer jeg å kunne endre avanserte valg.', () => {})
  })

  describe('Når jeg velger å beregne Alderspensjon og uføretrygd, uten AFP.', () => {
    // TODO: Som bruker som har rett til AFP, men beregner uten AFP
    // TODO: Som bruker som ønsker en avansert beregning

    it('forventer jeg å kunne velge pensjonsalder mellom 62 år + 0 md og 75 år og 0 md, og jeg kan velge pensjonsalder mellom 67 år + 0 md og 75 år og 0 md for når jeg ønsker øke til hel alderspensjon.', () => {})
    it('forventer jeg å få tilpasset informasjon i read more «Om pensjonsalder og uføretrygd».', () => {})
  })

  describe('Når jeg har valgt pensjonsalder mellom 62 år og 0 md og 66 år og 11 md.', () => {
    // TODO: Som bruker som har rett til AFP, men beregner uten AFP
    // TODO: Som bruker som ønsker en avansert beregning

    it('forventer jeg at mulige uttaksgrader begrenses til uttaksgradene som er mulig å kombinere med uføretrygd.', () => {})

    it('forventer jeg å få tilpasset informasjon i read more "om uttaksgrad og uføretrygd".', () => {})

    it('forventer jeg tilpasset informasjon om inntekt samtidig som uttak av pensjon.', () => {})
  })

  describe('Når jeg har valgt pensjonsalder 67 år og 0 md eller senere', () => {
    // TODO: Som bruker som har rett til AFP, men beregner uten AFP
    // TODO: Som bruker som ønsker en avansert beregning

    it('forventer jeg å kunne velge alle uttaksgrader.', () => {})

    it('forventer jeg å få tilpasset informasjon i read more "om uttaksgrad og uføretrygd"', () => {})

    it('forventer jeg vanlig informasjon om inntekt samtidig som uttak av pensjon.', () => {})
  })

  describe('​Når jeg er kommet til beregningssiden - detaljert', () => {
    // TODO: Som bruker som har gjort avansert beregning av Alderspensjon og uføretrygd, uten AFP.

    it('forventer jeg en ingress med informasjon om at jeg har uføretrygd, men at den ikke vises i bergningen.', () => {})

    it('forventer jeg at graf og tabell viser alderspensjon.', () => {})

    it('forventer jeg informasjon i grunnlag om at AFP ikke er beregnet.', () => {})

    it('forventer jeg å kunne endre avanserte valg.', () => {})
  })
})

export {}

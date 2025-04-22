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
      cy.login()
    })

    describe('Når jeg svarer "Ja" på AFP offentlig', () => {
      it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres.', () => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('AFP og uføretrygd kan ikke kombineres.').should('exist')
      })

      it('forventer jeg å må samtykke til å beregne AFP.', () => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
        cy.get('[type="radio"]').first().check()
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('button', 'Neste').click() // -> AFP Info
        cy.contains(
          'Samtykke til at Nav beregner AFP (avtalefestet pensjon)'
        ).should('exist')
      })

      it('forventer jeg å kunne gå videre til beregningssiden', () => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
        cy.get('[type="radio"]').first().check()
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

      describe('Når jeg er kommet til beregningssiden', () => {
        describe('Som bruker som har samtykket til å beregne AFP offentlig', () => {
          beforeEach(() => {
            cy.fillOutStegvisning({ afp: 'ja_offentlig', samtykke: true })
            cy.wait('@fetchTidligsteUttaksalder')
          })

          it('forventer jeg informasjon om at jeg har x-prosent uføretrygd.', () => {})
          it('forventer jeg å kunne beregne 100% alderspensjon fra 67 år og senere.', () => {})
          it('forventer jeg å kunne velge "avansert".', () => {})
        })

        describe('Som bruker som ikke har samtykket til å beregne AFP offentlig', () => {
          beforeEach(() => {
            cy.fillOutStegvisning({
              afp: 'ja_offentlig',
              samtykke: false,
            })
            cy.wait('@fetchTidligsteUttaksalder')
          })

          it('forventer jeg å ikke få mulighet til å beregne AFP.', () => {})
          it('forventer jeg informasjon i grunnlag om at "AFP ikke er beregnet grunnet ikke samtykket".', () => {})
        })
      })
    })

    describe('Når jeg svarer "Ja" på AFP privat', () => {
      it('forventer jeg informasjon om at AFP og uføretrygd ikke kan kombineres.', () => {
        cy.contains('button', 'Kom i gang').click()
        cy.contains('button', 'Neste').click() // -> Sivilstand
        cy.get('[type="radio"]').last().check()
        cy.contains('button', 'Neste').click() // -> Opphold utenfor Norge
        cy.get('[type="radio"]').eq(1).check()
        cy.contains('button', 'Neste').click() // -> AFP
        cy.contains('AFP og uføretrygd kan ikke kombineres.').should('exist')
      })
      it('forventer jeg å kunne gå videre til beregningssiden.', () => {})

      describe('Når jeg er kommet til beregningssiden', () => {
        describe('Som bruker som har rett til AFP privat', () => {
          beforeEach(() => {
            cy.fillOutStegvisning({
              afp: 'ja_privat',
            })
            cy.wait('@fetchTidligsteUttaksalder')
          })

          it('forventer jeg informasjon om at jeg har x-prosent uføretrygd.', () => {})
          it('forventer jeg å kunne beregne 100% alderspensjon fra 67 år og senere.', () => {})
          it('forventer jeg å kunne velge "avansert".', () => {})
        })
      })
    })

    describe('Når jeg ønsker en avansert beregning', () => {
      describe('Som bruker som har valgt avansert beregning', () => {})
      describe('Som bruker som har rett til Livsvarig AFP eller AFP Privat', () => {})
    })

    describe('Når jeg velger å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {
      describe('Som bruker som ønsker avansert beregning', () => {})
      describe('Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {})
    })

    describe('Når jeg har for lav opptjening til valgt uttak', () => {
      describe('Som bruker som ønsker avansert beregning', () => {})
      describe('Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {})
      describe('Som bruker som har lav opptjening', () => {})
      describe('Som bruker som har valgt gradert uttak fra 62 år (nedre pensjonsalder) og 100 % tidligere enn 67 år (normert pensjonsalder)', () => {})
    })

    describe('Når jeg har for lav opptjening til å gjøre noe uttak fra 62 år.', () => {
      describe('​Som bruker som ønsker avansert beregning', () => {})
      describe('Som bruker som har valgt å beregne Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {})
      describe('Som bruker som har lav opptjening opptjening til 20 % fra 62 år (nedre pensjonsalder) og 100% fra 67 år (normert pensjonsalder)', () => {})
    })

    describe('Når jeg er kommet til beregningssiden - detaljert', () => {
      describe('​Som bruker som har gjort avansert beregning av Alderspensjon og AFP, uten uføretrygd fra 62 år', () => {})
    })

    describe('Når jeg velger å beregne Alderspensjon og uføretrygd, uten AFP.', () => {
      describe('Som bruker som har rett til AFP, men beregner uten AFP', () => {})
      describe('Som bruker som ønsker en avansert beregning', () => {})
    })

    describe('Når jeg har valgt pensjonsalder mellom 62 år og 0 md og 66 år og 11 md.', () => {
      describe('Som bruker som har rett til AFP, men beregner uten AFP', () => {})
      describe('Som bruker som ønsker en avansert beregning', () => {})
    })

    describe('Når jeg har valgt pensjonsalder 67 år og 0 md eller senere', () => {
      describe('Som bruker som har rett til AFP, men beregner uten AFP', () => {})
      describe('Som bruker som ønsker en avansert beregning', () => {})
    })

    describe('​Når jeg er kommet til beregningssiden - detaljert', () => {
      describe('Som bruker som har rett til AFP, men beregner uten AFP', () => {})
      describe('Som bruker som ønsker en avansert beregning', () => {})
    })
  })
})

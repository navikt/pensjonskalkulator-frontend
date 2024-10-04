describe('med omstillingsstønad og gjenlevende', () => {
  describe('Som bruker som har logget inn på kalkulatoren,', () => {
    describe('Som bruker som mottar omstillingsstønad eller gjenlevendepensjon,', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/pensjon/kalkulator/api/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse',
          },
          {
            harLoependeSak: true,
          }
        ).as('getOmstillingsstoenadOgGjenlevende')
        cy.login()
        cy.fillOutStegvisning({})
        cy.wait('@fetchTidligsteUttaksalder')
      })

      it('ønsker jeg informasjon om når jeg tidligst kan starte uttak av pensjon.', () => {
        cy.contains(
          'Din opptjening gjør at du tidligst kan ta ut 100 % alderspensjon når du er'
        )
      })

      it('forventer jeg å få informasjon om at alderspensjon ikke kan kombineres med omstillingsstønad eller gjenlevendepensjon.', () => {
        cy.contains(
          'Alderspensjon kan ikke kombineres med gjenlevendepensjon eller omstillingsstønad'
        )
      })

      it('må jeg kunne trykke på Readmore for informasjon om pensjonsalder.', () => {
        cy.contains('Om pensjonsalder')
        cy.contains('Om pensjonsalder').click()
        cy.contains('Den oppgitte alderen er et estimat').should('exist')
      })
    })

    describe('Som bruker som mottar uføretrygd, og omstillingsstønad eller gjenlevendepensjon,', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/pensjon/kalkulator/api/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse',
          },
          {
            harLoependeSak: true,
          }
        ).as('getOmstillingsstoenadOgGjenlevende')
        cy.intercept(
          {
            method: 'GET',
            url: '/pensjon/kalkulator/api/v1/vedtak/loepende-vedtak',
          },
          {
            ufoeretrygd: {
              grad: 75,
            },
          }
        ).as('getLoependeVedtak')

        cy.login()
        cy.fillOutStegvisning({})
      })

      it('forventer jeg informasjon om hvilken grad uføretrygd jeg har.', () => {
        cy.contains('Du har 75 % uføretrygd.')
      })

      it('forventer jeg å få informasjon om at alderspensjon ikke kan kombineres med omstillingsstønad eller gjenlevendepensjon.', () => {
        cy.contains(
          'Alderspensjon kan ikke kombineres med gjenlevendepensjon eller omstillingsstønad'
        )
      })

      it('forventer jeg tilpasset informasjon i Readmore «om pensjonsalder og uføretrygd».', () => {
        cy.contains('Om pensjonsalder og uføretrygd')
        cy.contains('Om pensjonsalder og uføretrygd').click()
        cy.contains('Det er mulig å kombinere gradert uføretrygd').should(
          'exist'
        )
      })
    })
  })
})

export {}

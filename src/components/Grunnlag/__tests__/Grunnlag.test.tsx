import * as ReactRouterUtils from 'react-router'

import { Grunnlag } from '@/components/Grunnlag'
import { fulfilledGetLoependeVedtakUfoeregrad } from '@/mocks/mockedRTKQueryApiCalls'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { paths } from '@/router/constants'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import * as userInputReducerUtils from '@/state/userInput/userInputReducer'
import { render, screen, userEvent, waitFor } from '@/test-utils'

describe('Grunnlag', () => {
  it('når grunnlag vises i Enkel visning, viser alle seksjonene og forbehold', async () => {
    render(<Grunnlag headingLevel="3" visning="enkel" />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1)
    expect(await screen.findByText('grunnlag.title')).toBeInTheDocument()
    expect(await screen.findByText('grunnlag.ingress')).toBeInTheDocument()
    expect(await screen.findByText('grunnlag.uttaksgrad.title')).toBeVisible()
    expect(await screen.findByText('grunnlag.inntekt.title')).toBeVisible()
    expect(await screen.findByText('grunnlag.sivilstand.title')).toBeVisible()
    expect(
      await screen.findByText('grunnlag.opphold.title.mindre_enn_5_aar')
    ).toBeVisible()
    expect(
      await screen.findByText('grunnlag.alderspensjon.title')
    ).toBeVisible()
    expect(await screen.findByText('grunnlag.afp.title')).toBeVisible()
  })

  it('når grunnlag vises i Avansert visning, viser alle seksjonene utenom uttaksgrad og inntekt, i tilleg til forbehold', async () => {
    render(<Grunnlag headingLevel="2" visning="avansert" />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(await screen.findByText('grunnlag.title')).toBeInTheDocument()
    expect(await screen.findByText('grunnlag.ingress')).toBeInTheDocument()
    expect(
      screen.queryByText('grunnlag.uttaksgrad.title')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('grunnlag.inntekt.title')).not.toBeInTheDocument()
    expect(await screen.findByText('grunnlag.sivilstand.title')).toBeVisible()
    expect(
      await screen.findByText('grunnlag.opphold.title.mindre_enn_5_aar')
    ).toBeVisible()
    expect(
      await screen.findByText('grunnlag.alderspensjon.title')
    ).toBeVisible()
    expect(await screen.findByText('grunnlag.afp.title')).toBeVisible()
  })

  it('viser annen tittel for avansert', async () => {
    render(<Grunnlag headingLevel="2" visning="avansert" />)
    expect(await screen.findByText('grunnlag.title')).toBeInTheDocument()
  })

  describe('Grunnlag - inntekt frem til uttak', () => {
    it('vises i enkel visning', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />)
      expect(screen.queryByText('grunnlag.inntekt.title')).toBeInTheDocument()
    })

    it('vises ikke avansert visning', async () => {
      render(<Grunnlag headingLevel="2" visning="avansert" />)
      expect(
        screen.queryByText('grunnlag.inntekt.title')
      ).not.toBeInTheDocument()
    })
  })

  describe('Grunnlag - uttaksgrad', () => {
    it('viser riktig tittel med formatert uttaksgrad og tekst', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />)
      expect(screen.getByText('grunnlag.uttaksgrad.title')).toBeVisible()
      expect(screen.getAllByText('100 %')).toHaveLength(3)
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[1])

      expect(
        await screen.findByText('Denne beregningen viser', { exact: false })
      ).toBeVisible()
    })

    it('brukeren kan gå til avansert fane og starte en ny beregning', async () => {
      const flushCurrentSimulationMock = vi.spyOn(
        userInputReducerUtils.userInputActions,
        'flushCurrentSimulationUtenomUtenlandsperioder'
      )
      const navigateMock = vi.fn()
      vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
        () => navigateMock
      )

      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />)
      expect(screen.getByText('grunnlag.uttaksgrad.title')).toBeVisible()
      expect(screen.getAllByText('100 %')).toHaveLength(3)
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[1])
      await user.click(
        await screen.findByText('grunnlag.uttaksgrad.avansert_link')
      )
      expect(flushCurrentSimulationMock).toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith(paths.beregningAvansert)
    })

    it('vises ikke ikke avansert visning', async () => {
      render(<Grunnlag headingLevel="2" visning="avansert" />)
      expect(
        screen.queryByText('grunnlag.uttaksgrad.title')
      ).not.toBeInTheDocument()
    })
  })

  describe('Grunnlag - sivilstand', () => {
    it('viser riktig tekst og lenke når henting av sivilstand er vellykket', async () => {
      const user = userEvent.setup()
      mockResponse('/v2/person', {
        status: 200,
        json: {
          navn: 'Ola',
          sivilstand: 'GIFT',
          foedselsdato: '1963-04-30',
        },
      })
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            samboer: true,
          },
        },
      })
      expect(
        await screen.findByText('grunnlag.sivilstand.title')
      ).toBeInTheDocument()
      expect(await screen.findByText('sivilstand.gift')).toBeInTheDocument()
      await waitFor(async () => {
        expect(
          screen.queryByText('grunnlag.sivilstand.title.error')
        ).not.toBeInTheDocument()
      })
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[3])

      expect(
        await screen.findByText(
          'Hvis du har lav opptjening kan størrelsen på alderspensjonen din avhenge av om du bor alene eller sammen med noen',
          { exact: false }
        )
      ).toBeVisible()
    })

    it('viser riktig tekst og lenke når brukeren har oppgitt samboerskap manuelt', async () => {
      const user = userEvent.setup()
      mockResponse('/v2/person', {
        status: 200,
        json: {
          navn: 'Ola',
          sivilstand: 'UGIFT',
          foedselsdato: '1963-04-30',
        },
      })
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            samboer: false,
          },
        },
      })
      expect(
        await screen.findByText('grunnlag.sivilstand.title')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('sivilstand.ugift, sivilstand.uten_samboer')
      ).toBeVisible()
      expect(
        screen.queryByText('grunnlag.sivilstand.title.error')
      ).not.toBeInTheDocument()
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[3])

      expect(
        await screen.findByText(
          'Hvis du har lav opptjening kan størrelsen på alderspensjonen din avhenge av om du bor alene eller sammen med noen',
          { exact: false }
        )
      ).toBeVisible()
    })

    it('viser feilmelding når henting av personopplysninger feiler', async () => {
      const user = userEvent.setup()
      mockErrorResponse('/v2/person')
      render(<Grunnlag headingLevel="2" visning="enkel" />)

      await waitFor(() => {
        expect(
          screen.queryByText('grunnlag.sivilstand.title')
        ).toBeInTheDocument()
        expect(
          screen.getByText('grunnlag.sivilstand.title.error')
        ).toBeVisible()
      })
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[3])

      expect(
        await screen.findByText(
          'Hvis du har lav opptjening kan størrelsen på alderspensjonen din avhenge av om du bor alene eller sammen med noen',
          { exact: false }
        )
      ).toBeVisible()
    })
  })

  describe('Grunnlag - opphold', () => {
    it('viser riktig tittel med formatert inntekt og tekst', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />)
      expect(screen.getByText('grunnlag.opphold.title')).toBeVisible()
      expect(screen.getByText('grunnlag.opphold.value')).toBeVisible()
    })
  })

  describe('Grunnlag - alderspensjon', () => {
    it('viser riktig tittel', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />)
      expect(screen.getByText('grunnlag.alderspensjon.title')).toBeVisible()
      expect(screen.getByText('grunnlag.alderspensjon.title')).toBeVisible()
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[5])

      expect(
        await screen.findByText('Alderspensjon beregnes ut ifra', {
          exact: false,
        })
      ).toBeVisible()
    })
  })

  describe('Grunnlag - AFP', () => {
    it('Når brukeren har valgt AFP offentlig og samtykket til beregning av den, viser riktig tittel med formatert inntekt og tekst', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            afp: 'ja_offentlig',
            samtykkeOffentligAFP: true,
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.offentlig')).toBeVisible()

      const buttons = screen.getAllByRole('button')

      await user.click(buttons[6])

      expect(
        await screen.findByText('grunnlag.afp.ingress.ja_offentlig')
      ).toBeVisible()
    })

    it('Når brukeren har valgt AFP offentlig og ikke samtykket til beregning av den, viser riktig tittel med formatert inntekt og tekst', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            afp: 'ja_offentlig',
            samtykkeOffentligAFP: false,
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(
        screen.getByText('afp.offentlig (grunnlag.afp.ikke_beregnet)')
      ).toBeVisible()

      const buttons = screen.getAllByRole('button')

      await user.click(buttons[6])

      expect(
        await screen.findByText(
          'grunnlag.afp.ingress.ja_offentlig_utilgjengelig'
        )
      ).toBeVisible()
    })

    it('Når en bruker med uføretrygd har valgt AFP offentlig, viser riktig tittel med formatert inntekt og tekst', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          api: {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakUfoeregrad },
          },
          userInput: {
            ...userInputInitialState,
            afp: 'ja_offentlig',
          },
        },
      })

      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(
        screen.getByText('afp.offentlig (grunnlag.afp.ikke_beregnet)')
      ).toBeVisible()
      expect(
        screen.getByText(
          'Når du mottar uføretrygd, kan du ikke beregne AFP i kalkulatoren.',
          { exact: false }
        )
      ).toBeInTheDocument()
    })

    it('Når brukeren har valgt AFP privat, viser riktig tittel med formatert inntekt og tekst', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            afp: 'ja_privat',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.privat')).toBeVisible()
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[6])

      expect(
        await screen.findByText('Du har oppgitt AFP i privat sektor.', {
          exact: false,
        })
      ).toBeVisible()
    })

    it('Når en bruker med uføretrygd har valgt AFP privat, viser riktig tittel med formatert inntekt og tekst', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          api: {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakUfoeregrad },
          },
          userInput: {
            ...userInputInitialState,
            afp: 'ja_privat',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(
        screen.getByText('afp.privat (grunnlag.afp.ikke_beregnet)')
      ).toBeVisible()
      expect(
        screen.getByText(
          'Når du mottar uføretrygd, kan du ikke beregne AFP i kalkulatoren.',
          { exact: false }
        )
      ).toBeInTheDocument()
    })

    it('Når brukeren har valgt uten AFP, viser riktig tittel med formatert inntekt, tekst og lenke', async () => {
      const flushMock = vi.spyOn(
        userInputReducerUtils.userInputActions,
        'flush'
      )
      const navigateMock = vi.fn()
      vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
        () => navigateMock
      )

      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            afp: 'nei',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.nei')).toBeVisible()
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[6])

      expect(
        await screen.findByText('grunnlag.afp.ingress.nei', { exact: false })
      ).toBeVisible()
      expect(await screen.findByText('grunnlag.afp.reset_link')).toBeVisible()
      await user.click(await screen.findByText('grunnlag.afp.reset_link'))
      expect(flushMock).toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith(paths.start)
    })

    it('Når en bruker med uføretrygd har valgt uten AFP, viser riktig tittel med formatert inntekt og tekst', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          api: {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakUfoeregrad },
          },
          userInput: {
            ...userInputInitialState,
            afp: 'nei',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.nei')).toBeVisible()
      expect(
        screen.getByText('grunnlag.afp.ingress.nei.ufoeretrygd')
      ).toBeInTheDocument()
    })

    it('Når brukeren har svart "vet ikke" på AFP, viser riktig tittel med formatert inntekt og tekst', async () => {
      const user = userEvent.setup()
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            afp: 'vet_ikke',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.vet_ikke')).toBeVisible()
      const buttons = screen.getAllByRole('button')

      await user.click(buttons[6])

      expect(
        await screen.findByText('grunnlag.afp.ingress.vet_ikke')
      ).toBeVisible()
    })

    it('Når en bruker med uføretrygd har svart "vet ikke" på AFP, viser riktig tittel med formatert inntekt og tekst', async () => {
      render(<Grunnlag headingLevel="2" visning="enkel" />, {
        preloadedState: {
          api: {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakUfoeregrad },
          },
          userInput: {
            ...userInputInitialState,
            afp: 'vet_ikke',
          },
        },
      })
      expect(screen.getByText('grunnlag.afp.title')).toBeVisible()
      expect(screen.getByText('afp.vet_ikke')).toBeVisible()
      expect(
        screen.getByText('grunnlag.afp.ingress.vet_ikke.ufoeretrygd')
      ).toBeInTheDocument()
    })
  })
})

import * as ReactRouterUtils from 'react-router'

import { GrunnlagUtenlandsopphold } from '..'
import { fulfilledGetLoependeVedtakLoependeAlderspensjon } from '@/mocks/mockedRTKQueryApiCalls'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import { render, screen, userEvent } from '@/test-utils'

describe('GrunnlagUtenlandsopphold', () => {
  describe('Gitt at brukeren har svart "nei" på spørsmålet om opphold i utlandet', () => {
    it('viser riktig tittel og innhold og liste over utenlandsopphold vises ikke', async () => {
      const user = userEvent.setup()
      render(<GrunnlagUtenlandsopphold />, {
        preloadedState: {
          userInput: { ...userInputInitialState, harUtenlandsopphold: false },
        },
      })

      expect(
        await screen.findByText('grunnlag.opphold.title.mindre_enn_5_aar')
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.value.mindre_enn_5_aar')
      ).toBeVisible()

      await user.click(await screen.findByTestId('accordion-header'))

      expect(
        await screen.findByText('grunnlag.opphold.ingress.mindre_enn_5_aar')
      ).toBeVisible()
      expect(
        screen.queryByText('stegvisning.utenlandsopphold.oppholdene.title')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('grunnlag.opphold.ingress.for_lite_trygdetid')
      ).not.toBeInTheDocument()
      expect(
        await screen.findByText(
          'Du kan endre oppholdene dine ved å gå tilbake til',
          { exact: false }
        )
      ).toBeVisible()
      expect(
        screen.queryByText('grunnlag.opphold.bunntekst')
      ).not.toBeInTheDocument()
    })
  })

  describe('Gitt at brukeren har svart "ja" på spørsmålet om opphold i utlandet', () => {
    it('viser riktig tittel og innhold og liste over utenlandsopphold vises', async () => {
      const user = userEvent.setup()

      render(<GrunnlagUtenlandsopphold />, {
        preloadedState: {
          userInput: { ...userInputInitialState, harUtenlandsopphold: true },
        },
      })

      expect(
        await screen.findByText('grunnlag.opphold.title.mer_enn_5_aar')
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.value.mer_enn_5_aar')
      ).toBeVisible()

      await user.click(await screen.findByTestId('accordion-header'))

      expect(
        screen.queryByText('grunnlag.opphold.ingress.mindre_enn_5_aar')
      ).not.toBeInTheDocument()
      expect(
        await screen.findByText('stegvisning.utenlandsopphold.oppholdene.title')
      ).toBeVisible()
      expect(
        screen.queryByText('grunnlag.opphold.ingress.for_lite_trygdetid')
      ).not.toBeInTheDocument()
      expect(
        await screen.findByText(
          'Du kan endre oppholdene dine ved å gå tilbake til',
          { exact: false }
        )
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.bunntekst')
      ).toBeVisible()
    })
  })

  describe('Gitt at brukeren har for lite trygdetid', () => {
    it('viser riktig tittel og innhold og liste over utenlandsopphold vises', async () => {
      const user = userEvent.setup()
      render(<GrunnlagUtenlandsopphold harForLiteTrygdetid={true} />, {
        preloadedState: {
          userInput: { ...userInputInitialState, harUtenlandsopphold: true },
        },
      })

      expect(
        await screen.findByText('grunnlag.opphold.title.for_lite_trygdetid')
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.value.for_lite_trygdetid')
      ).toBeVisible()

      await user.click(await screen.findByTestId('accordion-header'))

      expect(
        screen.queryByText('grunnlag.opphold.ingress.mindre_enn_5_aar')
      ).not.toBeInTheDocument()
      expect(
        await screen.findByText('stegvisning.utenlandsopphold.oppholdene.title')
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.ingress.for_lite_trygdetid')
      ).toBeVisible()
      expect(
        await screen.findByText(
          'Du kan endre oppholdene dine ved å gå tilbake til',
          { exact: false }
        )
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.bunntekst')
      ).toBeVisible()
    })
  })

  describe('Gitt at brukeren har vedtak om alderspensjon', () => {
    it('viser riktig tittel og innhold og liste over utenlandsopphold vises ikke', async () => {
      const user = userEvent.setup()
      render(<GrunnlagUtenlandsopphold />, {
        preloadedState: {
          api: {
            //@ts-ignore
            queries: {
              ...fulfilledGetLoependeVedtakLoependeAlderspensjon,
            },
          },
          userInput: { ...userInputInitialState, harUtenlandsopphold: false },
        },
      })

      expect(
        await screen.findByText('grunnlag.opphold.title.endring')
      ).toBeVisible()
      expect(
        await screen.findByText('grunnlag.opphold.value.endring')
      ).toBeVisible()

      await user.click(await screen.findByTestId('accordion-header'))

      expect(
        await screen.findByText('grunnlag.opphold.ingress.endring')
      ).toBeVisible()
      expect(
        screen.queryByText('stegvisning.utenlandsopphold.oppholdene.title')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('grunnlag.opphold.ingress.for_lite_trygdetid')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('grunnlag.opphold.bunntekst')
      ).not.toBeInTheDocument()
    })
  })

  it('Når man klikker på lenken for å endre opphold, sendes man til Utenlandsoppholdsteget', async () => {
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )

    const user = userEvent.setup()

    render(<GrunnlagUtenlandsopphold />, {
      preloadedState: {
        userInput: { ...userInputInitialState, harUtenlandsopphold: false },
      },
    })

    expect(
      await screen.findByText('grunnlag.opphold.title.mindre_enn_5_aar')
    ).toBeVisible()
    expect(
      await screen.findByText('grunnlag.opphold.value.mindre_enn_5_aar')
    ).toBeVisible()

    await user.click(await screen.findByTestId('accordion-header'))

    await user.click(
      await screen.findByText('grunnlag.opphold.ingress.endre_opphold.link')
    )

    expect(
      await screen.findByText('grunnlag.opphold.avbryt_modal.title')
    ).toBeVisible()
    expect(
      await screen.findByText('grunnlag.opphold.avbryt_modal.avbryt')
    ).toBeVisible()
    expect(navigateMock).not.toHaveBeenCalled()
    expect(
      await screen.findByText('grunnlag.opphold.avbryt_modal.bekreft')
    ).toBeVisible()
    await user.click(screen.getByText('grunnlag.opphold.avbryt_modal.avbryt'))
    await user.click(
      screen.getByText('grunnlag.opphold.ingress.endre_opphold.link')
    )
    await user.click(screen.getByText('grunnlag.opphold.avbryt_modal.bekreft'))

    expect(navigateMock).toHaveBeenCalledWith('/utenlandsopphold')
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  fulfilledGetGrunnbeloep,
  fulfilledGetLoependeVedtak0Ufoeregrad,
  fulfilledGetPerson,
} from '@/mocks/mockedRTKQueryApiCalls'
import {
  AvansertBeregningModus,
  BeregningContext,
} from '@/pages/Beregning/context'
import { apiSlice } from '@/state/api/apiSlice'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { fireEvent, render, screen, userEvent } from '@/test-utils'

import { AvansertSkjemaForBrukereMedKap19Afp } from '..'
import { AVANSERT_FORM_NAMES } from '../../utils'

describe('AvansertSkjemaForBrukereMedKap19Afp', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  const contextMockedValues = {
    avansertSkjemaModus: 'redigering' as AvansertBeregningModus,
    setAvansertSkjemaModus: vi.fn(),
    harAvansertSkjemaUnsavedChanges: false,
    setHarAvansertSkjemaUnsavedChanges: () => {},
  }

  const mockedQueries = {
    ...fulfilledGetPerson,
    ...fulfilledGetGrunnbeloep,
    ...fulfilledGetLoependeVedtak0Ufoeregrad,
  }

  it('Rendrer komponenten med riktig overskrift og innhold', () => {
    render(
      <BeregningContext.Provider value={contextMockedValues}>
        <AvansertSkjemaForBrukereMedKap19Afp />
      </BeregningContext.Provider>,
      {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: mockedQueries,
          },
          userInput: {
            ...userInputInitialState,
          },
        },
      }
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'beregning.avansert.rediger.afp_etterfulgt_av_ap.title'
    )
    expect(screen.getByTestId('agepicker-helt-uttaksalder')).toBeVisible()
    expect(
      screen.getByTestId(AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio)
    ).toBeVisible()
    expect(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaAfpRadio)
    ).toBeVisible()

    //test ved klikk av radioknapp at textfield vises
  })

  describe('Ved validering av obligatoriske felter', () => {
    describe('Gitt at det er valideringsfeil', () => {
      it('Vil valideringsfeil vises', async () => {
        const user = userEvent.setup()
        render(
          <BeregningContext.Provider value={contextMockedValues}>
            <AvansertSkjemaForBrukereMedKap19Afp />
          </BeregningContext.Provider>,
          {
            preloadedState: {
              api: {
                // @ts-ignore
                queries: mockedQueries,
              },
              userInput: {
                ...userInputInitialState,
              },
            },
          }
        )

        expect(
          screen.getByText('beregning.avansert.button.beregn')
        ).toBeVisible()

        await user.click(screen.getByText('beregning.avansert.button.beregn'))

        expect(
          screen.getByText('agepicker.validation_error.aar', {
            exact: false,
          })
        ).toBeVisible()

        expect(
          screen.getByText(
            'Du må svare på om du forventer å ha inntekt på minst',
            { exact: false }
          )
        ).toBeVisible()

        expect(
          screen.getByText(
            'beregning.avansert.rediger.radio.inntekt_vsa_afp.validation_error'
          )
        ).toBeVisible()
      })
    })

    describe('Gitt at det ikke er valideringsfeil', () => {
      it('Håndteres gyldig innsending av skjema', async () => {
        const user = userEvent.setup()
        render(
          <BeregningContext.Provider value={contextMockedValues}>
            <AvansertSkjemaForBrukereMedKap19Afp />
          </BeregningContext.Provider>,
          {
            preloadedState: {
              api: {
                // @ts-ignore
                queries: mockedQueries,
              },
              userInput: {
                ...userInputInitialState,
              },
            },
          }
        )

        const selectAarElement = screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        )
        const optionAarElements = selectAarElement?.querySelectorAll('option')
        expect(optionAarElements?.[0].value).toBe('')
        expect(optionAarElements?.[1].value).toBe('62')

        fireEvent.change(
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          ),
          {
            target: { value: '62' },
          }
        )

        const selectMaanederElement = screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        )
        const optionMaanederElements =
          selectMaanederElement?.querySelectorAll('option')
        expect(optionMaanederElements?.[0].value).toBe('')
        expect(optionMaanederElements?.[1].value).toBe('1')

        fireEvent.change(
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          ),
          {
            target: { value: '5' },
          }
        )

        await user.click(
          screen.getByTestId(
            `${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-ja`
          )
        )

        await user.click(
          screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-nei`)
        )

        await user.click(screen.getByText('beregning.avansert.button.beregn'))

        expect(
          screen.queryByText('agepicker.validation_error.aar')
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText('agepicker.validation_error.maaneder')
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText(
            'Du må svare på om du forventer å ha inntekt på minst',
            { exact: false }
          )
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText(
            'beregning.avansert.rediger.radio.inntekt_vsa_afp.validation_error'
          )
        ).not.toBeInTheDocument()
      })
      it('Når alle feltene fylles ut og resetForm kalles, nullstilles alle feltene', async () => {
        const user = userEvent.setup()
        const { store } = render(
          <BeregningContext.Provider
            value={{
              ...contextMockedValues,
            }}
          >
            <AvansertSkjemaForBrukereMedKap19Afp />
          </BeregningContext.Provider>,
          {
            preloadedState: {
              api: {
                // @ts-ignore
                queries: { ...mockedQueries },
              },
              userInput: {
                ...userInputInitialState,
              },
            },
          }
        )
        store.dispatch(apiSlice.endpoints.getInntekt.initiate())

        // Endrer inntekt frem til uttak
        await user.click(
          screen.getByText('beregning.avansert.rediger.inntekt.button')
        )
        const input = screen.getByTestId('inntekt-textfield')
        await user.clear(input)
        await user.type(input, '1')
        await user.type(input, '2')
        await user.type(input, '3')
        await user.type(input, '0')
        await user.type(input, '0')
        await user.type(input, '0')
        expect(
          screen.queryByText(
            'inntekt.endre_inntekt_modal.textfield.validation_error'
          )
        ).not.toBeInTheDocument()
        await user.click(screen.getByText('inntekt.endre_inntekt_modal.button'))

        const selectAarElement = screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        )
        const optionAarElements = selectAarElement?.querySelectorAll('option')
        expect(optionAarElements?.[0].value).toBe('')
        expect(optionAarElements?.[1].value).toBe('62')

        fireEvent.change(
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          ),
          {
            target: { value: '62' },
          }
        )

        const selectMaanederElement = screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        )
        const optionMaanederElements =
          selectMaanederElement?.querySelectorAll('option')
        expect(optionMaanederElements?.[0].value).toBe('')
        expect(optionMaanederElements?.[1].value).toBe('1')

        fireEvent.change(
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          ),
          {
            target: { value: '5' },
          }
        )

        await user.click(
          screen.getByTestId(
            `${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-ja`
          )
        )

        await user.click(
          screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-ja`)
        )

        const inputField = await screen.getByTestId(
          AVANSERT_FORM_NAMES.inntektVsaAfp
        )

        await user.type(inputField, '1')
        await user.type(inputField, '2')
        await user.type(inputField, '3')
        await user.type(inputField, '0')
        await user.type(inputField, '0')
        await user.type(inputField, '0')
        // Sjekker at feltene er fylt ut

        expect(
          (
            (await screen.findByTestId(
              `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
            )) as HTMLSelectElement
          ).value
        ).toBe('62')
        expect(
          (
            (await screen.findByTestId(
              `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
            )) as HTMLSelectElement
          ).value
        ).toBe('5')

        expect(
          (
            screen.getByTestId(
              `${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-ja`
            ) as HTMLInputElement
          ).checked
        ).toBe(true)

        expect(
          (
            screen.getByTestId(
              `${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-ja`
            ) as HTMLInputElement
          ).checked
        ).toBe(true)

        expect(
          await screen.findByTestId(AVANSERT_FORM_NAMES.inntektVsaAfp)
        ).toHaveValue('123 000')

        fireEvent.click(screen.getByText('beregning.avansert.button.nullstill'))

        // Sjekker at feltene er nullstilt
        expect(
          await screen.findByTestId('formatert-inntekt-frem-til-uttak')
        ).toHaveTextContent('521 338')
        expect(
          (
            (await screen.findByTestId(
              `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
            )) as HTMLSelectElement
          ).value
        ).toBe('')
        expect(
          (
            (await screen.findByTestId(
              `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
            )) as HTMLSelectElement
          ).value
        ).toBe('')

        expect(
          screen.queryByTestId(
            AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio
          )
        ).not.toBeChecked()

        expect(
          screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaAfpRadio)
        ).not.toBeChecked()

        expect(
          screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaAfp)
        ).not.toBeInTheDocument()
      })
    })

    describe.skip('Ved klikk på radioknapp', () => {
      it('Skal alert vises når bruker ikke har afpInntektMaanedFoerUttak', async () => {
        const user = userEvent.setup()
        render(
          <BeregningContext.Provider value={contextMockedValues}>
            <AvansertSkjemaForBrukereMedKap19Afp />
          </BeregningContext.Provider>,
          {
            preloadedState: {
              api: {
                // @ts-ignore
                queries: mockedQueries,
              },
              userInput: {
                ...userInputInitialState,
              },
            },
          }
        )
        expect(
          screen.getByTestId(AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio)
        ).toBeVisible()

        await user.click(
          screen.getByTestId(
            `${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-nei`
          )
        )

        expect(
          screen.getByText('Du kan bare beregne AFP hvis du har en inntekt', {
            exact: false,
          })
        ).toBeVisible()
      })
      it('Skal inputfield vises når bruker har inntekt vsa afp', async () => {
        const user = userEvent.setup()
        render(
          <BeregningContext.Provider value={contextMockedValues}>
            <AvansertSkjemaForBrukereMedKap19Afp />
          </BeregningContext.Provider>,
          {
            preloadedState: {
              api: {
                // @ts-ignore
                queries: mockedQueries,
              },
              userInput: {
                ...userInputInitialState,
              },
            },
          }
        )

        expect(
          screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaAfpRadio)
        ).toBeVisible()

        await user.click(
          screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-ja`)
        )

        expect(
          screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaAfpRadio)
        ).toBeVisible()
      })
    })
  })
})

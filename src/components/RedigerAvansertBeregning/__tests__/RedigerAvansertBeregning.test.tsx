import { describe, expect, it } from 'vitest'

import { RedigerAvansertBeregning } from '../RedigerAvansertBeregning'
import { AVANSERT_FORM_NAMES } from '../utils'
import * as RedigerAvansertBeregningUtils from '../utils'
import {
  fulfilledGetPerson,
  fulfilledGetLoependeVedtak0Ufoeregrad,
  fulfilledGetLoependeVedtak75Ufoeregrad,
  fulfilledGetLoependeVedtak100Ufoeregrad,
  fulfilledGetLoependeVedtakLoependeAlderspensjon,
  fulfilledGetLoependeVedtakLoependeAlderspensjonOg40Ufoeretrygd,
} from '@/mocks/mockedRTKQueryApiCalls'
import { mockResponse } from '@/mocks/server'
import {
  BeregningContext,
  AvansertBeregningModus,
} from '@/pages/Beregning/context'
import { apiSlice } from '@/state/api/apiSlice'
import {
  userInputInitialState,
  Simulation,
} from '@/state/userInput/userInputReducer'
import { render, screen, fireEvent, userEvent } from '@/test-utils'

describe('RedigerAvansertBeregning', () => {
  const contextMockedValues = {
    avansertSkjemaModus: 'redigering' as AvansertBeregningModus,
    setAvansertSkjemaModus: vi.fn(),
    harAvansertSkjemaUnsavedChanges: false,
    setHarAvansertSkjemaUnsavedChanges: () => {},
  }

  const mockedQueries = {
    ...fulfilledGetPerson,
    ...fulfilledGetLoependeVedtak0Ufoeregrad,
  }

  it('scroller på toppen av siden når en route endrer seg', async () => {
    const scrollToMock = vi.fn()
    Object.defineProperty(global.window, 'scrollTo', {
      value: scrollToMock,
      writable: true,
    })
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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
    expect(scrollToMock).toHaveBeenCalledWith(0, 0)
  })

  it('feltene rendres riktig som default, og når brukeren legger til en gradert periode', async () => {
    const user = userEvent.setup()
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning
          gaaTilResultat={vi.fn()}
          brukerensAlderPlus1Maaned={{ aar: 64, maaneder: 5 }}
        />
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
    expect(
      screen.queryByText(
        'beregning.avansert.rediger.inntekt_frem_til_uttak.description_ufoere'
      )
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'beregning.avansert.rediger.inntekt_frem_til_uttak.label'
      )
    ).toBeVisible()
    expect(
      screen.getByText('beregning.avansert.rediger.inntekt.button')
    ).toBeVisible()
    expect(
      screen.getByText('beregning.avansert.rediger.uttaksgrad.label')
    ).toBeVisible()
    expect(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      )
    ).toBeVisible()
    expect(
      screen.getByText('beregning.read_more.pensjonsalder.label')
    ).toBeVisible()
    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttak)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      )
    ).not.toBeInTheDocument()

    // Fyller inn uttaksalder og grad slik at RadioGroup vises
    const selectAarElement = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
    )
    const optionAarElements = selectAarElement?.querySelectorAll('option')
    expect(optionAarElements?.[0].value).toBe('')
    expect(optionAarElements?.[1].value).toBe('64')

    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '64' },
      }
    )

    const selectMaanederElement = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
    )
    const optionMaanederElements =
      selectMaanederElement?.querySelectorAll('option')
    expect(optionMaanederElements?.[0].value).toBe('')
    expect(optionMaanederElements?.[1].value).toBe('5')

    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '5' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '100 %' },
      }
    )

    // Hukker av for inntekt vsa. helt uttak og viser felt for beløp og sluttalder
    const heltRadioGroup = screen.getByTestId(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio
    )
    expect(heltRadioGroup).toBeVisible()
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    )
    expect(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttak)
    ).toBeVisible()
    expect(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      )
    ).toBeVisible()

    // Velger gradert uttak
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '80 %' },
      }
    )
    expect(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
      )
    ).toBeVisible()
    const selectAarElement2 = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
    )
    const optionAarElements2 = selectAarElement2?.querySelectorAll('option')
    expect(optionAarElements2?.[0].value).toBe('')
    expect(optionAarElements2?.[1].value).toBe('64')

    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '64' },
      }
    )

    const selectMaanederElement2 = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
    )
    const optionMaanederElements2 =
      selectMaanederElement2?.querySelectorAll('option')
    expect(optionMaanederElements2?.[0].value).toBe('')
    expect(optionMaanederElements2?.[1].value).toBe('5')

    const selectAarElement3 = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
    )
    const optionAarElements3 = selectAarElement3?.querySelectorAll('option')
    expect(optionAarElements3?.[0].value).toBe('')
    expect(optionAarElements3?.[1].value).toBe('64')

    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
      ),
      {
        target: { value: '64' },
      }
    )

    const selectMaanederElement3 = screen.getByTestId(
      `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
    )
    const optionMaanederElements3 =
      selectMaanederElement3?.querySelectorAll('option')
    expect(optionMaanederElements3?.[0].value).toBe('')
    expect(optionMaanederElements3?.[1].value).toBe('5')

    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
    ).not.toBeInTheDocument()

    // Hukker av for inntekt vsa. gradert uttak og viser felt for beløp
    await user.click(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
      )
    )
    expect(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
    ).toBeVisible()
  })

  it('Readmore med tilleggsinformasjon til bruker vises riktig', async () => {
    const user = userEvent.setup()
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    expect(
      screen.getByText('inntekt.info_om_inntekt.read_more.label')
    ).toBeVisible()
    user.click(
      screen.getByText('beregning.avansert.rediger.read_more.uttaksgrad.label')
    )
    expect(
      screen.getByText(
        'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut',
        { exact: false }
      )
    ).toBeVisible()
    user.click(screen.getByText('beregning.read_more.pensjonsalder.label'))
    expect(
      screen.getByText('Aldersgrensene vil øke gradvis fra 1964-kullet', {
        exact: false,
      })
    ).toBeVisible()

    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '80 %' },
      }
    )

    user.click(screen.getByText('beregning.read_more.pensjonsalder.label'))
    expect(
      screen.getByText('Aldersgrensene vil øke gradvis fra 1964-kullet', {
        exact: false,
      })
    ).toBeVisible()
  })

  it('Når alle feltene fylles ut og resetForm kalles, nullstilles det alle feltene', async () => {
    const user = userEvent.setup()
    const { store } = render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    // Fyller ut feltene for 100 % uttak + inntekt vsa 100 % uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '67' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '2' },
      }
    )
    // Endrer uttaksgrad
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '60 %' },
      }
    )

    await user.click(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
      )
    )
    await user.type(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak),
      '100000'
    )

    // Verdien er overført til gradert uttak.
    // Fyller ut feltene for helt uttak + inntekt vsa gradert uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '70' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '6' },
      }
    )

    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    )
    const inputField = screen.getByTestId(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttak
    )
    await user.type(inputField, '1')
    await user.type(inputField, '2')
    await user.type(inputField, '3')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    await user.type(inputField, '0')

    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      ),
      { target: { value: '75' } }
    )
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
      ),
      { target: { value: '0' } }
    )

    // Sjekker at feltene er fylt ut
    expect(
      await screen.findByTestId('formatert-inntekt-frem-til-uttak')
    ).toHaveTextContent('123 000')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('67')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('2')
    expect(
      (
        screen.queryByTestId(
          AVANSERT_FORM_NAMES.inntektVsaGradertUttak
        ) as HTMLInputElement
      ).value
    ).toBe('100 000')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('70')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('6')

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
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttak)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      )
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
      )
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
      )
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
    ).not.toBeInTheDocument()

    // Fyller uttaksalder igjen
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '70' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '6' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '60 %' },
      }
    )
    // sjekker at radio knappen for gradert uttak er nullstilt
    expect(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
      )
    ).not.toBeChecked()
    expect(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`
      )
    ).not.toBeChecked()
    // Fyller uttaksalder igjen
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '73' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '3' },
      }
    )
    // sjekker at radio knappen for helt uttaker nullstilt
    expect(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    ).not.toBeChecked()
    expect(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`)
    ).not.toBeChecked()
  })

  it('Når alle feltene for 100 % uttak fylles ut og at radioknappen for inntekt endres til nei, skjules det inntekt og sluttAlder', async () => {
    const user = userEvent.setup()
    const { store } = render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    // Fyller ut feltene for 100 % uttak + inntekt vsa 100 % uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '67' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '2' },
      }
    )
    // Endrer uttaksgrad
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '100 %' },
      }
    )
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    )
    const inputField = screen.getByTestId(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttak
    )
    await user.type(inputField, '1')
    await user.type(inputField, '2')
    await user.type(inputField, '3')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      ),
      { target: { value: '72' } }
    )
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
      ),
      { target: { value: '0' } }
    )

    // Endrer radio knappen til "nei"
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`)
    )

    // Sjekker at feltene for sluttAlder er skjult
    expect(
      screen.queryByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      )
    ).not.toBeInTheDocument()

    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttak)
    ).not.toBeInTheDocument()
  })

  it('Når alle feltene for gradert uttak fylles ut og at radioknappen for inntekt endres til nei, skjules det inputfeltet for inntekt', async () => {
    const user = userEvent.setup()
    const { store } = render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    // Fyller ut feltene for 100 % uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '67' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '2' },
      }
    )

    // Endrer uttaksgrad
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '60 %' },
      }
    )

    // Verdien er overført til gradert uttak.
    // Fyller ut feltene for helt uttak + inntekt vsa gradert uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '70' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '6' },
      }
    )
    await user.click(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
      )
    )
    await user.type(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak),
      '100000'
    )

    // Endrer radio knappen til "nei"
    await user.click(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`
      )
    )

    // Sjekker at feltene er fylt ut og inputfelt for inntekt er skjult

    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('67')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('2')

    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('70')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('6')
    expect(
      screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
    ).not.toBeInTheDocument()
  })

  it('Når feltene for 100 % uttak fylles ut og uttaksalder endres til en alder større enn sluttAlder for inntekt, nullstilles det sluttAlder feltet', async () => {
    const user = userEvent.setup()
    const { store } = render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    // Fyller ut feltene for 100 % uttak + inntekt vsa 100 % uttak
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '67' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '2' },
      }
    )
    // Endrer uttaksgrad
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '100 %' },
      }
    )
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    )
    const inputField = screen.getByTestId(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttak
    )
    await user.type(inputField, '1')
    await user.type(inputField, '2')
    await user.type(inputField, '3')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
      ),
      { target: { value: '72' } }
    )
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
      ),
      { target: { value: '0' } }
    )

    // Endrer uttaksalder til en alder som er større enn sluttAlder for inntekt
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '73' },
      }
    )
    fireEvent.change(
      await screen.findByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '2' },
      }
    )

    // Sjekker at feltet for sluttAlder er nullstilt, men ikke de andre feltene

    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('73')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('2')

    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
        )) as HTMLSelectElement
      ).value
    ).toBe('')
    expect(
      (
        (await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
        )) as HTMLSelectElement
      ).value
    ).toBe('')
    expect(
      screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaHeltUttak)
    ).toHaveValue('123 000')
  })

  describe('Når uttaksgrad endres,', () => {
    it('overfører uttaksalder til gradert uttak når en grad lavere enn 100 % oppgis', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '65' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '80 %' },
        }
      )

      // Sjekker at feltene for 100 % uttak er tomme
      expect(
        (
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          ) as HTMLSelectElement
        ).value
      ).toBe('')
      expect(
        (
          screen.getByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          ) as HTMLSelectElement
        ).value
      ).toBe('')

      // Sjekker at feltene for gradert uttak har fått riktig verdi
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('65')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('5')
    })

    it('nullstiller feltene for gradert og overfører uttaksalder til helt uttak, når uttaksgrad settes tilbake til 100 %', async () => {
      const onSubmitMock = vi.spyOn(
        RedigerAvansertBeregningUtils,
        'onAvansertBeregningSubmit'
      )

      const user = userEvent.setup()
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

      // Fyller ut feltene for 100 % uttak + inntekt vsa 100 % uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '67' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '2' },
        }
      )

      // Endrer uttaksgrad
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '60 %' },
        }
      )

      // Fyller ut feltene for helt uttak + inntekt vsa gradert uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '6' },
        }
      )

      await user.click(
        screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
      )
      const inputField = screen.getByTestId(
        AVANSERT_FORM_NAMES.inntektVsaHeltUttak
      )
      await user.type(inputField, '1')
      await user.type(inputField, '2')
      await user.type(inputField, '3')
      await user.type(inputField, '0')
      await user.type(inputField, '0')
      await user.type(inputField, '0')
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
        ),
        { target: { value: '75' } }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
        ),
        { target: { value: '0' } }
      )

      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
        )
      )
      await user.type(
        screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak),
        '100000'
      )

      // Endrer uttaksgrad
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '100 %' },
        }
      )

      // Sjekker at feltene for gradert uttak er skjult
      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
      ).not.toBeInTheDocument()

      // Sjekker at uttaksalderen ble overført tilbake til helt uttak
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('67')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('2')

      await user.click(screen.getByText('beregning.avansert.button.beregn'))

      expect(onSubmitMock.mock.calls[0][4]).toStrictEqual({
        foedselsdato: '1963-04-30',
        harAvansertSkjemaUnsavedChanges: false,
        hasVilkaarIkkeOppfylt: false,
        localInntektFremTilUttak: null,
        loependeVedtak: {
          harFremtidigLoependeVedtak: false,
          ufoeretrygd: {
            grad: 0,
          },
        },
      })
    })

    it('oppdaterer uttaksgrad uten å nullstille uttaksaldere når grad endres fra en verdi lavere enn 100 % til en annen verdi lavere enn 100 %', async () => {
      const user = userEvent.setup()
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

      // Fyller ut feltene for helt uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '67' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '6' },
        }
      )

      // Endrer uttaksgrad uten å ha fylt ut noe uttaksalder
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '60 %' },
        }
      )

      // Legger til inntekt vsa gradert uttak
      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
        )
      )
      await user.type(
        screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak),
        '100000'
      )

      // Fyller ut feltene for helt uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '6' },
        }
      )

      // Endrer uttaksgrad til en annen grad (ikke 100 %)
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '40 %' },
        }
      )

      // Sjekker at uttaksalderene ikke ble endret
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('67')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('6')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('70')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('6')

      // Endrer feltene for gradert uttaksalder
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        ),
        {
          target: { value: '68' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        ),
        {
          target: { value: '6' },
        }
      )

      // Sjekker igjen at uttaksalder for hel pensjon ikke ble påvirket
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('70')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('6')
      // Sjekker igjen at inntekt vsa gradert pensjon ikke ble påvirket
      expect(
        (
          (await screen.findByTestId(
            `${AVANSERT_FORM_NAMES.inntektVsaGradertUttak}`
          )) as HTMLSelectElement
        ).value
      ).toBe('100 000')
    })

    it('Når uttaksgrad er ugyldig, håndteres den som om den var 100% og nullstiller feltene for gradert', async () => {
      const onSubmitMock = vi.spyOn(
        RedigerAvansertBeregningUtils,
        'onAvansertBeregningSubmit'
      )

      const user = userEvent.setup()
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

      // Fyller ut feltene for 100 % uttak + inntekt vsa 100 % uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '67' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '2' },
        }
      )

      // Endrer uttaksgrad
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '60 %' },
        }
      )

      // Fyller ut feltene for helt uttak + inntekt vsa gradert uttak
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
      fireEvent.change(
        await screen.findByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '6' },
        }
      )

      await user.click(
        screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
      )
      const inputField = screen.getByTestId(
        AVANSERT_FORM_NAMES.inntektVsaHeltUttak
      )
      await user.type(inputField, '1')
      await user.type(inputField, '2')
      await user.type(inputField, '3')
      await user.type(inputField, '0')
      await user.type(inputField, '0')
      await user.type(inputField, '0')
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
        ),
        { target: { value: '75' } }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-maaneder`
        ),
        { target: { value: '0' } }
      )

      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
        )
      )
      await user.type(
        screen.getByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak),
        '100000'
      )

      // Endrer uttaksgrad
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: 'noe ugyldig' },
        }
      )

      // Sjekker at feltene for gradert uttak er skjult
      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(AVANSERT_FORM_NAMES.inntektVsaGradertUttak)
      ).not.toBeInTheDocument()

      // Sjekker at uttaksalderen ble overført tilbake til helt uttak
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
          )) as HTMLSelectElement
        ).value
      ).toBe('67')
      expect(
        (
          (await screen.findByTestId(
            `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
          )) as HTMLSelectElement
        ).value
      ).toBe('2')

      await user.click(screen.getByText('beregning.avansert.button.beregn'))

      expect(onSubmitMock.mock.calls[0][4]).toStrictEqual({
        foedselsdato: '1963-04-30',
        harAvansertSkjemaUnsavedChanges: false,
        hasVilkaarIkkeOppfylt: false,
        localInntektFremTilUttak: null,
        loependeVedtak: {
          harFremtidigLoependeVedtak: false,
          ufoeretrygd: {
            grad: 0,
          },
        },
      })
    })
  })

  describe('Gitt at en bruker mottar 100 % uføretrygd', () => {
    it('vises informasjon om pensjonsalder og uføretrygd, og aldersvelgere begrenses fra ubetinget uttaksalderen', async () => {
      const user = userEvent.setup()

      const { store } = render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak100Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      await store.dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.inntekt_frem_til_uttak.description_ufoere'
        )
      ).toBeVisible()
      expect(
        await screen.findByText('omufoeretrygd.readmore.title')
      ).toBeVisible()
      await user.click(
        await screen.findByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.label'
        )
      )
      expect(
        await screen.findByText(
          'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut',
          { exact: false }
        )
      ).toBeVisible()

      const selectAarElement = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('67')
      expect(optionAarElements?.[9].value).toBe('75')

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '67' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )
      // Velger gradert uttak
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '50 %' },
        }
      )

      const selectAarElementHelt = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      )
      const optionAarElementsHelt =
        selectAarElementHelt?.querySelectorAll('option')
      expect(optionAarElementsHelt?.[0].value).toBe('')
      expect(optionAarElementsHelt?.[1].value).toBe('67')
      expect(optionAarElementsHelt?.[9].value).toBe('75')

      const selectAarElementGradert = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
      )
      const optionAarElementsGradert =
        selectAarElementGradert?.querySelectorAll('option')
      expect(optionAarElementsGradert?.[0].value).toBe('')
      expect(optionAarElementsGradert?.[1].value).toBe('67')
      expect(optionAarElementsGradert?.[9].value).toBe('75')
    })
  })

  describe('Gitt at en bruker mottar gradert uføretrygd', () => {
    it('vises informasjon om pensjonsalder og uføretrygd, og kun aldersvelgeren for 100 % uttak begrenses fra ubetinget uttaksalderen', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning
            gaaTilResultat={vi.fn()}
            brukerensAlderPlus1Maaned={{ aar: 64, maaneder: 5 }}
          />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.inntekt_frem_til_uttak.description_ufoere'
        )
      ).toBeVisible()
      expect(
        await screen.findByText('omufoeretrygd.readmore.title')
      ).toBeVisible()
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.label'
        )
      ).toBeVisible()
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.body'
        )
      ).toBeInTheDocument()

      const selectAarElement = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('64')
      expect(optionAarElements?.[12].value).toBe('75')

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )
      // Velger gradert uttak
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '20 %' },
        }
      )

      const selectAarElementHelt = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      )
      const optionAarElementsHelt =
        selectAarElementHelt?.querySelectorAll('option')
      expect(optionAarElementsHelt?.[0].value).toBe('')
      expect(optionAarElementsHelt?.[1].value).toBe('67')
      expect(optionAarElementsHelt?.[9].value).toBe('75')

      const selectAarElementGradert = screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
      )
      const optionAarElementsGradert =
        selectAarElementGradert?.querySelectorAll('option')
      expect(optionAarElementsGradert?.[0].value).toBe('')
      expect(optionAarElementsGradert?.[1].value).toBe('64')
      expect(optionAarElementsGradert?.[12].value).toBe('75')
    })

    it('vises ekstra informasjon om inntekt vsa pensjon og gradertuføretrygd når brukeren velger en alder før ubetinget uttaksalderen', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )
      // Velger gradert uttak
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '20 %' },
        }
      )

      expect(
        await screen.findByText(
          'beregning.avansert.rediger.radio.inntekt_vsa_gradert_uttak.ufoeretrygd.description'
        )
      ).toBeVisible()
      expect(
        await screen.findByText(
          'inntekt.info_om_inntekt.ufoeretrygd.read_more.label'
        )
      ).toBeVisible()
      expect(
        await screen.findByText(
          'inntekt.info_om_inntekt.ufoeretrygd.read_more.body'
        )
      ).toBeInTheDocument()
    })

    it('Når brukeren velger en alder før ubetinget uttaksalderen, begrenses valgene for uttaksgrad basert på uføregraden', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      const selectUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionUttaksgradElements =
        selectUttaksgradElement?.querySelectorAll('option')
      expect(optionUttaksgradElements?.[0].value).toBe('')
      expect(optionUttaksgradElements?.[1].value).toBe('20 %')
      expect(optionUttaksgradElements?.[6].value).toBe('100 %')
      expect(optionUttaksgradElements?.length).toBe(7)

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )

      const selectOppdatertUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionOppdatertUttaksgradElements =
        selectOppdatertUttaksgradElement?.querySelectorAll('option')
      expect(optionOppdatertUttaksgradElements?.[0].value).toBe('')
      expect(optionOppdatertUttaksgradElements?.[1].value).toBe('20 %')
      expect(optionOppdatertUttaksgradElements?.length).toBe(2)
    })

    it('Når brukeren velger uttaksgraden først og etterpå en alder før ubetinget uttaksalderen som gjør at uttaksgraden er ugyldig, begrenses ikke valgene for uttaksgrad og brukeren er informert gjennom valideringen', async () => {
      const user = userEvent.setup()
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      // Velger gradert uttak som etterhvert blir ugyldig
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '80 %' },
        }
      )

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )

      const selectUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionUttaksgradElements =
        selectUttaksgradElement?.querySelectorAll('option')
      expect(optionUttaksgradElements?.[0].value).toBe('')
      expect(optionUttaksgradElements?.[1].value).toBe('20 %')
      expect(optionUttaksgradElements?.[6].value).toBe('100 %')
      expect(optionUttaksgradElements?.length).toBe(7)

      // Fyller ut de andre påkrevde feltene
      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`
        )
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
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
          `${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`
        )
      )

      await user.click(screen.getByText('beregning.avansert.button.beregn'))

      // Feilmelding for ugyldig uttaksgrad
      expect(
        screen.getByText(
          'beregning.avansert.rediger.uttaksgrad.ufoeretrygd.validation_error'
        )
      ).toBeVisible()
    })

    it('Når brukeren velger en alder etter ubetinget uttaksalderen med en uttaksgrad og endrer til en alder før ubetinget uttaksalderen som gjør at uttaksgraden blir ugyldig, begrenses ikke valgene for uttaksgrad og brukeren er informert gjennom valideringen', async () => {
      const user = userEvent.setup()
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )

      // Velger gradert uttak som etterhvert blir ugyldig
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '80 %' },
        }
      )

      // Endrer uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )

      const selectUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionUttaksgradElements =
        selectUttaksgradElement?.querySelectorAll('option')
      expect(optionUttaksgradElements?.[0].value).toBe('')
      expect(optionUttaksgradElements?.[1].value).toBe('20 %')
      expect(optionUttaksgradElements?.[6].value).toBe('100 %')
      expect(optionUttaksgradElements?.length).toBe(7)

      // Fyller ut de andre påkrevde feltene
      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`
        )
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )
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
          `${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`
        )
      )

      await user.click(screen.getByText('beregning.avansert.button.beregn'))

      // Feilmelding for ugyldig uttaksgrad
      expect(
        screen.getByText(
          'beregning.avansert.rediger.uttaksgrad.ufoeretrygd.validation_error'
        )
      ).toBeVisible()
    })

    it('Når brukeren velger en alder før ubetinget uttaksalderen så en avgrenset uttaksgrad så velger en uttaksalder etter ubetinget uttaksalderen, nullstilles uttaksgraden', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtak75Ufoeregrad,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      // Fyller ut uttaksalder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '64' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '5' },
        }
      )

      // Velger avgrenset uttaksgrad
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '20 %' },
        }
      )

      const selectUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionUttaksgradElements =
        selectUttaksgradElement?.querySelectorAll('option')
      expect(optionUttaksgradElements?.length).toBe(2)

      // Endrer uttaksalder for gradert uttak med noe høyere alder
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        ),
        {
          target: { value: '70' },
        }
      )

      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-aar`
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderGradertUttak}-maaneder`
        )
      ).not.toBeInTheDocument()

      const selectOppdatertUttaksgradElement = screen.getByTestId(
        AVANSERT_FORM_NAMES.uttaksgrad
      )
      const optionOppdatertUttaksgradElements =
        selectOppdatertUttaksgradElement?.querySelectorAll('option')
      expect(optionOppdatertUttaksgradElements?.[0].value).toBe('')
      expect(optionOppdatertUttaksgradElements?.[1].value).toBe('20 %')
      expect(optionOppdatertUttaksgradElements?.[6].value).toBe('100 %')
      expect(optionOppdatertUttaksgradElements?.length).toBe(7)
    })
  })

  it('Når brukeren klikker på beregn med ugyldige felter, vises det feilmeldinger og fokus flyttes til riktig felt', async () => {
    const user = userEvent.setup()
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
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

    await user.click(screen.getByText('beregning.avansert.button.beregn'))
    // Feilmelding for uttaksalder for 100% uttak
    expect(
      screen.getByText('agepicker.validation_error.aar', {
        exact: false,
      })
    ).toBeVisible()
    // Feilmelding for uttaksgrad
    expect(
      screen.getByText(
        'beregning.avansert.rediger.uttaksgrad.validation_error',
        {
          exact: false,
        }
      )
    ).toBeVisible()
    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      `${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
    )

    // Fyller inn uttaksalder slik at RadioGroup vises
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '65' },
      }
    )
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '5' },
      }
    )

    // Velger gradert uttak
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '100 %' },
      }
    )

    await user.click(screen.getByText('beregning.avansert.button.beregn'))
    // Feilmelding for radioknapp inntekt vsa 100 % uttak
    expect(
      screen.getByText('Du må svare på om du forventer å ha inntekt samtidig', {
        exact: false,
      })
    ).toBeVisible()
    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio
    )

    // Hukker av for inntekt vsa. gradert uttak og viser felt for beløp
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-ja`)
    )
    await user.click(screen.getByText('beregning.avansert.button.beregn'))
    // Feilmelding for inntekt vsa 100 % uttak
    expect(
      screen.getByText(
        'Du må fylle ut forventet inntekt samtidig som du tar ut',
        {
          exact: false,
        }
      )
    ).toBeVisible()
    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttak
    )

    // Fylle ut inntekt vsa 100 % uttak
    const inputField = screen.getByTestId(
      AVANSERT_FORM_NAMES.inntektVsaHeltUttak
    )
    await user.type(inputField, '1')
    await user.type(inputField, '2')
    await user.type(inputField, '3')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    await user.type(inputField, '0')
    await user.click(screen.getByText('beregning.avansert.button.beregn'))
    // Feilmelding for sluttAlder for inntekt vsa 100 % uttak
    expect(
      screen.getByText('agepicker.validation_error.aar', {
        exact: false,
      })
    ).toBeVisible()
    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      `${AVANSERT_FORM_NAMES.inntektVsaHeltUttakSluttAlder}-aar`
    )

    // Hukker av nei for inntekt vsa. helt uttak og skjuler feltene
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`)
    )

    // Velger gradert uttak
    fireEvent.change(
      await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
      {
        target: { value: '80 %' },
      }
    )

    await user.click(screen.getByText('beregning.avansert.button.beregn'))

    // Feilmelding for uttaksalder for 100% uttak
    expect(
      screen.getByText('agepicker.validation_error.aar', {
        exact: false,
      })
    ).toBeVisible()

    // fyller ut 100 % uttaksalder
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
      ),
      {
        target: { value: '67' },
      }
    )
    fireEvent.change(
      screen.getByTestId(
        `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
      ),
      {
        target: { value: '5' },
      }
    )
    // Hukker av nei for inntekt vsa. gradert uttak
    await user.click(
      screen.getByTestId(`${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`)
    )

    await user.click(screen.getByText('beregning.avansert.button.beregn'))

    // Feilmelding radioknapp for inntekt vsa gradert
    expect(
      screen.getByText(
        'Du må svare på om du forventer å ha inntekt samtidig som du tar ut',
        {
          exact: false,
        }
      )
    ).toBeVisible()
    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio
    )

    // Hukker av ja for inntekt vsa. gradert uttak
    await user.click(
      screen.getByTestId(
        `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`
      )
    )
    await user.click(screen.getByText('beregning.avansert.button.beregn'))

    // Feilmelding for inntekt vsa gradert uttak
    expect(
      screen.getByText(
        'Du må fylle ut forventet inntekt samtidig som du tar ut',
        { exact: false }
      )
    ).toBeVisible()

    expect((document.activeElement as HTMLElement).getAttribute('name')).toBe(
      AVANSERT_FORM_NAMES.inntektVsaGradertUttak
    )
  })

  describe('Gitt at en bruker har vedtak om alderspensjon', () => {
    it('Når brukeren har fylt alle feltene riktig og klikker på beregn mens datoen på vedtaket er mindre enn 12 md. til ønsket uttak, vises det alert og siden scrolles opp til toppen', async () => {
      const user = userEvent.setup()

      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning gaaTilResultat={vi.fn()} />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              queries: {
                ...fulfilledGetPerson,
                ['getLoependeVedtak(undefined)']: {
                  // @ts-ignore
                  status: 'fulfilled',
                  endpointName: 'getLoependeVedtak',
                  requestId: 'xTaE6mOydr5ZI75UXq4Wi',
                  startedTimeStamp: 1688046411971,
                  data: {
                    alderspensjon: {
                      grad: 100,
                      fom: new Date().toLocaleDateString('en-CA'), // dette gir dato i format yyyy-mm-dd
                    },
                    ufoeretrygd: {
                      grad: 0,
                    },
                    harFremtidigLoependeVedtak: false,
                  },
                  fulfilledTimeStamp: 1688046412103,
                },
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      // Fyller inn uttaksalder slik at RadioGroup vises
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '62' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '0' },
        }
      )

      // Velger gradert uttak
      fireEvent.change(
        await screen.findByTestId(AVANSERT_FORM_NAMES.uttaksgrad),
        {
          target: { value: '40 %' },
        }
      )

      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`
        )
      )

      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-aar`
        ),
        {
          target: { value: '65' },
        }
      )
      fireEvent.change(
        screen.getByTestId(
          `age-picker-${AVANSERT_FORM_NAMES.uttaksalderHeltUttak}-maaneder`
        ),
        {
          target: { value: '0' },
        }
      )

      await user.click(
        screen.getByTestId(
          `${AVANSERT_FORM_NAMES.inntektVsaHeltUttakRadio}-nei`
        )
      )

      await user.click(
        screen.getByText('beregning.avansert.button.beregn.endring')
      )

      expect(
        screen.getByText(
          'Du kan tidligst endre uttaksgrad til 20, 40, 50, 60 eller 80 % fra',
          {
            exact: false,
          }
        )
      ).toBeVisible()
    })
  })

  describe('Når simuleringen svarer med vilkaarIkkeOppfylt', () => {
    it('viser alert med informasjon om alternativer', async () => {
      const vilkaarsproevingMock = {
        vilkaarErOppfylt: false,
        alternativ: {
          heltUttaksalder: { aar: 67, maaneder: 0 },
        },
      }

      mockResponse('/v8/alderspensjon/simulering', {
        status: 200,
        method: 'post',
        json: {
          alderspensjon: [],
          vilkaarsproeving: vilkaarsproevingMock,
          harForLiteTrygdetid: false,
        },
      })

      const currentSimulation: Simulation = {
        utenlandsperioder: [],
        formatertUttaksalderReadOnly: '62 år string.og 0 alder.maaned',
        uttaksalder: { aar: 62, maaneder: 0 },
        aarligInntektFoerUttakBeloep: null,
        gradertUttaksperiode: null,
      }

      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning
            gaaTilResultat={vi.fn()}
            vilkaarsproeving={vilkaarsproevingMock}
          />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: { ...mockedQueries },
            },
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )
      expect(
        screen.getByText('beregning.vilkaarsproeving.intro', { exact: false })
      ).toBeVisible()
    })
  })

  describe('Gitt at en bruker har vedtak om alderspensjon', () => {
    it('vises informasjon om vedtaket', async () => {
      render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning
            gaaTilResultat={vi.fn()}
            brukerensAlderPlus1Maaned={{ aar: 64, maaneder: 5 }}
          />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtakLoependeAlderspensjon,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      expect(
        await screen.findByText('beregning.endring.rediger.title')
      ).toBeVisible()
      expect(
        await screen.findByText(
          'Fra 02.10.2020 har du mottatt 100 % alderspensjon.'
        )
      ).toBeVisible()
    })

    it('vises det riktig label på feltene', async () => {
      const { store } = render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning
            gaaTilResultat={vi.fn()}
            brukerensAlderPlus1Maaned={{ aar: 64, maaneder: 5 }}
          />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtakLoependeAlderspensjon,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      await store.dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.inntekt_frem_til_endring.label'
        )
      ).toBeVisible()
      expect(
        screen.queryByText(
          'beregning.avansert.rediger.inntekt_frem_til_uttak.label'
        )
      ).not.toBeInTheDocument()

      expect(
        await screen.findByText('velguttaksalder.endring.title')
      ).toBeVisible()
      expect(
        screen.queryByText('velguttaksalder.title')
      ).not.toBeInTheDocument()

      expect(
        await screen.findByText(
          'beregning.avansert.rediger.uttaksgrad.endring.description'
        )
      ).toBeVisible()
      expect(
        screen.queryByText('beregning.avansert.rediger.uttaksgrad.description')
      ).not.toBeInTheDocument()

      expect(
        await screen.findByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.endring.body'
        )
      ).toBeVisible()
      expect(
        screen.queryByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.body'
        )
      ).not.toBeInTheDocument()
    })

    it('Når brukeren har gradert uføretrygd, vises det riktig label på feltene', async () => {
      const user = userEvent.setup()

      const { asFragment, store } = render(
        <BeregningContext.Provider
          value={{
            ...contextMockedValues,
          }}
        >
          <RedigerAvansertBeregning
            gaaTilResultat={vi.fn()}
            brukerensAlderPlus1Maaned={{ aar: 64, maaneder: 5 }}
          />
        </BeregningContext.Provider>,
        {
          preloadedState: {
            api: {
              // @ts-ignore
              queries: {
                ...fulfilledGetPerson,
                ...fulfilledGetLoependeVedtakLoependeAlderspensjonOg40Ufoeretrygd,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      await store.dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
      expect(
        await screen.findByText(
          'beregning.avansert.rediger.inntekt_frem_til_endring.label'
        )
      ).toBeVisible()
      expect(asFragment()).toMatchSnapshot()
      await user.click(
        await screen.findByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.label'
        )
      )
      expect(await screen.findByTestId('om-uttaksgrad')).toMatchInlineSnapshot(`
        <p
          class="navds-body-long navds-body-long--medium"
          data-testid="om-uttaksgrad"
        >
          Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Grad av uføretrygd og alderspensjon kan til sammen ikke overstige 100 %. Fra 67 år kan du fritt velge gradert uttak (20, 40, 50, 60 eller 80 %), eller hel alderspensjon (100 %).
          <br />
          <br />
          Hvis du vil endre gradering må det ha gått minimum 12 måneder siden du startet uttak av alderspensjon eller endret uttaksgrad. Du kan likevel endre til 0 % når du vil.
        </p>
      `)

      expect(
        screen.queryByText(
          'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.body'
        )
      ).not.toBeInTheDocument()
    })
  })
})

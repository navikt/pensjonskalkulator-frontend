import { describe, expect, it } from 'vitest'

import { RedigerAvansertBeregning } from '..'
import { AVANSERT_FORM_NAMES } from '../../utils'
import * as AvansertSkjemaForBrukereMedGradertUfoeretrygdUtils from '../../utils'
import {
  fulfilledGetPerson,
  fulfilledGetLoependeVedtak0Ufoeregrad,
  fulfilledGetLoependeVedtak75Ufoeregrad,
  fulfilledGetLoependeVedtak100Ufoeregrad,
  fulfilledGetLoependeVedtakLoependeAlderspensjon,
  fulfilledGetLoependeVedtakLoependeAlderspensjonOg40Ufoeretrygd,
  fulfilledGetLoependeVedtakLoepende0Alderspensjon100Ufoeretrygd,
  fulfilledGetPersonMedOekteAldersgrenser,
} from '@/mocks/mockedRTKQueryApiCalls'
import { mockResponse } from '@/mocks/server'
import {
  BeregningContext,
  AvansertBeregningModus,
} from '@/pages/Beregning/context'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen } from '@/test-utils'

describe('RedigerAvansertBeregning', () => {
  const contextMockedValues = {
    avansertSkjemaModus: 'redigering' as AvansertBeregningModus,
    setAvansertSkjemaModus: vi.fn(),
    harAvansertSkjemaUnsavedChanges: false,
    setHarAvansertSkjemaUnsavedChanges: () => {},
  }

  it('rendrer riktig skjema for brukere uten uføretrygd', async () => {
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning />
      </BeregningContext.Provider>,
      {
        preloadedState: {
          api: {
            // @ts-ignore
            queries: {
              ...fulfilledGetPerson,
              ...fulfilledGetLoependeVedtak0Ufoeregrad,
            },
          },
          userInput: {
            ...userInputInitialState,
          },
        },
      }
    )
    expect(
      screen.getByTestId(`AVANSERT_SKJEMA_FOR_ANDRE_BRUKERE`)
    ).toBeVisible()
  })

  it('rendrer riktig skjema for brukere med gradert uføretrygd', async () => {
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning />
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
      screen.getByTestId(`AVANSERT_SKJEMA_FOR_BRUKERE_MED_GRADERT_UFOERETRYGD`)
    ).toBeVisible()
  })

  it('rendrer riktig skjema for brukere med 100 % uføretrygd', async () => {
    render(
      <BeregningContext.Provider
        value={{
          ...contextMockedValues,
        }}
      >
        <RedigerAvansertBeregning />
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
    expect(
      screen.getByTestId(`AVANSERT_SKJEMA_FOR_ANDRE_BRUKERE`)
    ).toBeVisible()
  })
})

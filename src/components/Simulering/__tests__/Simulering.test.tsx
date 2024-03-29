import { describe, it, vi } from 'vitest'

import alderspensjonData from '../../../mocks/data/alderspensjon/67.json' assert { type: 'json' }
import { Simulering } from '../Simulering'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import * as apiSliceUtils from '@/state/api/apiSlice'
import {
  userInputInitialState,
  Simulation,
} from '@/state/userInput/userInputReducer'
import { act, render, screen, waitFor } from '@/test-utils'

describe('Simulering', () => {
  const currentSimulation: Simulation = {
    formatertUttaksalderReadOnly: '67 år string.og 0 alder.maaned',
    uttaksalder: { aar: 67, maaneder: 0 },
    aarligInntektFoerUttakBeloep: 0,
    gradertUttaksperiode: null,
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Gitt at brukeren IKKE samtykker', () => {
    it('Når alderspensjon laster så vises det en spinner', async () => {
      const { container } = render(
        <Simulering
          isLoading={true}
          aarligInntektFoerUttakBeloep={0}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()

      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      expect(
        container.getElementsByClassName('highcharts-loading')
      ).toHaveLength(1)
    })

    it('Når brukeren ikke velger AFP, viser kun inntekt og alderspensjon', async () => {
      const usePensjonsavtalerQueryMock = vi.spyOn(
        apiSliceUtils,
        'usePensjonsavtalerQuery'
      )
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()
      expect(usePensjonsavtalerQueryMock.mock.calls[0][1]).toEqual({
        skip: true,
      })
      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      const legendItems = container.getElementsByClassName(
        'highcharts-legend-item'
      )
      const SVGlegendItems = Array.from(legendItems).filter(
        (item) => item.tagName === 'g'
      )
      expect(SVGlegendItems).toHaveLength(2)
    })

    it('Når brukeren velger AFP-privat, viser inntekt, alderspensjon og AFP', async () => {
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={true}
          showButtonsAndTable={true}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              afp: 'ja_privat',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()
      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      const legendItems = container.getElementsByClassName(
        'highcharts-legend-item'
      )
      const SVGlegendItems = Array.from(legendItems).filter(
        (item) => item.tagName === 'g'
      )
      expect(SVGlegendItems).toHaveLength(3)
    })

    it('Når brukeren velger uttaksagrad 67 år, vises årene i grafen fra 66 år til 77+', async () => {
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()

      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      const xAxisLabels = container
        .getElementsByClassName('highcharts-xaxis-labels')[0]
        .querySelectorAll('text')
      expect(xAxisLabels).toHaveLength(13)
      expect(xAxisLabels[0]).toHaveTextContent('66')
      expect(xAxisLabels[12]).toHaveTextContent('77+')
    })

    it('Når brukeren velger gradert pensjon med uttaksgrad 62 år, vises årene i grafen fra 61 år til 77+', async () => {
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: false,
              currentSimulation: {
                ...currentSimulation,
                gradertUttaksperiode: {
                  grad: 40,
                  uttaksalder: { aar: 62, maaneder: 0 },
                },
              },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()

      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      const xAxisLabels = container
        .getElementsByClassName('highcharts-xaxis-labels')[0]
        .querySelectorAll('text')
      expect(xAxisLabels).toHaveLength(18)
      expect(xAxisLabels[0]).toHaveTextContent('61')
      expect(xAxisLabels[17]).toHaveTextContent('77+')
    })
  })

  describe('Gitt at brukeren samtykker', () => {
    it('Når brukeren velger uten AFP, henter og viser inntekt, alderspensjon, AFP og pensjonsavtaler', async () => {
      const usePensjonsavtalerQueryMock = vi.spyOn(
        apiSliceUtils,
        'usePensjonsavtalerQuery'
      )
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'nei',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )
      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()
      expect(usePensjonsavtalerQueryMock).toHaveBeenLastCalledWith(
        {
          aarligInntektFoerUttakBeloep: 500000,
          harAfp: false,
          sivilstand: undefined,
          uttaksperioder: [
            {
              startAlder: { aar: 67, maaneder: 0 },
              aarligInntektVsaPensjon: undefined,
              grad: 100,
            },
          ],
        },
        { skip: false }
      )

      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })
      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      const legendContainer =
        container.getElementsByClassName('highcharts-legend')
      const legendItems = (
        legendContainer[0] as HTMLElement
      ).getElementsByClassName('highcharts-legend-item')
      expect(legendItems).toHaveLength(3)
      expect(
        screen.queryByText('beregning.highcharts.serie.afp.name')
      ).not.toBeInTheDocument()
      expect(
        screen.getByText('beregning.highcharts.serie.inntekt.name')
      ).toBeVisible()
      expect(
        screen.getByText('beregning.highcharts.serie.alderspensjon.name')
      ).toBeVisible()
      expect(
        screen.getByText('beregning.highcharts.serie.tp.name')
      ).toBeVisible()
    })

    it('Når brukeren velger AFP-privat, henter og viser inntekt, alderspensjon, AFP og pensjonsavtaler', async () => {
      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={true}
          showButtonsAndTable={true}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'ja_privat',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      expect(await screen.findByTestId('highcharts-done-drawing')).toBeVisible()
      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      const legendContainer =
        container.getElementsByClassName('highcharts-legend')
      const legendItems = (
        legendContainer[0] as HTMLElement
      ).getElementsByClassName('highcharts-legend-item')
      expect(legendItems).toHaveLength(4)
    })

    it('Når brukeren har 0 pensjonsavtaler', async () => {
      mockResponse('/v2/pensjonsavtaler', {
        status: 200,
        json: {
          avtaler: [],
          utilgjengeligeSelskap: [],
        },
        method: 'post',
      })

      const { container } = render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={500000}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={true}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'nei',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )

      await waitFor(async () => {
        expect(
          await screen.findByTestId('highcharts-done-drawing')
        ).toBeVisible()
      })
      // Nødvendig for at animasjonen rekker å bli ferdig
      await act(async () => {
        await new Promise((r) => setTimeout(r, 500))
      })

      expect(
        container.getElementsByClassName('highcharts-container')
      ).toHaveLength(1)
      const legendContainer =
        container.getElementsByClassName('highcharts-legend')
      const legendItems = (
        legendContainer[0] as HTMLElement
      ).getElementsByClassName('highcharts-legend-item')
      expect(legendItems).toHaveLength(2)
    })

    it('Når brukeren har en pensjonsavtale som begynner før uttaksalderen, viser infomelding om pensjonsavtaler', async () => {
      mockResponse('/v2/pensjonsavtaler', {
        status: 200,
        json: {
          avtaler: [
            {
              produktbetegnelse: 'Storebrand',
              kategori: 'PRIVAT_TJENESTEPENSJON',
              startAar: 62,
              sluttAar: 71,
              utbetalingsperioder: [
                {
                  startAlder: { aar: 62, maaneder: 0 },
                  sluttAlder: { aar: 71, maaneder: 11 },
                  aarligUtbetaling: 31298,
                  grad: 100,
                },
              ],
            },
          ],
          utilgjengeligeSelskap: [],
        },
        method: 'post',
      })

      render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={0}
          alderspensjon={alderspensjonData}
          showAfp={false}
          showButtonsAndTable={true}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              currentSimulation: {
                ...currentSimulation,
                aarligInntektFoerUttakBeloep: 500000,
              },
            },
          },
        }
      )

      expect(
        await screen.findByText('beregning.pensjonsavtaler.info')
      ).toBeVisible()
    })

    it('Når brukeren har samtykket og pensjonsavtaler feiler, vises det riktig feilmelding', async () => {
      mockErrorResponse('/v2/pensjonsavtaler', {
        status: 500,
        json: "Beep boop I'm an error!",
        method: 'post',
      })
      render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={0}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'nei',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )
      expect(
        await screen.findByText('beregning.pensjonsavtaler.error', {
          exact: false,
        })
      ).toBeVisible()
    })

    it('Når brukeren har samtykket og pensjonsavtaler kommer med utilgjengelig selskap, vises det riktig feilmelding', async () => {
      mockResponse('/v2/pensjonsavtaler', {
        status: 200,
        json: {
          avtaler: [
            {
              produktbetegnelse: 'Oslo Pensjonsforsikring (livsvarig eksempel)',
              kategori: 'OFFENTLIG_TJENESTEPENSJON',
              startAar: 69,
              utbetalingsperioder: [
                {
                  startAlder: { aar: 69, maaneder: 0 },
                  aarligUtbetaling: 175000,
                  grad: 100,
                },
              ],
            },
          ],
          utilgjengeligeSelskap: ['Something'],
        },
        method: 'post',
      })
      render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={0}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'nei',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )
      expect(
        await screen.findByText('beregning.pensjonsavtaler.error.partial')
      ).toBeVisible()
    })

    it('Når brukeren har samtykket, har ingen pensjonsavtale men har utilgjengelig selskap, vises det riktig feilmelding som sender til Grunnlag', async () => {
      mockResponse('/v2/pensjonsavtaler', {
        status: 200,
        json: {
          avtaler: [],
          utilgjengeligeSelskap: ['Something'],
        },
        method: 'post',
      })
      render(
        <Simulering
          isLoading={false}
          aarligInntektFoerUttakBeloep={0}
          showAfp={false}
          showButtonsAndTable={false}
        />,
        {
          preloadedState: {
            userInput: {
              ...userInputInitialState,
              samtykke: true,
              afp: 'nei',
              currentSimulation: { ...currentSimulation },
            },
          },
        }
      )
      expect(
        await screen.findByText('beregning.pensjonsavtaler.error')
      ).toBeVisible()
    })
  })

  it('viser tabell og skjuler grafen for skjermlesere', async () => {
    render(
      <Simulering
        isLoading={false}
        showAfp={true}
        showButtonsAndTable={true}
        aarligInntektFoerUttakBeloep={500000}
      />,
      {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            samtykke: true,
            currentSimulation: { ...currentSimulation },
          },
        },
      }
    )
    expect(await screen.findByText('beregning.tabell.vis')).toBeVisible()
    const highChartsWrapper = await screen.findByTestId(
      'highcharts-aria-wrapper'
    )
    waitFor(() => {
      expect(highChartsWrapper.getAttribute('aria-hidden')).toBe('true')
    })
  })

  it('setter aria-hidden attribute iht feature toggle', async () => {
    mockResponse(
      '/feature/pensjonskalkulator.enable-highcharts-accessibility-plugin',
      {
        status: 200,
        json: { enabled: true },
      }
    )

    render(
      <Simulering
        isLoading={false}
        aarligInntektFoerUttakBeloep={0}
        showAfp={true}
        showButtonsAndTable={true}
      />,
      {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            samtykke: true,
            currentSimulation: { ...currentSimulation },
          },
        },
      }
    )
    waitFor(async () => {
      const highchartsWrapper = await screen.findByTestId(
        'highcharts-aria-wrapper'
      )
      expect(highchartsWrapper.getAttribute('aria-hidden')).toBe('false')
    })
  })
})

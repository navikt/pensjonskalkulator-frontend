import { describe, expect, it, vi } from 'vitest'

import { Beregning } from '../Beregning'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import * as apiSliceUtils from '@/state/api/apiSlice'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import {
  render,
  screen,
  swallowErrorsAsync,
  userEvent,
  waitFor,
} from '@/test-utils'

describe('Beregning', () => {
  it('har riktig sidetittel', () => {
    render(<Beregning />)
    expect(document.title).toBe('application.title.beregning')
  })

  it('viser loading og deretter riktig header, tekst og knapper', async () => {
    const result = render(<Beregning />)
    expect(screen.getByTestId('loader')).toBeVisible()
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('tidligst-mulig-uttak')).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(screen.getAllByRole('button')).toHaveLength(12)
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('viser ikke info om tidligst mulig uttaksalder når kallet feiler, og resten av siden er som vanlig', async () => {
    mockErrorResponse('/tidligste-uttaksalder', {
      status: 500,
      json: "Beep boop I'm an error!",
      method: 'post',
    })

    const result = render(<Beregning />)

    await waitFor(() => {
      expect(
        screen.queryByTestId('tidligst-mulig-uttak')
      ).not.toBeInTheDocument()
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  describe('Når brukeren velger uttaksalder', () => {
    it('oppdaterer valgt knapp og tegner graph', async () => {
      const user = userEvent.setup()
      const { container } = render(<Beregning />)
      const button = await screen.findByText('68 år')
      await user.click(button)
      expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
        '68 år'
      )
      expect(
        container.getElementsByClassName('highcharts-container').length
      ).toBe(1)
    })

    it('henter ikke pensjonsavtaler når brukeren ikke har samtykket', async () => {
      const user = userEvent.setup()
      const initiateMock = vi.spyOn(
        apiSliceUtils.apiSlice.endpoints.getTpoMedlemskap,
        'initiate'
      )
      render(<Beregning />, {
        preloadedState: {
          userInput: { ...userInputInitialState, samtykke: false },
        },
      })
      const button = await screen.findByText('68 år')
      await user.click(button)
      expect(initiateMock).not.toHaveBeenCalled()
    })

    it('henter pensjonsavtaler med riktig år og måned og viser dem når brukeren har samtykket', async () => {
      const usePensjonsavtalerQueryMock = vi.spyOn(
        apiSliceUtils,
        'usePensjonsavtalerQuery'
      )
      const user = userEvent.setup()
      render(<Beregning />, {
        preloadedState: {
          userInput: {
            ...userInputInitialState,
            samtykke: true,
          },
        },
      })

      const buttons = await screen.findAllByRole('button')
      expect(buttons).toHaveLength(12)
      await user.click(buttons[2])
      await waitFor(async () => {
        expect(await screen.findByTestId('pensjonsavtaler')).toBeInTheDocument()
        expect(usePensjonsavtalerQueryMock.mock?.lastCall?.[0]).toEqual({
          antallInntektsaarEtterUttak: 0,
          uttaksperioder: [
            {
              startAlder: 68,
              startMaaned: 1,
              aarligInntekt: 0,
              grad: 100,
            },
          ],
        })
      })
      await user.click(buttons[1])
      await waitFor(async () => {
        expect(usePensjonsavtalerQueryMock.mock?.lastCall?.[0]).toEqual({
          antallInntektsaarEtterUttak: 0,
          uttaksperioder: [
            {
              startAlder: 67,
              startMaaned: 3,
              aarligInntekt: 0,
              grad: 100,
            },
          ],
        })
      })
    })

    it('henter pensjonsavtaler og viser riktig feilmelding ved feil', async () => {
      const user = userEvent.setup()
      mockErrorResponse('/pensjonsavtaler', {
        status: 500,
        json: "Beep boop I'm an error!",
        method: 'post',
      })
      render(<Beregning />, {
        preloadedState: {
          userInput: { ...userInputInitialState, samtykke: true },
        },
      })
      const button = await screen.findByText('68 år')
      await user.click(button)

      await waitFor(async () => {
        expect(
          await screen.findByText(
            'Vi klarte ikke å hente pensjonsavtalene dine fra Norsk Pensjon. Prøv igjen senere.'
          )
        ).toBeVisible()
      })
    })
  })
})

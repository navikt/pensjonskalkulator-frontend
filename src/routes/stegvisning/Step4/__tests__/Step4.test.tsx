import * as ReactRouterUtils from 'react-router'

import { describe, it, vi } from 'vitest'

import { Step4 } from '..'
import * as Step4Utils from '../utils'
import { mockResponse, mockErrorResponse } from '@/mocks/server'
import { userInputInitialState } from '@/state/userInput/userInputReducer'
import { screen, render, userEvent, waitFor } from '@/test-utils'
import { paths } from '@/routes'

describe('Step 4', () => {
  it('rendrer Step 4 slik den skal når brukeren har svart nei på spørsmålet om samtykke,', async () => {
    render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: false },
      },
    })

    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it('rendrer Step 4 slik den skal når brukeren har svart ja på spørsmålet om samtykke,', async () => {
    render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true },
      },
    })

    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it('registrerer afp og samboerskap og navigerer videre til beregning når brukeren velger afp og klikker på Neste (gitt at brukeren har samboer)', async () => {
    const user = userEvent.setup()
    mockResponse('/person', {
      status: 200,
      json: { fornavn: 'Ola', sivilstand: 'GIFT' },
    })
    const checkHarSamboerMock = vi.spyOn(Step4Utils, 'checkHarSamboer')
    const nesteSideMock = vi.spyOn(Step4Utils, 'getNesteSide')
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const { store } = render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true },
      },
    })

    const radioButtons = await screen.findAllByRole('radio')
    await user.click(radioButtons[0])
    await user.click(screen.getByText('stegvisning.neste'))
    expect(store.getState().userInput.afp).toBe('ja_offentlig')
    expect(checkHarSamboerMock).toHaveBeenCalledWith('GIFT')
    expect(nesteSideMock).toHaveBeenCalledWith(true)
    expect(navigateMock).toHaveBeenCalledWith(paths.beregning)
    expect(store.getState().userInput.samboer).toBe(true)
  })

  it('registrerer afp og navigerer videre til steg 5 når brukeren velger afp og klikker på Neste (gitt at brukeren ikke har samboer)', async () => {
    const user = userEvent.setup()
    const checkHarSamboerMock = vi.spyOn(Step4Utils, 'checkHarSamboer')
    const nesteSideMock = vi.spyOn(Step4Utils, 'getNesteSide')
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const { store } = render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true },
      },
    })
    await waitFor(async () => {
      const radioButtons = screen.getAllByRole('radio')
      await user.click(radioButtons[0])
      await user.click(screen.getByText('stegvisning.neste'))
      expect(store.getState().userInput.afp).toBe('ja_offentlig')
      expect(checkHarSamboerMock).toHaveBeenCalledWith('UGIFT')
      expect(nesteSideMock).toHaveBeenCalledWith(false)
      expect(navigateMock).toHaveBeenCalledWith(paths.sivilstand)
    })
  })

  it('registrerer afp og navigerer videre til steg 5 når brukeren velger afp og klikker på Neste (gitt at kall til /person feiler)', async () => {
    const user = userEvent.setup()
    mockErrorResponse('/person')
    const nesteSideMock = vi.spyOn(Step4Utils, 'getNesteSide')
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const { store } = render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true },
      },
    })

    const radioButtons = await screen.findAllByRole('radio')
    await user.click(radioButtons[0])
    await user.click(screen.getByText('stegvisning.neste'))
    expect(store.getState().userInput.afp).toBe('ja_offentlig')
    expect(nesteSideMock).toHaveBeenCalledWith(null)
    expect(navigateMock).toHaveBeenCalledWith(paths.sivilstand)
  })

  it('sender tilbake til steg 2 når brukeren ikke har tpo-medlemskap og klikker på Tilbake', async () => {
    const user = userEvent.setup()
    mockResponse('/tpo-medlemskap', {
      status: 200,
      json: { harTjenestepensjonsforhold: false },
    })
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    render(<Step4 />)

    await user.click(await screen.findByText('stegvisning.tilbake'))
    expect(navigateMock).toHaveBeenCalledWith(paths.samtykke)
  })

  it('sender tilbake til steg 3 når brukeren har tpo medlemskap og klikker på Tilbake', async () => {
    const user = userEvent.setup()
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true },
      },
    })
    await waitFor(async () => {
      await user.click(screen.getByText('stegvisning.tilbake'))
      expect(navigateMock).toHaveBeenCalledWith(paths.offentligTp)
    })
  })

  it('nullstiller input fra brukeren og redirigerer til landingssiden når brukeren klikker på Avbryt', async () => {
    const user = userEvent.setup()
    const navigateMock = vi.fn()
    vi.spyOn(ReactRouterUtils, 'useNavigate').mockImplementation(
      () => navigateMock
    )
    const { store } = render(<Step4 />, {
      preloadedState: {
        userInput: { ...userInputInitialState, samtykke: true, afp: 'nei' },
      },
    })

    await user.click(await screen.findByText('stegvisning.avbryt'))
    expect(navigateMock).toHaveBeenCalledWith(paths.root)
    expect(store.getState().userInput.samtykke).toBe(null)
    expect(store.getState().userInput.afp).toBe(null)
  })
})

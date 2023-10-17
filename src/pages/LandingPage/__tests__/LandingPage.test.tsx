import { describe, it, vi } from 'vitest'

import { LandingPage } from '..'
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { HOST_BASEURL } from '@/paths'
import { externalUrls } from '@/router'
import { render, screen, userEvent, waitFor } from '@/test-utils'

describe('LandingPage', () => {
  it('har riktig sidetittel', () => {
    render(<LandingPage />)
    expect(document.title).toBe('application.title')
  })

  it('rendrer innlogget side', async () => {
    mockResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })
    const { asFragment } = render(<LandingPage />)

    await waitFor(() => {
      expect(
        screen.getByTestId('landingside-detaljert-kalkulator-button')
          .textContent
      ).toBe('landingsside.button.detaljert_kalkulator')
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('rendrer utlogget side', async () => {
    mockErrorResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })
    const { asFragment } = render(<LandingPage />)

    await waitFor(() => {
      expect(
        screen.getByTestId('landingside-detaljert-kalkulator-button')
          .textContent
      ).toBe('landingsside.button.detaljert_kalkulator_utlogget')
      expect(
        screen.getByTestId('landingside-uinnlogget-kalkulator-button')
          .textContent
      ).toBe('landingsside.button.uinnlogget_kalkulator')

      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('går til detaljert kalkulator når brukeren klikker på den øverste knappen', async () => {
    const user = userEvent.setup()
    mockResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })

    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(<LandingPage />)
    await waitFor(() => {
      expect(screen.getByTestId('landingside-first-button')).toBeDefined()
    })

    await user.click(
      screen.getByTestId('landingside-detaljert-kalkulator-button')
    )

    expect(open).toHaveBeenCalledWith(externalUrls.detaljertKalkulator, '_self')
  })

  it('går til detaljert kalkulator når brukeren klikker på detaljert kalkulator knappen', async () => {
    const user = userEvent.setup()
    mockResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })

    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(<LandingPage />)
    await waitFor(() => {
      expect(
        screen.getByTestId('landingside-detaljert-kalkulator-button')
      ).toBeDefined()
    })

    await user.click(
      screen.getByTestId('landingside-detaljert-kalkulator-button')
    )

    expect(open).toHaveBeenCalledWith(externalUrls.detaljertKalkulator, '_self')
  })

  it('går til enkel kalkulator når brukeren klikker på enkel kalkulator knappen', async () => {
    const user = userEvent.setup()
    mockErrorResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })

    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(<LandingPage />)
    await waitFor(async () => {
      await user.click(
        screen.getByTestId('landingside-enkel-kalkulator-button')
      )
    })

    expect(open).toHaveBeenCalledWith('/pensjon/kalkulator/start', '_self')
  })

  it('går til uinnlogget kalkulator når brukeren klikker på uinnlogget kalkulator knappen', async () => {
    const user = userEvent.setup()
    mockErrorResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })

    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(<LandingPage />)

    await waitFor(() => {
      expect(
        screen.getByTestId('landingside-uinnlogget-kalkulator-button')
          .textContent
      ).toBe('landingsside.button.uinnlogget_kalkulator')
    })

    await waitFor(async () => {
      await user.click(
        screen.getByTestId('landingside-uinnlogget-kalkulator-button')
      )
    })

    expect(open).toHaveBeenCalledWith(
      externalUrls.uinnloggetKalkulator,
      '_self'
    )
  })
})

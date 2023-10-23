import { Link } from 'react-router-dom'

import { describe, it, vi } from 'vitest'

import { PageFramework } from '..'
import { mockErrorResponse } from '@/mocks/server'
import { HOST_BASEURL } from '@/paths'
import { render, screen, userEvent, waitFor } from '@/test-utils'

function TestComponent() {
  return <Link to="/">Klikk</Link>
}

describe('PageFramework', () => {
  afterEach(() => {
    window.scrollTo = () => vi.fn()
  })

  it('rendrer slik den skal, med main tag og Heading på riktig nivå', async () => {
    const { asFragment } = render(<PageFramework />, { hasLogin: true })

    waitFor(async () => {
      expect(
        await screen.findByRole('heading', { level: 1 })
      ).toHaveTextContent('pageframework.title')
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('rendrer slik den skal i full width', () => {
    const { asFragment } = render(<PageFramework isFullWidth />, {
      hasLogin: true,
    })
    waitFor(async () => {
      expect(
        await screen.findByRole('heading', { level: 1 })
      ).toHaveTextContent('pageframework.title')
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('scroller på toppen av siden når en route endrer seg', async () => {
    const user = userEvent.setup()
    const scrollToMock = vi.fn()
    Object.defineProperty(global.window, 'scrollTo', {
      value: scrollToMock,
      writable: true,
    })

    render(
      <PageFramework>
        <TestComponent />
      </PageFramework>,
      { hasLogin: true }
    )

    const button = await screen.findByText('Klikk')
    await user.click(button)

    expect(scrollToMock).toHaveBeenCalledWith(0, 0)
  })

  it('redirigerer til id-porten hvis shouldRedirectNonAuthenticated prop er satt og at brukeren ikke er authenticated', async () => {
    mockErrorResponse('/oauth2/session', {
      baseUrl: `${HOST_BASEURL}`,
    })

    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(
      <PageFramework shouldRedirectNonAuthenticated>
        <TestComponent />
      </PageFramework>,
      { hasLogin: true }
    )
    await Promise.resolve()

    expect(await screen.findByTestId('redirect-element')).toBeVisible()
    expect(open).toHaveBeenCalledWith(
      'http://localhost:8088/pensjon/kalkulator/oauth2/login?redirect=%2F',
      '_self'
    )
  })

  // it('sjekker igjen om brukeren er authenticated ved focus', () => {
  // const spy = vi.spyOn(useRequest, 'default')
  // spy.mockReturnValue({
  //   status: 401,
  //   reload: vi.fn(),
  //   isLoading: false,
  //   loadingState: 'ERROR',
  //   data: null,
  //   hasError: false,
  //   errorData: null,
  // })
  //   // window.dispatchEvent(new Event('focus'))
  // })
})

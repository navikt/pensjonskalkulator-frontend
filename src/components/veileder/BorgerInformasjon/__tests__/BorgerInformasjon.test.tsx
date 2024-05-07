import { BorgerInformasjon } from '../BorgerInformasjon'
import { BASE_PATH } from '@/router/constants'
import { render, screen, waitFor, userEvent } from '@/test-utils'

const previousWindow = window

describe('veileder - BorgerInformasjon', async () => {
  afterEach(() => {
    global.window = previousWindow
  })
  it('viser informasjon og fnr', async () => {
    const result = render(<BorgerInformasjon fnr="12345678901" />)

    await waitFor(() => {
      expect(screen.getByTestId('borger-fnr')).toHaveTextContent(
        'F.nr.: 12345678901'
      )
    })
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('reloader siden om man trykker på nullstill', async () => {
    const user = userEvent.setup()
    render(<BorgerInformasjon fnr="12345678901" />)
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: 'before',
      },
      writable: true,
    })

    await waitFor(async () => {
      expect(screen.getByTestId('borger-nullstill')).toBeInTheDocument()
      expect(window.location.href).toBe('before')
      await user.click(screen.getByTestId('borger-nullstill'))
      expect(window.location.href).toBe(`${BASE_PATH}/veileder`)
    })
  })
})

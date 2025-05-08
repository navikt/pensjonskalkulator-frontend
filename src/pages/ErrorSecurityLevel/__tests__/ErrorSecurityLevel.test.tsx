import { externalUrls, paths } from '@/router/constants'
import { render, screen, userEvent, waitFor } from '@/test-utils'

import { ErrorSecurityLevel } from '../ErrorSecurityLevel'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('ErrorSecurityLevel', () => {
  it('har riktig sidetittel', async () => {
    render(<ErrorSecurityLevel />)
    await waitFor(async () => {
      expect(document.title).toBe('application.title.securityLevel_feil')
    })
  })

  it('rendrer riktig innhold', () => {
    render(<ErrorSecurityLevel />)
    expect(screen.getByTestId('error-page-security-level')).toBeVisible()
    expect(screen.getByText('error.securityLevel.title')).toBeVisible()
    expect(screen.getByText('error.securityLevel.ingress')).toBeVisible()
  })

  it('opens the external URL when the primary button is clicked', async () => {
    const user = userEvent.setup()
    const open = vi.fn()
    vi.stubGlobal('open', open)
    render(<ErrorSecurityLevel />)
    await user.click(screen.getByTestId('card-button-primary'))
    expect(open).toHaveBeenCalledWith(externalUrls.byttBruker, '_self')
  })

  it('navigates to login when the secondary button is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorSecurityLevel />)
    await user.click(screen.getByTestId('card-button-secondary'))
    expect(navigateMock).toHaveBeenCalledWith(paths.login)
  })
})

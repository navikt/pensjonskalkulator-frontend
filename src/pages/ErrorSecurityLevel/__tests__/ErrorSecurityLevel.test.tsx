import { externalUrls, paths } from '@/router/constants'
import { render, screen, userEvent, waitFor } from '@/test-utils'

import { ErrorSecurityLevel } from '../ErrorSecurityLevel'

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

  it('opens the external URL when the secondary button is clicked', async () => {
    const user = userEvent.setup()
    const open = vi.fn()
    vi.stubGlobal('open', open)
    render(<ErrorSecurityLevel />)
    await user.click(screen.getByTestId('card-button-secondary'))
    expect(open).toHaveBeenCalledWith(paths.start, '_self')
  })
})

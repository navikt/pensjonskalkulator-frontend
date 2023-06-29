import { waitFor } from '@testing-library/react'

import { Grunnlag } from '@/components/Grunnlag'
import { mockErrorResponse } from '@/mocks/server'
import { render, screen } from '@/test-utils'

describe('Grunnlag', () => {
  it('viser tidligst mulig uttak', async () => {
    render(
      <Grunnlag
        tidligstMuligUttak={{ aar: 62, maaned: 10, uttaksdato: '2031-11-01' }}
      />
    )
    expect(await screen.findByText('Tidligst mulig uttak:')).toBeVisible()
    expect(screen.getByText('62 år, 10 md.')).toBeVisible()
  })

  it('viser pensjonsavtaler', async () => {
    render(
      <Grunnlag
        tidligstMuligUttak={{ aar: 62, maaned: 10, uttaksdato: '2031-11-01' }}
      />
    )
    await waitFor(() => {
      expect(screen.queryByTestId('section-skeleton')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('pensjonsavtaler')).toBeInTheDocument()
  })

  it('viser ikke pensjonsavtaler dersom vi ikke får hentet dem', async () => {
    mockErrorResponse('/pensjonsavtaler', {
      status: 500,
      json: "Beep boop I'm an error!",
      method: 'post',
    })
    render(
      <Grunnlag
        tidligstMuligUttak={{ aar: 62, maaned: 10, uttaksdato: '2031-11-01' }}
      />
    )
    expect(await screen.findByTestId('section-skeleton')).toBeVisible()
    await waitFor(() => {
      expect(screen.queryByTestId('section-skeleton')).not.toBeInTheDocument()
    })
    expect(screen.queryByTestId('pensjonsavtaler')).not.toBeInTheDocument()
  })
})

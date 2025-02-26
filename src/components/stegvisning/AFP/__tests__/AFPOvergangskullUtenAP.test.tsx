import { describe, it, vi } from 'vitest'

import { AFPOvergangskullUtenAP } from '..'
import { screen, render, waitFor, userEvent } from '@/test-utils'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('stegvisning - AFP - født mellom 1954-1962 uten vedtak om alderspensjon', () => {
  const onCancelMock = vi.fn()
  const onPreviousMock = vi.fn()
  const onNextMock = vi.fn()

  it('rendrer slik den skal når afp og skalBeregneAfp ikke er oppgitt', async () => {
    const user = userEvent.setup()
    const result = render(
      <AFPOvergangskullUtenAP
        afp={null}
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )

    await user.click(screen.getByText('stegvisning.afp.readmore_privat_title'))
    await user.click(
      screen.getByText('stegvisning.afpOvergangskull.readmore_offentlig_title')
    )

    expect(result.asFragment()).toMatchSnapshot()
    expect(
      screen.getByRole('link', {
        name: 'AFP i privat sektor på afp.no application.global.external_link',
      })
    ).toHaveAttribute('href', 'https://www.afp.no')

    const radioButtons = await screen.findAllByRole('radio')
    await waitFor(() => {
      expect(radioButtons).toHaveLength(4)
      expect(radioButtons[0]).not.toBeChecked()
      expect(radioButtons[1]).not.toBeChecked()
      expect(radioButtons[2]).not.toBeChecked()
      expect(radioButtons[3]).not.toBeChecked()
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('rendrer slik den skal når afp er oppgitt', async () => {
    const result = render(
      <AFPOvergangskullUtenAP
        afp="nei"
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )
    const radioButtons = screen.getAllByRole('radio')
    await waitFor(() => {
      expect(radioButtons).toHaveLength(4)
      expect(radioButtons[0]).not.toBeChecked()
      expect(radioButtons[1]).not.toBeChecked()
      expect(radioButtons[2]).toBeChecked()
      expect(radioButtons[3]).not.toBeChecked()
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('viser riktig infomeldinger når brukeren klikker på de ulike valgene', async () => {
    const user = userEvent.setup()
    render(
      <AFPOvergangskullUtenAP
        afp={null}
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.afp.title'
    )
    const radioButtons = screen.getAllByRole('radio')
    expect(
      screen.queryByText('stegvisning.afp.alert_vet_ikke')
    ).not.toBeInTheDocument()

    await user.click(radioButtons[0])

    expect(
      screen.queryByText('stegvisning.afp.alert_vet_ikke')
    ).not.toBeInTheDocument()

    await user.click(radioButtons[1])

    expect(
      screen.queryByText('stegvisning.afp.alert_vet_ikke')
    ).not.toBeInTheDocument()

    await user.click(radioButtons[2])

    expect(
      screen.queryByText('stegvisning.afp.alert_vet_ikke')
    ).not.toBeInTheDocument()

    await user.click(radioButtons[3])

    expect(
      screen.queryByText('stegvisning.afp.alert_vet_ikke')
    ).toBeInTheDocument()
  })

  it('validerer, viser feilmelding, fjerner feilmelding og kaller onNext når brukeren klikker på Neste', async () => {
    const user = userEvent.setup()
    render(
      <AFPOvergangskullUtenAP
        afp={null}
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    const radioButtons = screen.getAllByRole('radio')

    await user.click(screen.getByText('stegvisning.neste'))

    waitFor(() => {
      expect(
        screen.getByText('stegvisning.afp.validation_error')
      ).toBeInTheDocument()
      expect(onNextMock).not.toHaveBeenCalled()
    })

    await user.click(radioButtons[0])

    expect(
      screen.queryByText('stegvisning.afpOverganskull.validation_error')
    ).not.toBeInTheDocument()

    await user.click(screen.getByText('stegvisning.neste'))

    waitFor(() => {
      expect(onNextMock).toHaveBeenCalled()
    })
  })

  it('kaller onNext når brukeren klikker på Neste', async () => {
    const user = userEvent.setup()
    render(
      <AFPOvergangskullUtenAP
        afp={null}
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    const radioButtons = screen.getAllByRole('radio')
    await user.click(radioButtons[0])
    await user.click(screen.getByText('stegvisning.neste'))
    waitFor(() => {
      expect(onNextMock).toHaveBeenCalled()
    })
  })

  it('kaller onPrevious når brukeren klikker på Tilbake', async () => {
    const user = userEvent.setup()
    render(
      <AFPOvergangskullUtenAP
        afp="ja_privat"
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    await user.click(screen.getByText('stegvisning.tilbake'))
    expect(onPreviousMock).toHaveBeenCalled()
  })

  it('kaller onCancelMock når brukeren klikker på Avbryt', async () => {
    const user = userEvent.setup()
    render(
      <AFPOvergangskullUtenAP
        afp="ja_privat"
        skalBeregneAfp={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )

    await user.click(screen.getByText('stegvisning.avbryt'))

    expect(screen.getByText('stegvisning.avbryt')).toBeInTheDocument()
    await user.click(screen.getByText('stegvisning.avbryt'))
    waitFor(() => {
      expect(onCancelMock).toHaveBeenCalled()
    })
  })

  it('viser ikke avbryt knapp når onCancel ikke er definert', async () => {
    render(
      <AFPOvergangskullUtenAP
        afp={null}
        skalBeregneAfp={null}
        onCancel={undefined}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.queryByText('stegvisning.avbryt')).not.toBeInTheDocument()
  })
})

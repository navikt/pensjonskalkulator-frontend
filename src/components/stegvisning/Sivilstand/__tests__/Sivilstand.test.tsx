import { describe, it, vi } from 'vitest'

import { RootState } from '@/state/store'
import { fireEvent, render, screen, userEvent, waitFor } from '@/test-utils'

import { Sivilstand } from '..'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('stegvisning - Sivilstand', () => {
  const onCancelMock = vi.fn()
  const onPreviousMock = vi.fn()
  const onNextMock = vi.fn()

  it('rendrer slik den skal når sivilstand ikke er oppgitt (UOPPGITT eller UKNOWN)', async () => {
    render(
      <Sivilstand
        sivilstandFolkeregister="UOPPGITT"
        sivilstand="UOPPGITT"
        epsHarPensjon={null}
        epsHarInntektOver2G={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.sivilstand.title'
    )

    const selectElement = screen.getByRole('combobox', {
      name: /stegvisning.sivilstand.select_label/i,
    })

    await waitFor(() => {
      expect(selectElement).toBeVisible()
      expect(selectElement).toHaveValue('')
      expect(screen.queryAllByRole('radio')).toHaveLength(0)
    })
  })

  describe('rendrer slik den skal når sivilstand er oppgitt', async () => {
    it('når bruker endrer sivilstand, skal ny sivilstand vises', async () => {
      render(
        <Sivilstand
          sivilstandFolkeregister="UGIFT"
          sivilstand="UGIFT"
          epsHarPensjon={null}
          epsHarInntektOver2G={null}
          onCancel={onCancelMock}
          onPrevious={onPreviousMock}
          onNext={onNextMock}
        />
      )

      const selectElement = screen.getByRole('combobox', {
        name: /stegvisning.sivilstand.select_label/i,
      })
      fireEvent.change(selectElement, { target: { value: 'SKILT' } })

      await waitFor(() => {
        expect(selectElement).toHaveValue('SKILT')
      })
    })
    describe('Gitt at sivilstand er gift, samboer eller registrert partner, ', async () => {
      it('skal radio button for epsHarPensjon rendres', async () => {
        render(
          <Sivilstand
            sivilstandFolkeregister="UGIFT"
            sivilstand="GIFT"
            epsHarPensjon={null}
            epsHarInntektOver2G={null}
            onCancel={onCancelMock}
            onPrevious={onPreviousMock}
            onNext={onNextMock}
          />
        )
        const epsHarPensjonRadioGroup = screen.queryByRole('group', {
          name: 'Vil stegvisning.sivilstand.ektefellen motta pensjon eller uføretrygd fra folketrygden, eller AFP?',
        })
        const epsHarInntektOver2GRadioGroup = screen.queryByRole('group', {
          name: 'epsHarInntektOver2G',
        })

        expect(epsHarPensjonRadioGroup).toBeVisible()
        expect(epsHarInntektOver2GRadioGroup).not.toBeInTheDocument()
      })
      describe('når sivilstanden din er gift, ', async () => {
        it('skal teksten for epsHarPensjon endres til "ektefellen din"', async () => {
          render(
            <Sivilstand
              sivilstandFolkeregister="UGIFT"
              sivilstand="GIFT"
              epsHarPensjon={null}
              epsHarInntektOver2G={null}
              onCancel={onCancelMock}
              onPrevious={onPreviousMock}
              onNext={onNextMock}
            />
          )

          expect(
            screen.queryByRole('group', {
              name: 'Vil stegvisning.sivilstand.ektefellen motta pensjon eller uføretrygd fra folketrygden, eller AFP?',
            })
          ).toBeVisible()
        })
      })
      describe('når sivilstanden din er samboer, ', async () => {
        it('skal teksten for epsHarPensjon endres til "samboeren din"', async () => {
          render(
            <Sivilstand
              sivilstandFolkeregister="UGIFT"
              sivilstand="SAMBOER"
              epsHarPensjon={null}
              epsHarInntektOver2G={null}
              onCancel={onCancelMock}
              onPrevious={onPreviousMock}
              onNext={onNextMock}
            />
          )

          expect(
            screen.queryByRole('group', {
              name: 'Vil stegvisning.sivilstand.samboeren motta pensjon eller uføretrygd fra folketrygden, eller AFP?',
            })
          ).toBeVisible()
        })
      })
      describe('når sivilstanden din er registrert partner, ', async () => {
        it('skal teksten for epsHarPensjon endres til "partneren din"', async () => {
          render(
            <Sivilstand
              sivilstandFolkeregister="UGIFT"
              sivilstand="REGISTRERT_PARTNER"
              epsHarPensjon={null}
              epsHarInntektOver2G={null}
              onCancel={onCancelMock}
              onPrevious={onPreviousMock}
              onNext={onNextMock}
            />
          )

          expect(
            screen.queryByRole('group', {
              name: 'Vil stegvisning.sivilstand.partneren motta pensjon eller uføretrygd fra folketrygden, eller AFP?',
            })
          ).toBeVisible()
        })
      })
    })
    describe('gitt radio button for epsHarPensjon settes til "Ja" ', async () => {
      it('skal ikke radio button for epsHarInntektOver2G vises', async () => {
        render(
          <Sivilstand
            sivilstandFolkeregister="UGIFT"
            sivilstand="GIFT"
            epsHarPensjon={null}
            epsHarInntektOver2G={null}
            onCancel={onCancelMock}
            onPrevious={onPreviousMock}
            onNext={onNextMock}
          />
        )

        const radioButtons = screen.getAllByRole('radio', {
          name: /stegvisning.sivilstand.radio_ja/i,
        })
        const radioButtonJa = radioButtons[0]
        fireEvent.click(radioButtonJa)

        const epsHarInntektOver2GRadioGroup = screen.queryByRole('group', {
          name: 'epsHarInntektOver2G',
        })

        expect(radioButtonJa).toBeChecked()
        expect(epsHarInntektOver2GRadioGroup).not.toBeInTheDocument()
      })
      it('validerer epsHarPensjon, viser feilmelding, fjerner feilmelding og kaller onNext når brukeren klikker på Neste', async () => {
        const user = userEvent.setup()
        render(
          <Sivilstand
            sivilstandFolkeregister="UGIFT"
            sivilstand="GIFT"
            epsHarPensjon={null}
            epsHarInntektOver2G={null}
            onCancel={onCancelMock}
            onPrevious={onPreviousMock}
            onNext={onNextMock}
          />
        )

        await user.click(screen.getByText('stegvisning.neste'))

        expect(
          screen.getByText(
            'Du må svare på om stegvisning.sivilstand.ektefellen vil motta pensjon eller uføretrygd fra folketrygden, eller AFP.'
          )
        ).toBeInTheDocument()
        expect(onNextMock).not.toHaveBeenCalled()

        const epsHarPensjonRadioButtonJa = screen.getByLabelText(
          /stegvisning.sivilstand.radio_ja/i
        )
        fireEvent.click(epsHarPensjonRadioButtonJa)

        expect(
          screen.queryByText(
            'Du må svare på om stegvisning.sivilstand.ektefellen vil motta pensjon eller uføretrygd fra folketrygden, eller AFP.'
          )
        ).not.toBeInTheDocument()

        await user.click(screen.getByText('stegvisning.neste'))

        expect(onNextMock).toHaveBeenCalled()
      })
    })
    describe('gitt radio button for epsHarPensjon settes til "Nei" ', async () => {
      it('skal radio button for epsHarInntektOver2G vises', async () => {
        render(
          <Sivilstand
            sivilstandFolkeregister="UGIFT"
            sivilstand="GIFT"
            epsHarPensjon={null}
            epsHarInntektOver2G={null}
            onCancel={onCancelMock}
            onPrevious={onPreviousMock}
            onNext={onNextMock}
          />
        )
        const epsHarPensjonRadioButtonNei = screen.getByLabelText(
          /stegvisning.sivilstand.radio_nei/i
        )
        fireEvent.click(epsHarPensjonRadioButtonNei)

        const epsHarInntektOver2GRadioGroup = screen.queryByRole('group', {
          name: 'Vil stegvisning.sivilstand.ektefellen ha inntekt over 2G?',
        })

        expect(epsHarPensjonRadioButtonNei).toBeChecked()
        expect(epsHarInntektOver2GRadioGroup).toBeVisible()
      })
    })
  })

  it('validerer epsHarPensjon, viser feilmelding, fjerner feilmelding og kaller onNext når brukeren klikker på Neste', async () => {
    onNextMock.mockClear()
    const user = userEvent.setup()
    render(
      <Sivilstand
        sivilstandFolkeregister="UGIFT"
        sivilstand="GIFT"
        epsHarPensjon={null}
        epsHarInntektOver2G={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )

    const epsHarPensjonRadioButtonNei = screen.getByLabelText(
      /stegvisning.sivilstand.radio_nei/i
    )
    fireEvent.click(epsHarPensjonRadioButtonNei)

    await user.click(screen.getByText('stegvisning.neste'))

    expect(
      screen.getByText(
        'Du må svare på om stegvisning.sivilstand.ektefellen vil ha inntekt over 2G.'
      )
    ).toBeInTheDocument()
    expect(onNextMock).not.toHaveBeenCalled()

    const epsHarInntektOver2GRadioButtonNei = screen.getAllByRole('radio')
    fireEvent.click(epsHarInntektOver2GRadioButtonNei[3])

    expect(
      screen.queryByText(
        'Du må svare på om stegvisning.sivilstand.ektefellen vil ha inntekt over 2G.'
      )
    ).not.toBeInTheDocument()

    await user.click(screen.getByText('stegvisning.neste'))

    expect(onNextMock).toHaveBeenCalled()
  })

  it('kaller onPrevious når brukeren klikker på Tilbake', async () => {
    const user = userEvent.setup()
    render(
      <Sivilstand
        sivilstandFolkeregister="UGIFT"
        sivilstand="UGIFT"
        epsHarPensjon={null}
        epsHarInntektOver2G={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />,
      {
        preloadedState: { userInput: { sivilstand: 'UGIFT' } } as RootState,
      }
    )

    await user.click(screen.getByText('stegvisning.tilbake'))

    expect(onPreviousMock).toHaveBeenCalled()
  })

  it('kaller onCancelMock når brukeren klikker på Avbryt', async () => {
    const user = userEvent.setup()
    render(
      <Sivilstand
        sivilstandFolkeregister="UGIFT"
        sivilstand="UGIFT"
        epsHarPensjon={null}
        epsHarInntektOver2G={null}
        onCancel={onCancelMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.getByText('stegvisning.avbryt')).toBeInTheDocument()
    await user.click(screen.getByText('stegvisning.avbryt'))
    expect(onCancelMock).toHaveBeenCalled()
  })

  it('viser ikke avbryt knapp når onCancel ikke er definert', async () => {
    render(
      <Sivilstand
        sivilstandFolkeregister="UGIFT"
        sivilstand="UGIFT"
        epsHarPensjon={null}
        epsHarInntektOver2G={null}
        onCancel={undefined}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />
    )
    expect(screen.queryByText('stegvisning.avbryt')).not.toBeInTheDocument()
  })
})

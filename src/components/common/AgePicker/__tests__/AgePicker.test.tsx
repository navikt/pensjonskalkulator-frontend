import { describe, it, vi } from 'vitest'

import { fulfilledGetPerson } from '@/mocks/mockedRTKQueryApiCalls'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { fireEvent, render, screen } from '@/test-utils'

import { AgePicker } from '..'

describe('AgePicker', () => {
  it('rendrer riktig default verdier, description og info', async () => {
    const { container } = render(
      <AgePicker
        name="unique-name"
        label="My Test Age Picker"
        description="My Description"
        info="My Infobox"
        autoSelectFirstMonth={false}
      />
    )

    expect(screen.getByTestId('age-picker-unique-name')).toBeVisible()
    expect(screen.getByText('My Test Age Picker')).toBeVisible()
    expect(container.querySelector(`[name="unique-name-aar"]`)).toBeVisible()
    expect(
      container.querySelector(`[name="unique-name-maaneder"]`)
    ).toBeVisible()
    expect(screen.getByText('My Description')).toBeVisible()
    expect(screen.getByText('My Infobox')).toBeVisible()
  })

  describe('rendrer riktig valg i select', () => {
    it('med default min og max (autoSelectFirstMonth=false)', async () => {
      const { container } = render(
        <AgePicker
          name="unique-name"
          label="My Test Age Picker"
          autoSelectFirstMonth={false}
        />,
        {
          preloadedState: {
            api: {
              //@ts-ignore
              queries: {
                ...fulfilledGetPerson,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )
      const selectAarElement = container.querySelector(
        `[name="unique-name-aar"]`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.length).toBe(15)
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('62')
      expect(optionAarElements?.[14].value).toBe('75')
      const selectMaanederElement = container.querySelector(
        `[name="unique-name-maaneder"]`
      )

      expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(1)

      fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
        target: { value: '70' },
      })

      const optionMaanederElements =
        selectMaanederElement?.querySelectorAll('option')

      expect(optionMaanederElements?.length).toBe(13)
      expect(optionMaanederElements?.[0].value).toBe('')
      expect(optionMaanederElements?.[1].value).toBe('0')
      expect(optionMaanederElements?.[12].value).toBe('11')
    })

    it('med default min og max (autoSelectFirstMonth=true)', async () => {
      const { container } = render(
        <AgePicker
          name="unique-name"
          label="My Test Age Picker"
          autoSelectFirstMonth={true}
        />,
        {
          preloadedState: {
            api: {
              //@ts-ignore
              queries: {
                ...fulfilledGetPerson,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      const selectAarElement = container.querySelector(
        `[name="unique-name-aar"]`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.length).toBe(15)
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('62')
      expect(optionAarElements?.[14].value).toBe('75')
      const selectMaanederElement = container.querySelector(
        `[name="unique-name-maaneder"]`
      )

      // Initially no months are shown when no year is selected
      expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(0)

      fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
        target: { value: '70' },
      })

      const optionMaanederElements =
        selectMaanederElement?.querySelectorAll('option')

      // Should have 12 options (no empty option when autoSelectFirstMonth=true)
      expect(optionMaanederElements?.length).toBe(12)
      expect(optionMaanederElements?.[0].value).toBe('0')
      expect(optionMaanederElements?.[11].value).toBe('11')

      // Should auto-select the first month (0)
      expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0')
    })

    it('med custom min og max (autoSelectFirstMonth=false)', async () => {
      const { container } = render(
        <AgePicker
          name="unique-name"
          label="My Test Age Picker"
          minAlder={{ aar: 70, maaneder: 5 }}
          maxAlder={{ aar: 72, maaneder: 0 }}
          autoSelectFirstMonth={false}
        />,
        {
          preloadedState: {
            api: {
              //@ts-ignore
              queries: {
                ...fulfilledGetPerson,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      const selectAarElement = container.querySelector(
        `[name="unique-name-aar"]`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.length).toBe(4)
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('70')
      expect(optionAarElements?.[3].value).toBe('72')
      const selectMaanederElement = container.querySelector(
        `[name="unique-name-maaneder"]`
      )

      expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(1)

      fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
        target: { value: '71' },
      })

      const optionMaanederElements =
        selectMaanederElement?.querySelectorAll('option')
      expect(optionMaanederElements?.length).toBe(13)
      expect(optionMaanederElements?.[0].value).toBe('')
      expect(optionMaanederElements?.[1].value).toBe('0')
      expect(optionMaanederElements?.[12].value).toBe('11')
    })

    it('med custom min og max (autoSelectFirstMonth=true)', async () => {
      const { container } = render(
        <AgePicker
          name="unique-name"
          label="My Test Age Picker"
          minAlder={{ aar: 70, maaneder: 5 }}
          maxAlder={{ aar: 72, maaneder: 0 }}
          autoSelectFirstMonth={true}
        />,
        {
          preloadedState: {
            api: {
              //@ts-ignore
              queries: {
                ...fulfilledGetPerson,
              },
            },
            userInput: {
              ...userInputInitialState,
            },
          },
        }
      )

      const selectAarElement = container.querySelector(
        `[name="unique-name-aar"]`
      )
      const optionAarElements = selectAarElement?.querySelectorAll('option')
      expect(optionAarElements?.length).toBe(4)
      expect(optionAarElements?.[0].value).toBe('')
      expect(optionAarElements?.[1].value).toBe('70')
      expect(optionAarElements?.[3].value).toBe('72')
      const selectMaanederElement = container.querySelector(
        `[name="unique-name-maaneder"]`
      )

      expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(0)

      // Select minimum year - should auto-select first valid month (5)
      fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
        target: { value: '70' },
      })

      let optionMaanederElements =
        selectMaanederElement?.querySelectorAll('option')
      expect(optionMaanederElements?.length).toBe(7) // months 5-11
      expect(optionMaanederElements?.[0].value).toBe('5')
      expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('5') // Should auto-select month 5

      // Select middle year - should auto-select first valid month (0)
      fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
        target: { value: '71' },
      })

      optionMaanederElements = selectMaanederElement?.querySelectorAll('option')
      expect(optionMaanederElements?.length).toBe(12) // months 0-11
      expect(optionMaanederElements?.[0].value).toBe('0')
      expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0') // Should auto-select month 0
    })

    describe('Når min/maxAlder er oppgitt og år er valgt', () => {
      it('viser bare månedene som kan velges basert mellom min og max mellom to år (autoSelectFirstMonth=false)', async () => {
        const { container } = render(
          <AgePicker
            name="unique-name"
            label="My Test Age Picker"
            minAlder={{ aar: 70, maaneder: 5 }}
            maxAlder={{ aar: 72, maaneder: 10 }}
            autoSelectFirstMonth={false}
          />
        )

        const selectMaanederElement = container.querySelector(
          `[name="unique-name-maaneder"]`
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '70' },
        })

        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          8
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '71' },
        })

        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          13
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '72' },
        })

        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          12
        )
      })

      it('viser bare månedene som kan velges basert mellom min og max mellom to år (autoSelectFirstMonth=true)', async () => {
        const { container } = render(
          <AgePicker
            name="unique-name"
            label="My Test Age Picker"
            minAlder={{ aar: 70, maaneder: 5 }}
            maxAlder={{ aar: 72, maaneder: 10 }}
            autoSelectFirstMonth={true}
          />
        )

        const selectMaanederElement = container.querySelector(
          `[name="unique-name-maaneder"]`
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '70' },
        })

        // No empty option, so 7 options (months 5-11)
        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          7
        )
        expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('5') // Should auto-select month 5

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '71' },
        })

        // No empty option, so 12 options (months 0-11)
        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          12
        )
        expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0') // Should auto-select month 0

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '72' },
        })

        // No empty option, so 11 options (months 0-10)
        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          11
        )
        expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0') // Should auto-select month 0
      })

      it('viser bare månedene som kan velges basert mellom min og max innen samme år (autoSelectFirstMonth=false)', async () => {
        const { container } = render(
          <AgePicker
            name="unique-name"
            label="My Test Age Picker"
            minAlder={{ aar: 75, maaneder: 0 }}
            maxAlder={{ aar: 75, maaneder: 0 }}
            autoSelectFirstMonth={false}
          />
        )

        const selectMaanederElement = container.querySelector(
          `[name="unique-name-maaneder"]`
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '75' },
        })

        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          2
        )
      })

      it('viser bare månedene som kan velges basert mellom min og max innen samme år (autoSelectFirstMonth=true)', async () => {
        const { container } = render(
          <AgePicker
            name="unique-name"
            label="My Test Age Picker"
            minAlder={{ aar: 75, maaneder: 0 }}
            maxAlder={{ aar: 75, maaneder: 0 }}
            autoSelectFirstMonth={true}
          />
        )

        const selectMaanederElement = container.querySelector(
          `[name="unique-name-maaneder"]`
        )

        fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
          target: { value: '75' },
        })

        // No empty option, so 1 option (month 0)
        expect(selectMaanederElement?.querySelectorAll('option')?.length).toBe(
          1
        )
        expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0') // Should auto-select month 0
      })
    })
  })

  it('viser feilmelding når error er fylt ut', () => {
    render(
      <AgePicker
        name="unique-name"
        label="My Test Age Picker"
        error="My Error"
        autoSelectFirstMonth={false}
      />
    )
    expect(screen.getByText('My Error')).toBeVisible()
    expect(
      screen
        .getByTestId('age-picker-unique-name-aar')
        .getAttribute('aria-describedby')
    ).toBe('unique-name-error')
    expect(
      screen
        .getByTestId('age-picker-unique-name-maaneder')
        .getAttribute('aria-describedby')
    ).toBe('unique-name-error')
  })

  it('viser aria-invalid attribut på riktig felt når error er fylt ut', () => {
    render(
      <AgePicker
        name="unique-name"
        label="My Test Age Picker"
        error="My Error"
        autoSelectFirstMonth={false}
      />,
      {
        preloadedState: {
          api: {
            //@ts-ignore
            queries: { ...fulfilledGetPerson },
          },
        },
      }
    )
    // Når ingen av de feltene er fylt ut
    expect(
      screen
        .getByTestId('age-picker-unique-name-aar')
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(
      screen
        .getByTestId('age-picker-unique-name-maaneder')
        .getAttribute('aria-invalid')
    ).toBe('true')

    // Når bare år er fylt ut
    fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
      target: { value: '72' },
    })
    expect(
      screen
        .getByTestId('age-picker-unique-name-aar')
        .getAttribute('aria-invalid')
    ).toBe('false')
    expect(
      screen
        .getByTestId('age-picker-unique-name-maaneder')
        .getAttribute('aria-invalid')
    ).toBe('true')

    // Når år og måned er fylt ut
    fireEvent.change(screen.getByTestId('age-picker-unique-name-maaneder'), {
      target: { value: '0' },
    })
    expect(
      screen
        .getByTestId('age-picker-unique-name-aar')
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(
      screen
        .getByTestId('age-picker-unique-name-maaneder')
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(
      screen
        .getByTestId('age-picker-unique-name-aar')
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(
      screen
        .getByTestId('age-picker-unique-name-maaneder')
        .getAttribute('aria-invalid')
    ).toBe('true')

    // Når bare måned er fylt ut kan ikke testes fordi monthArray er tom så lenge år ikke er valgt
  })

  it('kaller onChange når option velges i år eller måneder, og Select for måneder enables når år er valgt (autoSelectFirstMonth=false)', async () => {
    const onChangeMock = vi.fn()
    const { container } = render(
      <AgePicker
        name="unique-name"
        label="My Test Age Picker"
        onChange={onChangeMock}
        autoSelectFirstMonth={false}
      />,
      {
        preloadedState: {
          api: {
            //@ts-ignore
            queries: {
              ...fulfilledGetPerson,
            },
          },
          userInput: {
            ...userInputInitialState,
          },
        },
      }
    )

    expect(
      container.querySelector(`[name="unique-name-maaneder"]`)
    ).toBeDisabled()

    fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
      target: { value: '72' },
    })
    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(
      container.querySelector(`[name="unique-name-maaneder"]`)
    ).not.toBeDisabled()

    fireEvent.change(screen.getByTestId('age-picker-unique-name-maaneder'), {
      target: { value: '5' },
    })
    expect(onChangeMock).toHaveBeenCalledTimes(2)
  })

  it('kaller onChange når option velges i år eller måneder, og Select for måneder enables når år er valgt (autoSelectFirstMonth=true)', async () => {
    const onChangeMock = vi.fn()
    const { container } = render(
      <AgePicker
        name="unique-name"
        label="My Test Age Picker"
        onChange={onChangeMock}
        autoSelectFirstMonth={true}
      />,
      {
        preloadedState: {
          api: {
            //@ts-ignore
            queries: {
              ...fulfilledGetPerson,
            },
          },
          userInput: {
            ...userInputInitialState,
          },
        },
      }
    )

    expect(
      container.querySelector(`[name="unique-name-maaneder"]`)
    ).toBeDisabled()

    fireEvent.change(screen.getByTestId('age-picker-unique-name-aar'), {
      target: { value: '72' },
    })
    // Should be called twice: once for year selection, once for auto-selecting month
    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith({ aar: 72, maaneder: 0 })
    expect(
      container.querySelector(`[name="unique-name-maaneder"]`)
    ).not.toBeDisabled()

    // Month should be auto-selected
    const selectMaanederElement = container.querySelector(
      `[name="unique-name-maaneder"]`
    )
    expect((selectMaanederElement as HTMLSelectElement)?.value).toBe('0')

    fireEvent.change(screen.getByTestId('age-picker-unique-name-maaneder'), {
      target: { value: '5' },
    })
    expect(onChangeMock).toHaveBeenCalledTimes(2)
  })
})

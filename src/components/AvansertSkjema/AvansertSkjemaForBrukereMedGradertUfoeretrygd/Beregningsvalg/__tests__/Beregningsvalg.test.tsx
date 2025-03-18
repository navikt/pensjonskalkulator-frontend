import { describe, expect, it, vi } from 'vitest'

import { AVANSERT_FORM_NAMES } from '../../../utils'
import { Beregningsvalg } from '../Beregningsvalg'
import { fulfilledGetPersonMedOekteAldersgrenser } from '@/mocks/mockedRTKQueryApiCalls'
import { userInputInitialState } from '@/state/userInput/userInputSlice'
import { render, screen, userEvent } from '@/test-utils'

describe('Beregningsvalg', () => {
  const mockSetLocalBeregningsTypeRadio = vi.fn()

  const defaultProps = {
    localBeregningsTypeRadio: 'uten_afp' as const,
    setLocalBeregningsTypeRadio: mockSetLocalBeregningsTypeRadio,
  }

  const renderWithDefaultState = (props = {}) => {
    return render(<Beregningsvalg {...defaultProps} {...props} />, {
      preloadedState: {
        api: {
          // @ts-ignore
          queries: {
            ...fulfilledGetPersonMedOekteAldersgrenser,
          },
        },
        userInput: {
          ...userInputInitialState,
        },
      },
    })
  }

  const nedreAldersgrense =
    fulfilledGetPersonMedOekteAldersgrenser['getPerson(undefined)'].data
      .pensjoneringAldre.nedreAldersgrense

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('Viser radio gruppe med riktige valg', () => {
      renderWithDefaultState()

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
      expect(radioGroup).toHaveAttribute('aria-required', 'true')

      const radioInputs = screen.getAllByRole('radio')
      radioInputs.forEach((input) => {
        expect(input).toHaveAttribute(
          'name',
          AVANSERT_FORM_NAMES.beregningsTypeRadio
        )
      })
    })

    it('Viser begge radio valgene', () => {
      renderWithDefaultState()

      expect(screen.getByTestId('uten_afp')).toBeInTheDocument()
      expect(screen.getByTestId('med_afp')).toBeInTheDocument()
    })

    it('Viser riktig label på radio valgene', () => {
      renderWithDefaultState()

      expect(
        screen.getByText(
          'beregning.avansert.rediger.radio.beregningsvalg.uten_afp.label'
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText('Alderspensjon og AFP, uten uføretrygd fra')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Alderspensjon og AFP, uten uføretrygd fra')
      ).toHaveTextContent(`${nedreAldersgrense.aar}`)
    })
  })

  describe('Radio valg', () => {
    it('Håndterer valg av "uten_afp" korrekt', () => {
      renderWithDefaultState()

      const utenAfpRadio = screen.getByTestId('uten_afp')
      expect(utenAfpRadio).toHaveAttribute('value', 'uten_afp')
      expect(utenAfpRadio).toBeChecked()
    })

    it('Håndterer valg av "med_afp" korrekt', () => {
      renderWithDefaultState({ localBeregningsTypeRadio: 'med_afp' })

      const medAfpRadio = screen.getByTestId('med_afp')
      expect(medAfpRadio).toHaveAttribute('value', 'med_afp')
      expect(medAfpRadio).toBeChecked()
    })
  })

  describe('Beskrivelses seksjon', () => {
    it('Viser ikke AFP beskrivelse når "uten_afp" er valgt', () => {
      renderWithDefaultState()

      expect(
        screen.queryByText('Alderspensjon og AFP fra')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/er laveste uttaksalder/)
      ).not.toBeInTheDocument()
    })

    it('Viser AFP beskrivelse når "med_afp" er valgt', () => {
      renderWithDefaultState({ localBeregningsTypeRadio: 'med_afp' })

      expect(screen.getByText('Alderspensjon og AFP fra')).toBeInTheDocument()
      expect(screen.getByText(/er laveste uttaksalder/)).toBeInTheDocument()
    })

    it('Sjekk at nedrealder blir vist når man har valgt med_afp', () => {
      renderWithDefaultState({ localBeregningsTypeRadio: 'med_afp' })

      expect(screen.getByText('Alderspensjon og AFP fra')).toHaveTextContent(
        `${nedreAldersgrense.aar}`
      )
    })
  })

  describe('Brukerinteraksjon', () => {
    it('Kaller setLocalBeregningsTypeRadio med riktig verdi når "med_afp" velges', async () => {
      const user = userEvent.setup()
      renderWithDefaultState()

      const medAfpRadio = screen.getByTestId('med_afp')
      await user.click(medAfpRadio)

      expect(mockSetLocalBeregningsTypeRadio).toHaveBeenCalledWith('med_afp')
    })

    it('Kaller setLocalBeregningsTypeRadio med riktig verdi når "uten_afp" velges', async () => {
      const user = userEvent.setup()
      renderWithDefaultState({ localBeregningsTypeRadio: 'med_afp' })

      const utenAfpRadio = screen.getByTestId('uten_afp')
      await user.click(utenAfpRadio)

      expect(mockSetLocalBeregningsTypeRadio).toHaveBeenCalledWith('uten_afp')
    })
  })
})

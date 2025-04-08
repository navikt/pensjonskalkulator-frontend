import { describe, it, vi } from 'vitest'

import { render, screen, waitFor } from '@/test-utils'

import { StepKalkulatorVirkerIkke } from '..'

const navigateMock = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Step Kalkulator Virker Ikke', () => {
  it('har riktig sidetittel', () => {
    render(<StepKalkulatorVirkerIkke />)
    expect(document.title).toBe(
      'application.title.stegvisning.kalkulator_virker_ikke'
    )
  })

  it('rendrer Step Kalkulator Virker Ikke slik den skal når brukeren har svart på spørsmålet om samtykke', async () => {
    render(<StepKalkulatorVirkerIkke />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'error.virker_ikke.title'
      )
    })
  })
})

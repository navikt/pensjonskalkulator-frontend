import React from 'react'

import { describe, it } from 'vitest'

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { Pensjonssimulering } from '../Pensjonssimulering'

describe('Pensjonssimulering', () => {
  it('rendrer slik den skal, med Heading på riktig nivå og knapper for alder', async () => {
    const result = render(<Pensjonssimulering />)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Når vil du ta ut alderspensjon?'
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7)

    fireEvent.click(screen.getByText('Vis flere aldere'))
    expect(screen.getAllByRole('button')).toHaveLength(15)
    await waitFor(() => {
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('har ingen alder valgt per default og oppdateres når brukeren klikker på en annen knapp', () => {
    render(<Pensjonssimulering />)
    expect(
      screen.queryByRole('button', { pressed: true })
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('65'))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
      '65'
    )

    expect(
      screen.getByText('Årlig pensjon hvis du starter uttak ved 65 år')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText('Vis flere aldere'))

    fireEvent.click(screen.getByText('72'))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent(
      '72'
    )

    expect(
      screen.getByText('Årlig pensjon hvis du starter uttak ved 72 år')
    ).toBeInTheDocument()
  })
})

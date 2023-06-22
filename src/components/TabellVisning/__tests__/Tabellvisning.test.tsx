import { describe, it } from 'vitest'

import { Tabellvisning } from '../Tabellvisning'
import { render, screen, userEvent } from '@/test-utils'
import React from 'react'
import { within } from '@testing-library/react'

describe('TabellVisning', () => {
  const aldere = ['70', '71', '72', '73', '74', '75', '76', '77+']
  const data: React.ComponentProps<typeof Tabellvisning>['data'] = {
    alderspensjon: [
      350_000, 400_000, 400_000, 400_000, 400_000, 400_000, 400_000, 400_000,
    ],
    afpPrivat: [30_000, 30_000, 30_000, 30_000, 30_000, 30_000, 30_000, 30_000],
    inntekt: [100_000, 175_000, 0, 0, 0, 0, 0, 0],
  }

  it('rendrer riktig formatert tabell med detaljer', async () => {
    const { asFragment } = render(<Tabellvisning aldere={aldere} data={data} />)
    expect(asFragment()).toMatchSnapshot()

    await userEvent.click(screen.getByRole('button', { name: 'Vis tabell' }))

    expect(screen.getAllByRole('row').length).toBe(9)
    expect(screen.getAllByRole('cell').length).toBe(24)
    expect(screen.getByText('480 000')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button')[1])

    const expandedRow = screen.getAllByRole('row')[2]
    expect(within(expandedRow).getByText('350 000')).toBeVisible()
    expect(within(expandedRow).getByText('30 000')).toBeVisible()
    expect(within(expandedRow).getByText('100 000')).toBeVisible()

    expect(asFragment()).toMatchSnapshot()
  })

  describe('hver rad', () => {
    it('ser bort fra nullish-verdier ved summering av pensjon', async () => {
      render(
        <Tabellvisning
          aldere={['1', '2', '3', '4']}
          data={{
            alderspensjon: [10_000, 10_000, 10_000],
            afpPrivat: [5_000, 5_000],
            inntekt: [100_000],
          }}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: 'Vis tabell' }))

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByText('115 000')).toBeVisible()
      expect(within(rows[2]).getByText('15 000')).toBeVisible()
      expect(within(rows[3]).getByText('10 000')).toBeVisible()
      expect(within(rows[4]).getByText('0')).toBeVisible()
    })
  })
})

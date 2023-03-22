import { rest } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../api/server'
import { render, screen, waitFor } from '../../test-utils'
import { Pensjonsberegning } from '../Pensjonsberegning'

const pensjonsberegningData = require('../../api/__mocks__/pensjonsberegning.json')

// TODO Bør vi legge til tester for å dekke dersom backend svarer men at data er tom
describe('Pensjonsberegning', () => {
  it('viser loading og deretter pensjonsberegning hentet fra backend', async () => {
    const result = render(<Pensjonsberegning />)
    expect(screen.getByTestId('loader')).toBeVisible()

    await waitFor(() => {
      expect(
        screen.getByText(`${pensjonsberegningData[0].alder} år`)
      ).toBeVisible()
      expect(
        screen.getByText(`${pensjonsberegningData[1].alder} år`)
      ).toBeVisible()
      expect(
        screen.getByText(`${pensjonsberegningData[2].alder} år`)
      ).toBeVisible()
      expect(
        screen.getByText(`${pensjonsberegningData[0].pensjonsbeloep} kroner`)
      ).toBeVisible()
      expect(
        screen.getByText(`${pensjonsberegningData[1].pensjonsbeloep} kroner`)
      ).toBeVisible()
      expect(
        screen.getByText(`${pensjonsberegningData[2].pensjonsbeloep} kroner`)
      ).toBeVisible()
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
      expect(result.asFragment()).toMatchSnapshot()
    })
  })

  it('viser feilmelding om henting av pensjonberegning feiler', async () => {
    server.use(
      rest.get(
        `${
          import.meta.env.VITE_MSW_BASEURL ?? ''
        }/pensjon/kalkulator/api/pensjonsberegning`,
        (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json('an error has occurred'))
        }
      )
    )
    const result = render(<Pensjonsberegning />)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Vi klarte ikke å kalkulere pensjonen din. Prøv igjen senere.'
        )
      ).toBeVisible()
      expect(result.asFragment()).toMatchSnapshot()
    })
  })
})

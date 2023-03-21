import { describe, expect, it } from 'vitest'

import { render, screen, waitFor } from '../../test-utils'
import { Pensjonsberegning } from '../Pensjonsberegning'

const pensjonsberegningData = require('../../api/__mocks__/pensjonsberegning.json')

describe('Pensjonsberegning', () => {
  // TODO vise loader med RTK query (slow request msw)
  // it('viser loader før pensjonsberegningen har blitt hentet', () => {
  //   render(<Pensjonsberegning />)
  //   expect(screen.getByTestId('loader')).toBeVisible()
  // })

  it('viser pensjonsberegning hentet fra backend', async () => {
    const result = render(<Pensjonsberegning />)

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
    })
    expect(result.asFragment()).toMatchSnapshot()
  })

  // TODO vise feilmelding med feilende request msw
  // it('viser feilmelding om henting av pensjonberegning feiler', async () => {
  //   mockErrorResponse()

  //   render(<Pensjonsberegning />)

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(
  //         'Vi klarte ikke å kalkulere pensjonen din. Prøv igjen senere.'
  //       )
  //     ).toBeVisible()
  //   })
  // })
})

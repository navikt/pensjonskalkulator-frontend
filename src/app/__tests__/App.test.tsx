import { render, screen } from '@testing-library/react'
import { afterAll, describe, it, vi } from 'vitest'

import { App } from '@/app'
import { createSuccessFetchResponse } from '@/test-utils'

// TODO:
//  Trenger vi egentlig å teste denne? Cypress håndterer allerede
//  smoketesting av appen og det er ingen kompleks logikk å teste
//  i App-komponenten

const cachedFetch = global.fetch

const beregning: PensjonsberegningResponse = {
  pensjonsaar: 2020,
  pensjonsbeloep: 1234,
  alder: 67,
}

global.fetch = vi
  .fn()
  .mockResolvedValue(createSuccessFetchResponse([beregning]))

describe('App', () => {
  afterAll(() => {
    global.fetch = cachedFetch
  })

  it('rendrer slik den skal', async () => {
    const result = render(<App />)

    expect(screen.getByText('Din pensjon')).toBeVisible()
    expect(result.asFragment()).toMatchSnapshot()
  })
})

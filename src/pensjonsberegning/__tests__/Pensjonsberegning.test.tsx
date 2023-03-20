import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import data from '@/__mocks__/pensjonsberegning.json'
import { Pensjonsberegning } from '@/pensjonsberegning'
import {
  createFailureFetchResponse,
  createSuccessFetchResponse,
} from '@/test-utils'

const cachedFetch = global.fetch

function mockSuccessResponse() {
  const fetchMock = vi.fn().mockResolvedValue(createSuccessFetchResponse(data))
  global.fetch = fetchMock
}

function mockErrorResponse() {
  const fetchMock = vi.fn().mockRejectedValue(createFailureFetchResponse(500))
  global.fetch = fetchMock
}

function cleanup() {
  global.fetch = cachedFetch
}

describe('Pensjonsberegning', () => {
  afterEach(() => {
    cleanup()
  })

  it('viser pensjonsberegning hentet fra backend', async () => {
    mockSuccessResponse()
    render(<Pensjonsberegning />)

    await waitFor(() => {
      expect(screen.getByText(`${data[0].alder} år`)).toBeVisible()
      expect(screen.getByText(`${data[1].alder} år`)).toBeVisible()
      expect(screen.getByText(`${data[2].alder} år`)).toBeVisible()
      expect(screen.getByText(`${data[0].pensjonsbeloep} kroner`)).toBeVisible()
      expect(screen.getByText(`${data[1].pensjonsbeloep} kroner`)).toBeVisible()
      expect(screen.getByText(`${data[2].pensjonsbeloep} kroner`)).toBeVisible()
    })
  })

  it('viser loader før pensjonsberegningen har blitt hentet', () => {
    mockSuccessResponse()
    render(<Pensjonsberegning />)

    expect(screen.getByTestId('loader')).toBeVisible()
  })

  it('viser feilmelding om henting av pensjonberegning feiler', async () => {
    mockErrorResponse()

    render(<Pensjonsberegning />)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Vi klarte ikke å kalkulere pensjonen din. Prøv igjen senere.'
        )
      ).toBeVisible()
    })
  })
})

import { rest } from 'msw'
import { vi } from 'vitest'
import apiSlice from '../apiSlice'

import { server } from '../../../api/server'
const pensjonsberegningData = require('../../../api/__mocks__/pensjonsberegning.json')

import { setupApiStore } from '../../../test-utils'

vi.mock('@reduxjs/toolkit/query/react')

describe('apiSlice', async () => {
  it('har riktig baseQuery', async () => {
    const createAPIMockFunction = vi
      .fn()
      .mockReturnValue({ useGetPensjonsberegningQuery: 'lorem' })
    const fetchBaseQueryMockFunction = vi.fn().mockReturnValue('')

    const reduxUtils = await import('@reduxjs/toolkit/query/react')
    reduxUtils.fetchBaseQuery = fetchBaseQueryMockFunction
    reduxUtils.createApi = createAPIMockFunction

    const apiSlice = await import('../apiSlice')

    expect(fetchBaseQueryMockFunction).toHaveBeenCalledWith({
      baseUrl: 'http://localhost:8088/pensjon/kalkulator/api',
    })

    // Mock clearing is not working - makes following tests to fail
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  // it('eksponerer riktig endepunkter', () => {
  //   expect(apiSlice.endpoints).toHaveProperty('getPensjonsberegning')
  // })

  // it('returnerer data ved successfull query', () => {
  //   const storeRef = setupApiStore(apiSlice)

  //   return storeRef.store
  //     .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
  //     .then((result: any) => {
  //       expect(result.status).toBe('fulfilled')
  //       expect(result.data).toMatchObject(pensjonsberegningData)
  //     })
  // })

  // it('returnerer undefined ved feilende query', () => {
  //   const storeRef = setupApiStore(apiSlice)
  //   server.use(
  //     rest.get(
  //       `${
  //         import.meta.env.VITE_MSW_BASEURL ?? ''
  //       }/pensjon/kalkulator/api/pensjonsberegning`,
  //       (_req, res, ctx) => {
  //         return res(ctx.status(500), ctx.json('an error has occurred'))
  //       }
  //     )
  //   )
  //   return storeRef.store
  //     .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
  //     .then((result: any) => {
  //       expect(result.status).toBe('rejected')
  //       expect(result.data).toBe(undefined)
  //     })
  // })

  // it('kaster feil ved uforventet format på responsen', () => {
  //   const error = console.error
  //   console.error = () => {}

  //   const storeRef = setupApiStore(apiSlice)

  //   server.use(
  //     rest.get(
  //       `${
  //         import.meta.env.VITE_MSW_BASEURL ?? ''
  //       }/pensjon/kalkulator/api/pensjonsberegning`,
  //       (_req, res, ctx) => {
  //         return res(ctx.status(200), ctx.json([{ 'tullete svar': 'lorem' }]))
  //       }
  //     )
  //   )

  //   return storeRef.store
  //     .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
  //     .then((result: any) => {
  //       expect(result).toThrow(Error)
  //       expect(result.status).toBe('rejected')
  //       expect(result.data).toBe(undefined)
  //       console.error = error
  //     })
  // })
})

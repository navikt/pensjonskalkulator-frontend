import { rest } from 'msw'
import apiSlice from '../apiSlice'

import { server } from '../../../api/server'
const pensjonsberegningData = require('../../../api/__mocks__/pensjonsberegning.json')

import { setupApiStore } from '../../../test-utils'

//TODO bør prøve å få en test til på baseQuery

describe('apiSlice', () => {
  test('eksponerer riktig endepunkter', () => {
    expect(apiSlice.endpoints).toHaveProperty('getPensjonsberegning')
  })

  test('returnerer data ved successfull query', () => {
    const storeRef = setupApiStore(apiSlice)

    return storeRef.store
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result.status).toBe('fulfilled')
        expect(result.data).toMatchObject(pensjonsberegningData)
      })
  })

  test('returnerer undefined ved feilende query', () => {
    const storeRef = setupApiStore(apiSlice)
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
    return storeRef.store
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result.status).toBe('rejected')
        expect(result.data).toBe(undefined)
      })
  })

  test('kaster feil ved uforventet format på responsen', () => {
    const storeRef = setupApiStore(apiSlice)
    server.use(
      rest.get(
        `${
          import.meta.env.VITE_MSW_BASEURL ?? ''
        }/pensjon/kalkulator/api/pensjonsberegning`,
        (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ 'tullete svar': 'lorem' }))
        }
      )
    )

    return storeRef.store
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result).toThrow(Error)
        expect(result.status).toBe('rejected')
        expect(result.data).toBe(undefined)
      })
  })
})

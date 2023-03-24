import { rest } from 'msw'
import { vi } from 'vitest'
import { server, API_TARGET, API_PATH } from '../../../api/server'

const pensjonsberegningData = require('../../../api/__mocks__/pensjonsberegning.json')

vi.mock('@reduxjs/toolkit/query/react')
vi.mock('../apiSlice')

// TODO teste med env variabel import.meta.env.MODE
//const OLD_ENV = process.env.VITE_MSW_BASEURL

describe('apiSlice', () => {
  const importRealApiSlice = async () => {
    const apiSliceModuleActual = await vi.importActual('../apiSlice')
    let apiSliceModule = await import('../apiSlice')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    apiSliceModule.apiSlice = apiSliceModuleActual.apiSlice
    return apiSliceModule.apiSlice
  }

  afterEach(async () => {
    const realModule: typeof import('@reduxjs/toolkit/query/react') =
      await vi.importActual('@reduxjs/toolkit/query/react')
    const reduxUtils: typeof import('@reduxjs/toolkit/query/react') =
      await import('@reduxjs/toolkit/query/react')
    reduxUtils.fetchBaseQuery = realModule.fetchBaseQuery
    reduxUtils.createApi = realModule.createApi
  })

  describe('baseQuery', () => {
    //TODO se om det går an å ha en test på denne ternary
    // it('har riktig baseQuery i produksjon', async () => {
    //   process.env.VITE_MSW_BASEURL = ''

    //   const createAPIMockFunction = vi
    //     .fn()
    //     .mockReturnValueOnce({ useGetPensjonsberegningQuery: 'lorem' })
    //   const fetchBaseQueryMockFunction = vi.fn().mockReturnValueOnce('')

    //   const reduxUtils = await import('@reduxjs/toolkit/query/react')
    //   reduxUtils.fetchBaseQuery = fetchBaseQueryMockFunction
    //   reduxUtils.createApi = createAPIMockFunction

    //   await import('../apiSlice')
    //   await expect(fetchBaseQueryMockFunction).toHaveBeenCalledWith({
    //     baseUrl: '/pensjon/kalkulator/api',
    //   })
    //   process.env.VITE_MSW_BASEURL = OLD_ENV
    // })

    it('har riktig baseQuery som default', async () => {
      // vi.resetModules()
      // process.env.VITE_MSW_BASEURL = OLD_ENV

      const createAPIMockFunction = vi
        .fn()
        .mockReturnValueOnce({ useGetPensjonsberegningQuery: 'lorem' })
      const fetchBaseQueryMockFunction = vi.fn().mockReturnValueOnce('')

      const reduxUtils = await import('@reduxjs/toolkit/query/react')
      reduxUtils.fetchBaseQuery = fetchBaseQueryMockFunction
      reduxUtils.createApi = createAPIMockFunction

      await import('../apiSlice')

      await expect(fetchBaseQueryMockFunction).toHaveBeenCalledWith({
        baseUrl: 'http://localhost:8088/pensjon/kalkulator/api',
      })
    })
  })

  it('eksponerer riktig endepunkter', async () => {
    const apiSlice = await importRealApiSlice()
    expect(apiSlice.endpoints).toHaveProperty('getPensjonsberegning')
  })

  it('returnerer data ved successfull query', async () => {
    const apiSlice = await importRealApiSlice()

    const storeModule = await import('../../store')
    const storeRef = await storeModule.setupStore()

    return storeRef
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result.status).toBe('fulfilled')
        expect(result.data).toMatchObject(pensjonsberegningData)
      })
  })

  it('returnerer undefined ved feilende query', async () => {
    const apiSlice = await importRealApiSlice()
    const storeModule = await import('../../store')
    const storeRef = await storeModule.setupStore()

    server.use(
      rest.get(
        `${API_TARGET}${API_PATH}/pensjonsberegning`,
        (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json('an error has occurred'))
        }
      )
    )
    return storeRef
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result.status).toBe('rejected')
        expect(result.data).toBe(undefined)
      })
  })

  it('kaster feil ved uforventet format på responsen', async () => {
    const apiSlice = await importRealApiSlice()
    const storeModule = await import('../../store')
    const storeRef = await storeModule.setupStore()

    const error = console.error
    console.error = () => {}

    server.use(
      rest.get(
        `${API_TARGET}${API_PATH}/pensjonsberegning`,
        (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json([{ 'tullete svar': 'lorem' }]))
        }
      )
    )

    return storeRef
      .dispatch<any>(apiSlice.endpoints.getPensjonsberegning.initiate())
      .then((result: any) => {
        expect(result).toThrow(Error)
        expect(result.status).toBe('rejected')
        expect(result.data).toBe(undefined)
        console.error = error
      })
  })
})

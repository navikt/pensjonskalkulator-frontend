import { setupServer } from 'msw/node'
import { getHandlers } from './handlers.js'
import { rest } from 'msw'

export const target = 'http://localhost:8088'
export const apiPath = '/pensjon/kalkulator/api'

const handlers = getHandlers(`${target}${apiPath}`)
export const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'error' })

type MockResponseOptions = {
  status?: number
  json?: any
}

export const mockResponse = (
  path: string,
  options: MockResponseOptions = {
    status: 200,
    json: 'OK',
  }
) => {
  server.use(
    rest.get(`${target}${apiPath}${path}`, (req, res, ctx) => {
      return res(ctx.status(options.status ?? 200), ctx.json(options.json))
    })
  )
}

export const mockErrorResponse = (
  path: string,
  options: MockResponseOptions = {
    status: 500,
    json: "Beep boop I'm an error!",
  }
) => {
  mockResponse(path, {
    ...options,
    status: options.status ?? 500,
  })
}

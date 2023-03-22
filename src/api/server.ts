import { setupServer } from 'msw/node'
import { getHandlers } from './handlers.js'
import { rest } from 'msw'

const target = 'http://localhost:8088'
const apiPath = '/pensjon/kalkulator/api'

const handlers = getHandlers(`${target}${apiPath}`)
export const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'error' })

type MockErrorResponseOptions = {
  status?: number
  json?: any
}

export const mockErrorResponse = (
  path: string,
  options: MockErrorResponseOptions = {
    status: 500,
    json: "Beep boop I'm an error!",
  }
) => {
  server.use(
    rest.get(`${target}${apiPath}${path}`, (req, res, ctx) => {
      return res(
        ctx.status(options.status ?? 500),
        ctx.json("Beep boop I'm an error!")
      )
    })
  )
}

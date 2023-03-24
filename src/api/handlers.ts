import { rest } from 'msw'

import pensjonsberegningData from './__mocks__/pensjonsberegning.json' assert { type: 'json' }

export const getHandlers = (path: string) => [
  rest.get(`${path}/pensjonsberegning`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(pensjonsberegningData), ctx.delay(30))
  }),
]

export const handlers = []

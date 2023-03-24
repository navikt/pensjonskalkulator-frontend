import { rest } from 'msw'

import pensjonsberegningData from './__mocks__/pensjonsberegning.json' assert { type: 'json' }

export const getHandlers = (
  host: string = 'http://localhost:5173',
  path: string = `${import.meta.env.BASE_URL}api`
) => [
  rest.get(`${host}${path}/pensjonsberegning`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(pensjonsberegningData), ctx.delay(30))
  }),
]

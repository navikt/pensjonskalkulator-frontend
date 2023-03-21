import { rest } from 'msw'

import pensjonsberegningData from './__mocks__/pensjonsberegning.json' assert { type: 'json' }

const target = 'http://localhost:8088'
const apiPath = '/pensjon/kalkulator/api'

export const handlers = [
  rest.get(`${target}${apiPath}/pensjonsberegning`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(pensjonsberegningData), ctx.delay(30))
  }),
]

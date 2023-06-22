import { rest } from 'msw'

import { PATH } from '@/api/paths'

import pensjonsavtalerResponse from './data/pensjonsavtaler.json' assert { type: 'json' }
import personResponse from './data/person.json' assert { type: 'json' }
import tidligstemuligeuttaksalderResponse from './data/tidligsteUttaksalder.json' assert { type: 'json' }
import tpoMedlemskapResponse from './data/tpo-medlemskap.json' assert { type: 'json' }
import unleashDisableSpraakvelgerResponse from './data/unleash-disable-spraakvelger.json' assert { type: 'json' }

export const getHandlers = (baseUrl: string = PATH, shouldDelay?: boolean) => [
  rest.post(`${baseUrl}/tidligste-uttaksalder`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(tidligstemuligeuttaksalderResponse),
      ctx.delay(shouldDelay ? 2000 : 0)
    )
  }),
  rest.post(`${baseUrl}/alderspensjon/simulering`, async (req, res, ctx) => {
    const body = await req.json()
    const year = new Date(body.foersteUttaksdato).getFullYear()
    const data = await import(`./data/simulering/${year}.json`)

    return res(
      ctx.status(200),
      ctx.json(data),
      ctx.delay(shouldDelay ? 300 : 0)
    )
  }),
  rest.get(`${baseUrl}/pensjonsavtaler`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(pensjonsavtalerResponse),
      ctx.delay(shouldDelay ? 20 : 0)
    )
  }),
  rest.get(`${baseUrl}/tpo-medlemskap`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(tpoMedlemskapResponse),
      ctx.delay(shouldDelay ? 20 : 0)
    )
  }),
  rest.get(`${baseUrl}/person`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(personResponse),
      ctx.delay(shouldDelay ? 20 : 0)
    )
  }),
  rest.get(
    `${baseUrl}/feature/pensjonskalkulator.disable-spraakvelger`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(unleashDisableSpraakvelgerResponse),
        ctx.delay(shouldDelay ? 20 : 0)
      )
    }
  ),
  rest.post('http://localhost:12347/collect', (req, res, ctx) => {
    return res(ctx.status(202), ctx.text('ok'))
  }),
]

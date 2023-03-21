// const express = require('express')
// const liveness = require('../src/__mocks__/data/liveness.json')
// const pensjonsberegning = require('../src/__mocks__/data/pensjonsberegning.json')

// const app = express()
// const port = 8088

// app.get('/api/status', (request, response) => {
//   response.send(liveness)
// })

// app.get('/api/pensjonsberegning', async (request, response) => {
//   response.send(pensjonsberegning)
// })

// app.listen(process.env.PORT || port, () => {
//   console.info('proxy server is running on port', process.env.PORT || port)
// })

// import { rest } from 'msw'
// import { setupServer } from 'msw/node'

import { setupServer } from 'msw/node'
import { handlers } from './handlers.js'

export const server = setupServer(...handlers)
server.listen({ onUnhandledRequest: 'error' })

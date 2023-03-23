import { setupWorker } from 'msw'
import { getHandlers } from './handlers'

const apiPath = '/pensjon/kalkulator/api'

const handlers = getHandlers(apiPath)
export const worker = setupWorker(...handlers)

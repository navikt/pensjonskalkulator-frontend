import { setupWorker } from 'msw'
import { getHandlers } from './handlers'
import { apiPath } from './server'

const handlers = getHandlers(apiPath)
export const worker = setupWorker(...handlers)

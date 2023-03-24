import { setupWorker } from 'msw'
import { getHandlers } from './handlers'
import { API_PATH } from './server'

const handlers = getHandlers(API_PATH)
export const worker = setupWorker(...handlers)

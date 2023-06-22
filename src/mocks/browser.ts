import { setupWorker } from 'msw'

import { PATH } from '@/api/paths'

import { getHandlers } from './handlers'

const handlers = getHandlers(PATH, true)
export const worker = setupWorker(...handlers)

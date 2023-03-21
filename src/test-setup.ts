import '@testing-library/jest-dom'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { server } from './api/server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

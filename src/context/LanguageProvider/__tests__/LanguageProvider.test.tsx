import { useIntl } from 'react-intl'
import { Provider } from 'react-redux'

import { render, screen, waitFor } from '@testing-library/react'

import { setupStore } from '../../../state/store'
import { LanguageProvider } from '../LanguageProvider'
import { mockErrorResponse } from '@/mocks/server'

function TestComponent() {
  const intl = useIntl()
  return (
    <div data-testid="test-component">
      {intl.formatMessage({ id: 'pageframework.title' })}
    </div>
  )
}

describe('LanguageProvider', () => {
  afterEach(() => {
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  })
  it('gir tilgang til react-intl translations', async () => {
    const storeRef = setupStore(undefined, true)
    render(
      <Provider store={storeRef}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toHaveTextContent(
        'Pensjonskalkulator'
      )
    })
  })

  it('bruker locale fra cookie når den er tilgjengelig', async () => {
    const storeRef = setupStore(undefined, true)
    document.cookie = 'decorator-language=en'
    render(
      <Provider store={storeRef}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toHaveTextContent(
        'Pension Calculator'
      )
      expect(document.documentElement.lang).toBe('en')
    })
  })

  it('bruker norsk bokmål uansett når kall til feature toggle feiler', async () => {
    const storeRef = setupStore(undefined, true)
    document.cookie = 'decorator-language=en'
    mockErrorResponse('/feature/pensjonskalkulator.disable-spraakvelger')

    render(
      <Provider store={storeRef}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toHaveTextContent(
        'Pensjonskalkulator'
      )
    })
  })
})

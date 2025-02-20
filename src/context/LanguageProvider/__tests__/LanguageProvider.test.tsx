import React from 'react'
import { useIntl } from 'react-intl'
import { Provider } from 'react-redux'

import { render, screen, waitFor } from '@testing-library/react'

import { setupStore } from '../../../state/store'
import { LanguageProvider } from '../LanguageProvider'
import { SanityContext } from '@/context/SanityContext'
import { mockErrorResponse } from '@/mocks/server'
import { sanityClient } from '@/utils/sanity'

function TestComponent() {
  const intl = useIntl()
  const { readMoreData, forbeholdAvsnittData } = React.useContext(SanityContext)

  return (
    <div data-testid="test-component">
      <p>{intl.formatMessage({ id: 'pageframework.title' })}</p>
      <p data-testid="readmore-data-length">
        {Object.keys(readMoreData).length}
      </p>
      <p data-testid="forbehold-avsnitt-length">
        {forbeholdAvsnittData.length}
      </p>
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

  it('fetcher tekster fra Sanity i norsk bokmål som default, og videre med riktig locale, og lagrer det i Context', async () => {
    const dummyResp = [
      {
        language: 'nb',
        _id: '1e9a7d23-eb88-4bd2-ad8d-15843cf47952',
        _createdAt: '2024-10-07T11:55:49Z',
        _type: 'random',
        name: 'hva_er_opphold_utenfor_norge',
        _updatedAt: '2025-01-16T15:26:45Z',
        overskrift: 'Hva som er opphold utenfor Norge',
        _rev: 'IZ4ZA8avncRcTDvyuMLOnJ',
        innhold: [],
      },
      {
        overskrift: 'Betydning av opphold utenfor Norge for pensjon',
        _rev: 'aW9ZvtW6d5z6x1Negh1PL7',
        name: 'betydning_av_opphold_utenfor_norge',
        language: 'nb',
        _id: '88dfc74a-9878-4753-88a3-4ded8c846fee',
        _updatedAt: '2025-01-17T07:58:59Z',
        _createdAt: '2025-01-17T07:54:30Z',
        _type: 'random',
        innhold: [],
      },
    ]

    const sanityClientFetchMock = vi
      .spyOn(sanityClient, 'fetch') // @ts-ignore
      .mockReturnValue(Promise.resolve(dummyResp))

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
      expect(sanityClientFetchMock).toHaveBeenCalledTimes(4)
      expect(sanityClientFetchMock.mock.calls[0][0]).toBe(
        '*[_type == "readmore" && language == "nb"]'
      )
      expect(sanityClientFetchMock.mock.calls[1][0]).toBe(
        '*[_type == "forbeholdAvsnitt" && language == "nb"]'
      )
      expect(sanityClientFetchMock.mock.calls[2][0]).toBe(
        '*[_type == "readmore" && language == "en"]'
      )
      expect(sanityClientFetchMock.mock.calls[3][0]).toBe(
        '*[_type == "forbeholdAvsnitt" && language == "en"]'
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('readmore-data-length')).toHaveTextContent('2')
      expect(screen.getByTestId('forbehold-avsnitt-length')).toHaveTextContent(
        '2'
      )
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

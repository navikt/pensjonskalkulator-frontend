import React from 'react'
import { useIntl } from 'react-intl'
import { Await } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { Start } from '@/components/stegvisning/Start'
import { useStegvisningNavigation } from '@/components/stegvisning/stegvisning-hooks'
import { paths } from '@/router/constants'
import { useStepStartAccessData } from '@/router/loaders'
import { useAppSelector } from '@/state/hooks'
import { selectIsVeileder } from '@/state/userInput/selectors'

export function StepStart() {
  const intl = useIntl()

  const loaderData = useStepStartAccessData()

  const [{ onStegvisningNext, onStegvisningCancel }] = useStegvisningNavigation(
    paths.start
  )

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.start',
    })
  }, [])

  const isVeileder = useAppSelector(selectIsVeileder)

  return (
    <React.Suspense
      fallback={
        <div style={{ width: '100%' }}>
          <Loader
            data-testid="start-loader"
            size="3xlarge"
            title={intl.formatMessage({ id: 'pageframework.loading' })}
            isCentered
          />
        </div>
      }
    >
      <Await
        resolve={Promise.all([
          loaderData.getPersonQuery,
          loaderData.getLoependeVedtakQuery,
          loaderData.shouldRedirectTo,
        ])}
      >
        {(queries: [GetPersonQuery, GetLoependeVedtakQuery, string]) => {
          const getPersonQuery = queries[0]
          const getVedtakQuery = queries[1]
          const shouldRedirectTo = queries[2]

          return (
            <Start
              shouldRedirectTo={shouldRedirectTo}
              navn={
                getPersonQuery.isSuccess
                  ? (getPersonQuery.data as Person).navn
                  : ''
              }
              onCancel={isVeileder ? undefined : onStegvisningCancel}
              onNext={onStegvisningNext}
              loependeVedtak={getVedtakQuery.data}
            />
          )
        }}
      </Await>
    </React.Suspense>
  )
}

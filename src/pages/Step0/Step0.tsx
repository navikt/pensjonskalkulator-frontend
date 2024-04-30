import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, Await } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { Start } from '@/components/stegvisning/Start'
import { henvisningUrlParams, paths } from '@/router/constants'
import { GetPersonQuery, useStep0AccessData } from '@/router/loaders'
import {
  apiSlice,
  // useGetPersonQuery,
  // useGetInntektQuery,
  useGetEkskludertStatusQuery,
  useGetUfoereFeatureToggleQuery,
} from '@/state/api/apiSlice'
import { useAppDispatch } from '@/state/hooks'

export function Step0() {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loaderData = useStep0AccessData()
  const { data: ufoereFeatureToggle } = useGetUfoereFeatureToggleQuery()

  const { isFetching: isEkskludertStatusFetching, data: ekskludertStatus } =
    useGetEkskludertStatusQuery()

  // const { isError: isInntektError, isFetching: isInntektFetching } =
  //   useGetInntektQuery()

  // const {
  //   data: person,
  //   isError: isPersonError,
  //   isSuccess: isPersonSuccess,
  //   isFetching: isPersonFetching,
  // } = useGetPersonQuery()

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step0',
    })
    dispatch(
      apiSlice.endpoints.getHighchartsAccessibilityPluginFeatureToggle.initiate()
    )
  }, [])

  React.useEffect(() => {
    // TODO fases ut når feature toggle fases ut
    if (!isEkskludertStatusFetching && ekskludertStatus?.ekskludert) {
      if (
        !ufoereFeatureToggle?.enabled &&
        ekskludertStatus.aarsak === 'HAR_LOEPENDE_UFOERETRYGD'
      ) {
        navigate(`${paths.henvisning}/${henvisningUrlParams.ufoeretrygd}`)
      }
    }
  }, [isEkskludertStatusFetching, ekskludertStatus, navigate])

  const onCancel = (): void => {
    navigate(paths.login)
  }

  const onNext = (): void => {
    // TODO PEK_400 overført til Loader - sjekke om det virker
    // if (isInntektError) {
    //   dispatch(apiSlice.util.invalidateTags(['Inntekt']))
    // }
    // if (isPersonError) {
    //   dispatch(apiSlice.util.invalidateTags(['Person']))
    // }
    navigate(paths.utenlandsopphold)
  }

  return (
    <>
      <React.Suspense
        fallback={
          <div style={{ width: '100%' }}>
            <Loader
              data-testid="step0-loader"
              size="3xlarge"
              title={intl.formatMessage({ id: 'pageframework.loading' })}
              isCentered
            />
          </div>
        }
      >
        <Await resolve={loaderData.getPersonQuery}>
          {(getPersonQuery: GetPersonQuery) => {
            return (
              <Start
                fornavn={
                  getPersonQuery.isSuccess
                    ? (getPersonQuery.data as Person).fornavn
                    : ''
                }
                onCancel={onCancel}
                onNext={onNext}
              />
            )
          }}
        </Await>
      </React.Suspense>
    </>
  )
}

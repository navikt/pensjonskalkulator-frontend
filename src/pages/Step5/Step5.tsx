import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, Await, useLocation } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { Ufoere } from '@/components/stegvisning/Ufoere'
import { BASE_PATH, paths } from '@/router/constants'
import { useStep5AccessData } from '@/router/loaders'
import { useGetEkskludertStatusQuery } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectSamboerFraSivilstand,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step5() {
  const intl = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const afp = useAppSelector(selectAfp)
  const harSamboer = useAppSelector(selectSamboerFraSivilstand)
  const loaderData = useStep5AccessData()

  const { data: ekskludertStatus } = useGetEkskludertStatusQuery()

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step5',
    })
  }, [])

  React.useEffect(() => {
    const isNavigatingFromPreviousStep =
      location.state?.previousLocationPathname === `${BASE_PATH}${paths.afp}`

    if (
      !(
        ekskludertStatus?.aarsak === 'HAR_LOEPENDE_UFOERETRYGD' && afp !== 'nei'
      )
    ) {
      navigate(
        isNavigatingFromPreviousStep ? paths.sivilstand : paths.offentligTp,
        {
          state: {
            previousLocationPathname: location.pathname,
          },
        }
      )
    }
  }, [afp, ekskludertStatus])

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate(paths.login, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  const onPrevious = (): void => {
    return navigate(paths.afp)
  }

  const onNext = (): void => {
    navigate(paths.sivilstand, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  return (
    <React.Suspense
      fallback={
        <Loader
          data-testid="loader"
          size="3xlarge"
          title={intl.formatMessage({ id: 'pageframework.loading' })}
        />
      }
    >
      <Await resolve={loaderData.getEkskludertStatusQuery}>
        <Ufoere
          isLastStep={!!harSamboer}
          onCancel={onCancel}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </Await>
    </React.Suspense>
  )
}

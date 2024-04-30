import React from 'react'
import { useIntl } from 'react-intl'
import { Await, useLocation, useNavigate } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { RedirectElement } from '@/components/common/PageFramework/PageFramework'
import { Sivilstand } from '@/components/stegvisning/Sivilstand'
import { BASE_PATH, paths } from '@/router/constants'
import {
  useStep6AccessData,
  GetPersonQuery,
  GetInntektQuery,
} from '@/router/loaders'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectSamboerFraSivilstand,
  selectSamboerFraBrukerInput,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step6() {
  const intl = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const samboerSvar = useAppSelector(selectSamboerFraBrukerInput)

  const harSamboer = useAppSelector(selectSamboerFraSivilstand)
  const loaderData = useStep6AccessData()

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step6',
    })
  }, [])

  React.useEffect(() => {
    const isNavigatingFromPreviousStep =
      location.state?.previousLocationPathname ===
      `${BASE_PATH}${paths.ufoeretrygd}`

    if (harSamboer) {
      navigate(
        isNavigatingFromPreviousStep ? paths.beregningEnkel : paths.ufoeretrygd,
        {
          state: { previousLocationPathname: location.pathname },
        }
      )
    }
  }, [harSamboer])

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate(paths.login)
  }

  const onPrevious = (): void => {
    navigate(paths.ufoeretrygd)
  }

  const onNext = (sivilstandData: BooleanRadio): void => {
    dispatch(userInputActions.setSamboer(sivilstandData === 'ja'))
    navigate(paths.beregningEnkel, {
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
      <Await
        resolve={Promise.all([
          loaderData.getPersonQuery,
          loaderData.getInntektQuery,
        ])}
        errorElement={<RedirectElement />}
      >
        {(queries: [GetPersonQuery, GetInntektQuery]) => {
          const getPersonQuery = queries[0]

          return (
            getPersonQuery.data && (
              <Sivilstand
                sivilstand={getPersonQuery.data.sivilstand}
                harSamboer={samboerSvar}
                onCancel={onCancel}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            )
          )
        }}
      </Await>
    </React.Suspense>
  )
}

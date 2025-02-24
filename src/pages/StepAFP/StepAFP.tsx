import React from 'react'
import { useIntl } from 'react-intl'
import { Await, useLoaderData } from 'react-router'

import { Loader } from '@/components/common/Loader'
import {
  AFP,
  AFPOvergangskullUtenAP,
  AFPPrivat,
} from '@/components/stegvisning/AFP'
import { useStegvisningNavigation } from '@/components/stegvisning/stegvisning-hooks'
import { paths } from '@/router/constants'
import { StepAFPAccessGuardLoader } from '@/router/loaders'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectIsVeileder,
  selectSkalBeregneAfp,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function StepAFP() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const stepAFPAccessGuard =
    useLoaderData() as Promise<StepAFPAccessGuardLoader>
  const previousAfp = useAppSelector(selectAfp)
  const skalBeregneAfp = useAppSelector(selectSkalBeregneAfp)
  const isVeileder = useAppSelector(selectIsVeileder)

  const [{ onStegvisningNext, onStegvisningPrevious, onStegvisningCancel }] =
    useStegvisningNavigation(paths.afp)

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.afp',
    })
  }, [])

  const onNext = (afpData: AfpRadio): void => {
    dispatch(userInputActions.setAfp(afpData))
    if (onStegvisningNext) {
      onStegvisningNext()
    }
  }

  const onNextOvergangskull = (afpData: {
    afp: AfpRadio
    skalBeregneAfp: boolean | null
  }): void => {
    dispatch(userInputActions.setAfp(afpData.afp))
    dispatch(userInputActions.setSkalBeregneAfp(afpData.skalBeregneAfp))
    if (onStegvisningNext) {
      onStegvisningNext()
    }
  }

  return (
    <React.Suspense
      fallback={
        <div style={{ width: '100%' }}>
          <Loader
            data-testid="afp-loader"
            size="3xlarge"
            title={intl.formatMessage({ id: 'pageframework.loading' })}
            isCentered
          />
        </div>
      }
    >
      <Await resolve={stepAFPAccessGuard}>
        {(view: StepAFPAccessGuardLoader) => {
          // TODO: Logikk som endrer på hvilket view som skal vises
          if (view === 'VIEW1') {
            /* return (
              <AFPPrivat
                afp={previousAfp}
                onCancel={isVeileder ? undefined : onStegvisningCancel}
                onPrevious={onStegvisningPrevious}
                onNext={onNext}
              />
            ) */
            return (
              <AFPOvergangskullUtenAP
                afp={previousAfp}
                skalBeregneAfp={skalBeregneAfp}
                onCancel={isVeileder ? undefined : onStegvisningCancel}
                onPrevious={onStegvisningPrevious}
                onNext={onNextOvergangskull}
              />
            )
            /* return (
              <AFP
                afp={previousAfp}
                onCancel={isVeileder ? undefined : onStegvisningCancel}
                onPrevious={onStegvisningPrevious}
                onNext={onNext}
              />
            ) */
          } else {
            return <div>Noe annet</div>
          }
        }}
      </Await>
    </React.Suspense>
  )
}

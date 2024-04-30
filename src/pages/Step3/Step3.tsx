import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, Await } from 'react-router-dom'

import { Card } from '@/components/common/Card'
import { Loader } from '@/components/common/Loader'
import { OffentligTP } from '@/components/stegvisning/OffentligTP'
import { paths } from '@/router/constants'
import { GetTpoMedlemskapQuery, useStep3AccessData } from '@/router/loaders'
import { useAppDispatch } from '@/state/hooks'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step3() {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loaderData = useStep3AccessData()

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step3',
    })
  }, [])

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate(paths.login, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  const onPrevious = (): void => {
    navigate(paths.samtykke)
  }

  const onNext = (): void => {
    navigate(paths.afp, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  return (
    <>
      <React.Suspense
        fallback={
          <Loader
            data-testid="loader"
            size="3xlarge"
            title={intl.formatMessage({ id: 'pageframework.loading' })}
          />
        }
      >
        <Await resolve={loaderData.getTpoMedlemskapQuery}>
          {(getTpoMedlemskapQuery: GetTpoMedlemskapQuery) => {
            return getTpoMedlemskapQuery.isError ? (
              <Card hasLargePadding hasMargin>
                <Card.Content
                  onPrimaryButtonClick={onNext}
                  onSecondaryButtonClick={onPrevious}
                  onTertiaryButtonClick={onCancel}
                  text={{
                    header: 'stegvisning.offentligtp.error.title',
                    ingress: 'stegvisning.offentligtp.error.ingress',
                    primaryButton: 'stegvisning.neste',
                    secondaryButton: 'stegvisning.tilbake',
                    tertiaryButton: 'stegvisning.avbryt',
                  }}
                />
              </Card>
            ) : (
              <OffentligTP
                // TODO PEK-400 dette er overført til Loader, se om det virker
                // shouldJumpOverStep={
                //   getTpoMedlemskapQuery.isSuccess &&
                //   !getTpoMedlemskapQuery.data.harTjenestepensjonsforhold
                // }
                onCancel={onCancel}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            )
          }}
        </Await>
      </React.Suspense>
    </>
  )
}

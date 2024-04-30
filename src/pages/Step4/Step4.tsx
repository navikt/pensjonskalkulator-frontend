import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, Await } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { AFP } from '@/components/stegvisning/AFP'
import { paths } from '@/router/constants'
import { GetEkskludertStatusQuery, useStep4AccessData } from '@/router/loaders'
import { useGetTpoMedlemskapQuery } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectSamtykke,
  selectAfp,
  selectSamboerFraSivilstand,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step4() {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loaderData = useStep4AccessData()
  const harSamtykket = useAppSelector(selectSamtykke)
  const harSamboer = useAppSelector(selectSamboerFraSivilstand)
  const previousAfp = useAppSelector(selectAfp)
  const { data: TpoMedlemskap, isSuccess: isTpoMedlemskapQuerySuccess } =
    useGetTpoMedlemskapQuery(undefined, { skip: !harSamtykket })

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step4',
    })
  }, [])

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate(paths.login, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  const onPrevious = (): void => {
    if (
      isTpoMedlemskapQuerySuccess &&
      TpoMedlemskap.harTjenestepensjonsforhold
    ) {
      return navigate(paths.offentligTp)
    } else {
      return navigate(paths.samtykke)
    }
  }

  const onNext = (afpData: AfpRadio): void => {
    dispatch(userInputActions.setAfp(afpData))
    navigate(paths.ufoeretrygd, {
      state: { previousLocationPathname: location.pathname },
    })
  }

  return (
    <>
      <React.Suspense
        fallback={
          <div style={{ width: '100%' }}>
            <Loader
              data-testid="step4-loader"
              size="3xlarge"
              title={intl.formatMessage({ id: 'pageframework.loading' })}
              isCentered
            />
          </div>
        }
      >
        <Await resolve={loaderData.getEkskludertStatusQuery}>
          {(getEkskludertStatusQuery: GetEkskludertStatusQuery) => {
            return (
              <AFP
                // TODO PEK-400 bør endres til harSamboer på en side, og harUføreTrygd på den andre (fordi harUføreTrygd skal sjekkes i tillegg til afp valget i AFP komponent)
                // Sjekjke hvordan isLastStep vises avhengig av de ulike feilene
                isLastStep={
                  !!harSamboer &&
                  !(
                    getEkskludertStatusQuery.data?.aarsak ===
                    'HAR_LOEPENDE_UFOERETRYGD'
                  )
                }
                afp={previousAfp}
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

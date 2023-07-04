import { Suspense } from 'react'
import { useNavigate, Await } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { OffentligTP } from '@/components/stegvisning/OffentligTP'
import { useAppDispatch } from '@/state/hooks'
import { userInputActions } from '@/state/userInput/userInputReducer'

import { TpoMedlemskapQuery, useStep3LoaderData } from './utils'
import { paths } from '@/routes'

export function Step3() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loaderData = useStep3LoaderData()

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate(paths.root)
  }

  const onPrevious = (): void => {
    navigate(paths.samtykke)
  }

  const onNext = (): void => {
    navigate(paths.afp)
  }

  return (
    <>
      <Suspense fallback={<Loader data-testid="loader" size="3xlarge" />}>
        <Await
          resolve={loaderData.getTpoMedlemskapQuery}
          // errorElement={} //TODO hva gjør vi når kall til tp-registret feiler?
        >
          {(getTpoMedlemskapQuery: TpoMedlemskapQuery) => {
            return (
              <OffentligTP
                shouldJumpOverStep={
                  getTpoMedlemskapQuery.isSuccess &&
                  !getTpoMedlemskapQuery.data.harTjenestepensjonsforhold
                }
                onCancel={onCancel}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            )
          }}
        </Await>
      </Suspense>
    </>
  )
}

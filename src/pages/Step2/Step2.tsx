import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { Samtykke } from '@/components/stegvisning/Samtykke'
import { paths } from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectSamtykke,
  selectHarHentetTpoMedlemskap,
  selectIsVeileder,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step2() {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const harSamtykket = useAppSelector(selectSamtykke)
  const shouldFlush = useAppSelector(selectHarHentetTpoMedlemskap)
  const isVeileder = useAppSelector(selectIsVeileder)

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step2',
    })
  }, [])

  const onNext = (samtykkeData: BooleanRadio) => {
    const samtykke = samtykkeData === 'ja'
    dispatch(userInputActions.setSamtykke(samtykke))
    if (shouldFlush && !samtykke) {
      apiSlice.util.invalidateTags(['TpoMedlemskap', 'Pensjonsavtaler'])
    }
    navigate(paths.offentligTp)
  }

  const onCancel = isVeileder
    ? undefined
    : (): void => {
        dispatch(userInputActions.flush())
        navigate(paths.login)
      }

  const onPrevious = (): void => {
    navigate(paths.utenlandsopphold)
  }

  return (
    <Samtykke
      harSamtykket={harSamtykket}
      onCancel={onCancel}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  )
}

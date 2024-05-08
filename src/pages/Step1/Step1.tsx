import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { Utenlandsopphold } from '@/components/stegvisning/Utenlandsopphold'
import { paths, henvisningUrlParams } from '@/router/constants'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectUtenlandsopphold } from '@/state/userInput/selectors'
import { selectIsVeileder } from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step1() {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const harUtenlandsopphold = useAppSelector(selectUtenlandsopphold)
  const isVeileder = useAppSelector(selectIsVeileder)

  React.useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.stegvisning.step1',
    })
  }, [])

  const onNext = (utenlandsoppholdData: BooleanRadio) => {
    const utenlandsopphold = utenlandsoppholdData === 'ja'
    if (utenlandsopphold) {
      navigate(`${paths.henvisning}/${henvisningUrlParams.utland}`)
    } else {
      dispatch(userInputActions.setUtenlandsopphold(utenlandsopphold))
      navigate(paths.samtykke)
    }
  }

  // Fjern onCancel vis person er veileder
  const onCancel = isVeileder
    ? undefined
    : (): void => {
        dispatch(userInputActions.flush())
        navigate(paths.login)
      }

  const onPrevious = (): void => {
    navigate(paths.start)
  }

  return (
    <Utenlandsopphold
      harUtenlandsopphold={harUtenlandsopphold}
      onCancel={onCancel}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  )
}

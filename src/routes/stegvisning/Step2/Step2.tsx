import { useNavigate } from 'react-router-dom'

import { Samtykke, SamtykkeRadio } from '@/components/stegvisning/Samtykke'
import { apiSlice } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectSamtykke } from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'

export function Step2() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const harSamtykket = useAppSelector(selectSamtykke)

  const onNext = (samtykkeData: SamtykkeRadio) => {
    const samtykke = samtykkeData === 'ja'
    dispatch(userInputActions.setSamtykke(samtykke))
    if (samtykke) {
      dispatch(apiSlice.endpoints.getPensjonsavtaler.initiate())
      navigate('/offentlig-tp')
    } else {
      navigate('/afp')
      dispatch(apiSlice.util.resetApiState())
    }
  }

  const onCancel = (): void => {
    dispatch(userInputActions.flush())
    navigate('/')
  }

  const onPrevious = (): void => {
    dispatch(userInputActions.flush())
    navigate('/start')
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

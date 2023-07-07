import { useNavigate } from 'react-router-dom'

import { Start } from '@/components/stegvisning/Start'
import { paths } from '@/routes'
import { apiSlice } from '@/state/api/apiSlice'
import { useGetPersonQuery } from '@/state/api/apiSlice'
import { useAppDispatch } from '@/state/hooks'

export function Step1() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: person, isError, isSuccess } = useGetPersonQuery()

  const onCancel = (): void => {
    navigate(paths.root)
  }

  const onNext = (): void => {
    navigate(paths.samtykke)
    if (isError || person?.sivilstand === null) {
      dispatch(apiSlice.util.invalidateTags(['Person']))
    }
  }

  return isError || (isSuccess && person?.fornavn) ? (
    <Start
      fornavn={isSuccess && person?.fornavn ? person.fornavn : ''}
      onCancel={onCancel}
      onNext={onNext}
    />
  ) : (
    <></>
  )
}

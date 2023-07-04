import { useNavigate } from 'react-router-dom'

import { Start } from '@/components/stegvisning/Start'
import { useGetPersonQuery } from '@/state/api/apiSlice'
import { paths } from '@/routes'

export function Step1() {
  const navigate = useNavigate()
  const { data: person, isError } = useGetPersonQuery()

  const onCancel = (): void => {
    navigate(paths.root)
  }

  const onNext = (): void => {
    navigate(paths.samtykke)
  }

  return isError || person?.fornavn ? (
    <Start
      fornavn={!isError ? person?.fornavn : ''}
      onCancel={onCancel}
      onNext={onNext}
    />
  ) : (
    <></>
  )
}

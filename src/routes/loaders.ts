import { LoaderFunction } from 'react-router-dom'

import { apiSlice } from '@/state/api/apiSlice'
import { store } from '@/state/store'

export const uttaksalderLoader = (async ({ request }) => {
  const promise = store.dispatch(
    apiSlice.endpoints.tidligsteUttaksalder.initiate()
  )
  request.signal.onabort = promise.abort

  return await promise
}) satisfies LoaderFunction

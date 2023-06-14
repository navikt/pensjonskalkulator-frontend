import { useLoaderData } from 'react-router-dom'

import { uttaksalderLoader } from '@/routes/loaders'

export const useTidligsteUttaksalder = () => {
  return useLoaderData() as Awaited<ReturnType<typeof uttaksalderLoader>>
}

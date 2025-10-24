import type { components } from '../../../src/types/schema.d.ts'
import { type RouteDefinition } from '../../base'
import { loadJSONMock } from '../mock'

type TidligsteUttaksalderMockOptions = Partial<
  components['schemas']['UttaksalderResultV2']
>

export const tidligsteUttaksalder = async (
  options: TidligsteUttaksalderMockOptions = {}
): Promise<RouteDefinition> => {
  const tidligsteUttaksalderMock = (await loadJSONMock(
    'tidligste-uttaksalder.json'
  )) as components['schemas']['UttaksalderResultV2']

  return {
    url: /\/pensjon\/kalkulator\/api\/v2\/tidligste-hel-uttaksalder/,
    jsonResponse: {
      ...tidligsteUttaksalderMock,
      ...options,
    },
  }
}

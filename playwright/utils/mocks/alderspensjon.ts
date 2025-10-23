import type { components } from '../../../src/types/schema.d.ts'
import { type RouteDefinition } from '../../base'
import { loadJSONMock } from '../mock'

type AlderspensjonMockOptions = Partial<
  components['schemas']['PersonligSimuleringResultV8']
> & {
  preset?: 'endring' | 'for_lite_trygdetid' | 'med_afp_offentlig'
}

export const alderspensjon = async (
  options: AlderspensjonMockOptions = {}
): Promise<RouteDefinition> => {
  const { preset, ...overrides } = options

  let mockFileName = 'alderspensjon.json'
  if (preset === 'endring') {
    mockFileName = 'alderspensjon_endring.json'
  } else if (preset === 'for_lite_trygdetid') {
    mockFileName = 'alderspensjon_for_lite_trygdetid.json'
  } else if (preset === 'med_afp_offentlig') {
    mockFileName = 'alderspensjon_med_afp_offentlig.json'
  }

  const alderspensjonMock = (await loadJSONMock(
    mockFileName
  )) as components['schemas']['PersonligSimuleringResultV8']

  return {
    url: /\/pensjon\/kalkulator\/api\/v8\/alderspensjon\/simulering/,
    jsonResponse: {
      ...alderspensjonMock,
      ...overrides,
    },
  }
}

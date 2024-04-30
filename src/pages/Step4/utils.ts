import { paths } from '@/router/constants'

export function getNesteSide(
  harSamboer: boolean | null,
  isInntektError?: boolean,
  isEkskludertError?: boolean
): string {
  if (harSamboer === null || isInntektError || isEkskludertError) {
    return paths.uventetFeil
  } else {
    return harSamboer ? paths.beregningEnkel : paths.sivilstand
  }
}

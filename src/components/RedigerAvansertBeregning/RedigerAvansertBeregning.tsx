import React from 'react'

import { AvansertSkjemaForAndreBrukere } from '../AvansertSkjema/AvansertSkjemaForAndreBrukere'
import { useAppSelector } from '@/state/hooks'
import { selectLoependeVedtak } from '@/state/userInput/selectors'

// TODO PEK-1026 skrive tester
// TODO PEK-1026 - se om vilkaarsproeving kan hentes direkte fra skjemae-komponentene og FormButton for å unngå prop-drilling
export const RedigerAvansertBeregning: React.FC<{
  vilkaarsproeving?: Vilkaarsproeving
}> = ({ vilkaarsproeving }) => {
  const loependeVedtak = useAppSelector(selectLoependeVedtak)

  return loependeVedtak.ufoeretrygd.grad &&
    loependeVedtak.ufoeretrygd.grad !== 100 ? (
    // TODO PEK-1026 - erstatte denne komponenten til AvansertSkjemaForBrukereMedGradertUfoeretrygd
    <AvansertSkjemaForAndreBrukere vilkaarsproeving={vilkaarsproeving} />
  ) : (
    <AvansertSkjemaForAndreBrukere vilkaarsproeving={vilkaarsproeving} />
  )
}

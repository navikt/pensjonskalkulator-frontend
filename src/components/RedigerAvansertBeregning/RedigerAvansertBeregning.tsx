import React from 'react'

import { AvansertSkjemaForAndreBrukere } from '../AvansertSkjema/AvansertSkjemaForAndreBrukere'
import { AvansertSkjemaForBrukereMedGradertUfoeretrygd } from '../AvansertSkjema/AvansertSkjemaForBrukereMedGradertUfoeretrygd'
import { AvansertSkjemaForBrukereMedKap19Afp } from '../AvansertSkjema/AvansertSkjemaForBrukereMedKap19Afp'
import { useAppSelector } from '@/state/hooks'
import {
  selectFoedselsdato,
  selectLoependeVedtak,
} from '@/state/userInput/selectors'

// TODO PEK-1026 - se om vilkaarsproeving kan hentes direkte fra skjema-komponentene og FormButton for å unngå prop-drilling
export const RedigerAvansertBeregning: React.FC<{
  vilkaarsproeving?: Vilkaarsproeving
}> = ({ vilkaarsproeving }) => {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const foedselsdato = useAppSelector(selectFoedselsdato)

  // TODO Ny komponent <AvansertSkjemaForBrukereMedKap19AFP />

  return foedselsdato && new Date(foedselsdato).getFullYear() < 1963 ? (
    <AvansertSkjemaForBrukereMedKap19Afp vilkaarsproeving={vilkaarsproeving} />
  ) : loependeVedtak.ufoeretrygd.grad &&
    loependeVedtak.ufoeretrygd.grad !== 100 ? (
    <AvansertSkjemaForBrukereMedGradertUfoeretrygd
      vilkaarsproeving={vilkaarsproeving}
    />
  ) : (
    <AvansertSkjemaForAndreBrukere vilkaarsproeving={vilkaarsproeving} />
  )
}

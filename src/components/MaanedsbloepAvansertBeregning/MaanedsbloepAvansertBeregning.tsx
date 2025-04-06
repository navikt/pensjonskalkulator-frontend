import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Heading, HStack } from '@navikt/ds-react'

import {
  hentSumOffentligTjenestepensjonVedUttak,
  hentSumPensjonsavtalerVedUttak,
} from '../Pensjonsavtaler/utils'
import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'

import { MaanedsbeloepBoks } from './MaanedsbeleopBoks'

interface Props {
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  offentligTp?: OffentligTp
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = ({
  alderspensjonMaanedligVedEndring,
  afpPrivatListe,
  afpOffentligListe,
  pensjonsavtaler,
  offentligTp,
}) => {
  const alderpensjonHel =
    alderspensjonMaanedligVedEndring?.heltUttakMaanedligBeloep

  const alderspensjonGradert =
    alderspensjonMaanedligVedEndring?.gradertUttakMaanedligBeloep

  const afpOffentlig = afpOffentligListe?.length
    ? Math.round(afpOffentligListe[0].beloep / 12)
    : undefined

  const afpPrivat = afpPrivatListe?.length
    ? Math.round(afpPrivatListe[0].beloep / 12)
    : undefined

  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const sumPensjonsavtaler = (type: 'gradert' | 'helt') =>
    pensjonsavtaler && uttaksalder
      ? type === 'helt'
        ? hentSumPensjonsavtalerVedUttak(pensjonsavtaler, uttaksalder)
        : gradertUttaksperiode
          ? hentSumPensjonsavtalerVedUttak(
              pensjonsavtaler,
              gradertUttaksperiode.uttaksalder
            )
          : 0
      : 0

  const sumTjenestepensjon = (type: 'gradert' | 'helt') => {
    return offentligTp && uttaksalder
      ? type === 'helt'
        ? hentSumOffentligTjenestepensjonVedUttak(offentligTp, uttaksalder)
        : gradertUttaksperiode
          ? hentSumOffentligTjenestepensjonVedUttak(
              offentligTp,
              gradertUttaksperiode.uttaksalder
            )
          : 0
      : 0
  }

  return (
    <>
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>
      <HStack gap="8" width="100%">
        {gradertUttaksperiode && (
          <MaanedsbeloepBoks
            alder={gradertUttaksperiode.uttaksalder}
            grad={gradertUttaksperiode.grad}
            afp={afpOffentlig || afpPrivat}
            pensjonsavtale={
              sumPensjonsavtaler('gradert') + sumTjenestepensjon('gradert')
            }
            alderspensjon={alderspensjonGradert}
          />
        )}
        {uttaksalder && (
          <MaanedsbeloepBoks
            alder={uttaksalder}
            grad={100}
            afp={afpOffentlig || afpPrivat}
            pensjonsavtale={
              sumPensjonsavtaler('helt') + sumTjenestepensjon('helt')
            }
            alderspensjon={alderpensjonHel}
          />
        )}
      </HStack>
    </>
  )
}

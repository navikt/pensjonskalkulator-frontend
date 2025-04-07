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

  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const sumPensjonsavtaler = (type: 'gradert' | 'helt') => {
    if (!pensjonsavtaler || !uttaksalder) return 0

    if (type === 'helt') {
      return hentSumPensjonsavtalerVedUttak(pensjonsavtaler, uttaksalder)
    }

    return gradertUttaksperiode
      ? hentSumPensjonsavtalerVedUttak(
          pensjonsavtaler,
          gradertUttaksperiode.uttaksalder
        )
      : 0
  }

  const sumTjenestepensjon = (type: 'gradert' | 'helt') => {
    if (!offentligTp || !uttaksalder) return 0

    const alder =
      type === 'helt' ? uttaksalder : gradertUttaksperiode?.uttaksalder

    return alder
      ? hentSumOffentligTjenestepensjonVedUttak(offentligTp, alder)
      : 0
  }

  const afpVedUttak = (type: 'offentlig' | 'privat', alder: Alder | null) => {
    if (!alder) return undefined
    if (type === 'offentlig') {
      return afpOffentligListe?.length
        ? Math.round(afpOffentligListe[0].beloep / (12 - alder.maaneder))
        : undefined
    } else {
      return afpPrivatListe?.length
        ? Math.round(afpPrivatListe[0].beloep / (12 - alder.maaneder))
        : undefined
    }
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
            afp={
              afpVedUttak('offentlig', gradertUttaksperiode.uttaksalder) ||
              afpVedUttak('privat', gradertUttaksperiode.uttaksalder)
            }
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
            afp={
              afpVedUttak('offentlig', uttaksalder) ||
              afpVedUttak('privat', uttaksalder)
            }
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

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

  const afpVedUttak = (
    ordning: 'offentlig' | 'privat',
    type: 'gradert' | 'helt'
  ) => {
    const liste = ordning === 'offentlig' ? afpOffentligListe : afpPrivatListe

    const alder =
      type === 'helt' ? uttaksalder : gradertUttaksperiode?.uttaksalder

    if (!liste?.length) return undefined

    return liste.find((utbetaling) => utbetaling.alder === alder?.aar)
      ?.maanedligBeloep
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
              afpVedUttak('offentlig', 'gradert') ||
              afpVedUttak('privat', 'gradert')
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
              afpVedUttak('offentlig', 'helt') || afpVedUttak('privat', 'helt')
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

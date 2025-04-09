import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Box, HStack, Heading, ReadMore, VStack } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'

import {
  hentSumOffentligTjenestepensjonVedUttak,
  hentSumPensjonsavtalerVedUttak,
} from '../Pensjonsavtaler/utils'
import { MaanedsbeloepBoks } from './MaanedsbeleopBoks'
import { MaanedsbeloepMobil } from './MaanedsbeloepMobil'

import styles from './MaanedsbloepAvansertBeregning.module.scss'

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
  const intl = useIntl()

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
    if (!alder) return undefined

    return liste.findLast((utbetaling) => alder.aar >= utbetaling.alder)
      ?.maanedligBeloep
  }

  if (!uttaksalder) {
    return null
  }

  return (
    <>
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>
      <HStack gap="8" width="100%" className={styles.maanedsbeloepDesktopOnly}>
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
      {gradertUttaksperiode ? (
        <Box
          marginBlock="1 0"
          borderRadius="medium"
          paddingInline="6"
          paddingBlock="4"
          background="bg-subtle"
          className={styles.maanedsbeloepMobileOnly}
        >
          <VStack gap="2">
            <ReadMore
              defaultOpen={true}
              header={
                intl.formatMessage({
                  id: 'beregning.avansert.maanedsbeloep.tittel_1',
                }) + formatUttaksalder(intl, gradertUttaksperiode.uttaksalder)
              }
            >
              <MaanedsbeloepMobil
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
            </ReadMore>

            <ReadMore
              header={
                intl.formatMessage({
                  id: 'beregning.avansert.maanedsbeloep.tittel_1',
                }) + formatUttaksalder(intl, uttaksalder)
              }
            >
              <MaanedsbeloepMobil
                alder={uttaksalder}
                grad={100}
                afp={
                  afpVedUttak('offentlig', 'helt') ||
                  afpVedUttak('privat', 'helt')
                }
                pensjonsavtale={
                  sumPensjonsavtaler('helt') + sumTjenestepensjon('helt')
                }
                alderspensjon={alderpensjonHel}
              />
            </ReadMore>
          </VStack>
        </Box>
      ) : (
        <div className={styles.maanedsbeloepMobileOnly}>
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
        </div>
      )}
    </>
  )
}

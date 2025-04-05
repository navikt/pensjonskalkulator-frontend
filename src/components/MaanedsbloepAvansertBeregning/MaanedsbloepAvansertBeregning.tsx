import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Box, Heading, HStack, VStack } from '@navikt/ds-react'

import { hentSumPensjonsavtalerVedUttak } from '../Pensjonsavtaler/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import { formatUttaksalder, transformUttaksalderToDate } from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'

import styles from './MaanedsbloepAvansertBeregning.module.scss'

interface Props {
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  offentligTp?: UtbetalingsperiodeOffentligTP[]
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = ({
  alderspensjonMaanedligVedEndring,
  afpPrivatListe,
  afpOffentligListe,
  pensjonsavtaler,
}) => {
  const intl = useIntl()

  const alderpensjonHel =
    alderspensjonMaanedligVedEndring?.heltUttakMaanedligBeloep

  const alderspeonsjonGradert =
    alderspensjonMaanedligVedEndring?.gradertUttakMaanedligBeloep

  const afpOffentlig = afpOffentligListe?.[0].beloep
    ? Math.round(afpOffentligListe?.[0].beloep / 12)
    : undefined

  const afpPrivat = afpPrivatListe?.[0].beloep
    ? Math.round(afpPrivatListe?.[0].beloep / 12)
    : undefined

  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const foedselsdato = useAppSelector(selectFoedselsdato)
  const sumPensjonsavtaler =
    pensjonsavtaler && uttaksalder
      ? hentSumPensjonsavtalerVedUttak(pensjonsavtaler, uttaksalder)
      : undefined

  const summerYtelser = (type: string) => {
    return (
      (afpOffentlig || 0) +
      (afpPrivat || 0) +
      (sumPensjonsavtaler || 0) +
      ((type === 'gradert' ? alderspeonsjonGradert : alderpensjonHel) || 0)
    )
  }

  const formatertAlderTittel = (alder: Alder) => {
    return formatUttaksalder(intl, {
      aar: alder.aar,
      maaneder: alder.maaneder,
    })
  }

  const hentUttaksmaaned = (uttak: Alder) => {
    const date = transformUttaksalderToDate(uttak, foedselsdato!)
    const [day, month, year] = date!.split('.')
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('no-NO', {
      month: 'long',
    })
  }

  return (
    <>
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>
      <HStack gap="8" width="100%">
        {gradertUttaksperiode && (
          <Box
            marginBlock="1 0"
            borderRadius="medium"
            paddingInline="6"
            paddingBlock="4"
            background="bg-subtle"
            flexGrow="1"
          >
            <VStack className={styles.maanedsbeloep} gap="1">
              <BodyLong size="medium" weight="semibold">
                <FormattedMessage
                  id="beregning.avansert.maanedsbeloep.tittel_1"
                  values={{
                    aar: uttaksalder?.aar,
                    maaned: uttaksalder?.maaneder,
                  }}
                />
                {formatertAlderTittel(gradertUttaksperiode.uttaksalder)}
              </BodyLong>
              {(afpOffentlig || afpPrivat) && (
                <div>
                  <BodyLong size="medium">
                    <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />
                    :
                  </BodyLong>
                  {formatInntekt((afpOffentlig ?? 0) + (afpPrivat ?? 0))} kr
                </div>
              )}
              {pensjonsavtaler && (
                <div>
                  <BodyLong size="medium">
                    <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
                    :
                  </BodyLong>
                  {formatInntekt(0)} kr
                </div>
              )}
              {gradertUttaksperiode && (
                <div>
                  <BodyLong size="medium">
                    <FormattedMessage
                      id="beregning.avansert.maanedsbeloep.alderspensjon"
                      values={{ prosent: gradertUttaksperiode.grad }}
                    />
                    :
                  </BodyLong>
                  {formatInntekt(
                    alderspensjonMaanedligVedEndring?.gradertUttakMaanedligBeloep
                  )}{' '}
                  kr
                </div>
              )}
              <div>
                <BodyLong size="medium">
                  <FormattedMessage
                    id="beregning.avansert.maanedsbeloep.sum"
                    values={{
                      maaned: hentUttaksmaaned(
                        gradertUttaksperiode.uttaksalder!
                      ),
                    }}
                  />
                  :
                </BodyLong>
                {formatInntekt(summerYtelser('gradert'))} kr
              </div>
            </VStack>
          </Box>
        )}
        <Box
          marginBlock="1 0"
          borderRadius="medium"
          paddingInline="6"
          paddingBlock="4"
          background="bg-subtle"
          maxWidth="500px"
          flexGrow="1"
        >
          <VStack className={styles.maanedsbeloep} gap="1">
            <BodyLong size="medium" weight="semibold">
              <FormattedMessage
                id="beregning.avansert.maanedsbeloep.tittel_1"
                values={{
                  aar: uttaksalder?.aar,
                  maaned: uttaksalder?.maaneder,
                }}
              />
              {formatertAlderTittel(uttaksalder!)}
            </BodyLong>
            {(afpOffentlig || afpPrivat) && (
              <div>
                <BodyLong size="medium">
                  <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />
                  :
                </BodyLong>
                {formatInntekt((afpOffentlig ?? 0) + (afpPrivat ?? 0))} kr
              </div>
            )}
            {pensjonsavtaler && (
              <div>
                <BodyLong size="medium">
                  <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
                  :
                </BodyLong>
                {formatInntekt(sumPensjonsavtaler ?? 0)} kr
              </div>
            )}
            {alderpensjonHel && (
              <div>
                <BodyLong size="medium">
                  <FormattedMessage
                    id="beregning.avansert.maanedsbeloep.alderspensjon"
                    values={{ prosent: 100 }}
                  />
                  :
                </BodyLong>
                {formatInntekt(alderpensjonHel)} kr
              </div>
            )}
            <div>
              <BodyLong size="medium">
                <FormattedMessage
                  id="beregning.avansert.maanedsbeloep.sum"
                  values={{ maaned: hentUttaksmaaned(uttaksalder!) }}
                />
                :
              </BodyLong>
              {formatInntekt(summerYtelser('helt'))} kr
            </div>
          </VStack>
        </Box>
      </HStack>
    </>
  )
}

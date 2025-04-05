import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Box, Heading, HStack, VStack } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import { formatUttaksalder, transformUttaksalderToDate } from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'

import styles from './MaanedsbloepAvansertBeregning.module.scss'

interface Props {
  pensjonsavtaler?: number
  alderspensjon?: AlderspensjonResponseBody
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = ({
  pensjonsavtaler,
  alderspensjon,
}) => {
  const intl = useIntl()

  const alderpensjonHel =
    alderspensjon?.alderspensjonMaanedligVedEndring?.heltUttakMaanedligBeloep

  const alderspeonsjonGradert =
    alderspensjon?.alderspensjonMaanedligVedEndring?.gradertUttakMaanedligBeloep

  const afp = alderspensjon?.afpOffentlig?.[0].beloep

  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const foedselsdato = useAppSelector(selectFoedselsdato)

  const summerYtelser = (type: string) => {
    return (
      (afp || 0) +
      (pensjonsavtaler || 0) +
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
              {afp && (
                <div>
                  <BodyLong size="medium">
                    <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />
                    :
                  </BodyLong>
                  {formatInntekt(afp)} kr
                </div>
              )}
              {pensjonsavtaler && (
                <div>
                  <BodyLong size="medium">
                    <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
                    :
                  </BodyLong>
                  {formatInntekt(pensjonsavtaler)} kr
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
                    alderspensjon?.alderspensjonMaanedligVedEndring
                      ?.gradertUttakMaanedligBeloep
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
            {afp && (
              <div>
                <BodyLong size="medium">
                  <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />
                  :
                </BodyLong>
                {formatInntekt(afp)} kr
              </div>
            )}
            {pensjonsavtaler && (
              <div>
                <BodyLong size="medium">
                  <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
                  :
                </BodyLong>
                {formatInntekt(pensjonsavtaler)} kr
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

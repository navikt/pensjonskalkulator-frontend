import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { useGetPersonQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloep,
  selectCurrentSimulation,
  selectIsEndring,
} from '@/state/userInput/selectors'
import {
  BodyLong,
  BodyShort,
  Box,
  Heading,
  HStack,
  VStack,
} from '@navikt/ds-react'
import { getFormatMessageValues } from '@/utils/translations'
import { formatInntekt } from '@/utils/inntekt'
import styles from './MaanedsbloepAvansertBeregning.module.scss'

interface Props {
  alderpensjonHel: number
  alderspeonsjonGradert?: number
  afp?: number
  pensjonsavtaler?: number
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = ({
  alderpensjonHel,
  alderspeonsjonGradert,
  afp,
  pensjonsavtaler,
}) => {
  const sum =
    alderpensjonHel +
    (alderspeonsjonGradert || 0) +
    (afp || 0) +
    (pensjonsavtaler || 0)
  return (
    <>
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>
      <Box
        marginBlock="1 0"
        borderRadius="medium"
        paddingInline="6"
        paddingBlock="4"
        background="bg-subtle"
        maxWidth="500px"
      >
        <VStack className={styles.maanedsbeloepContainer} gap="1">
          <BodyLong size="medium" weight="semibold">
            <FormattedMessage
              id="beregning.avansert.maanedsbeloep.tittel_1"
              values={{
                ...getFormatMessageValues(),
                aar: 62,
                maaned: 10,
              }}
            />
          </BodyLong>
          {afp && (
            <div>
              <BodyLong size="medium">
                <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
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
                values={{ maaned: 'juni' }}
              />
              :
            </BodyLong>
            {formatInntekt(sum)} kr
          </div>
        </VStack>
      </Box>
    </>
  )
}

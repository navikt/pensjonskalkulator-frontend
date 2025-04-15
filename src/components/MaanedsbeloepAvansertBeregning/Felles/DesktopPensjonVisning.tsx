import React from 'react'
import { useIntl } from 'react-intl'

import { BodyLong, Box, HStack, VStack } from '@navikt/ds-react'

import { formatUttaksalder } from '@/utils/alder'

import { Pensjonsdata } from '../hooks'
import { PensjonDataVisning } from './PensjonDataVisning'

import styles from '../MaanedsbeloepAvansertBeregning.module.scss'

interface Props {
  pensjonsdata: Pensjonsdata[]
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksmaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
}

export const DesktopPensjonVisning: React.FC<Props> = ({
  pensjonsdata,
  summerYtelser,
  hentUttaksmaanedOgAar,
}) => {
  const intl = useIntl()

  if (!pensjonsdata.length) return null

  return (
    <HStack gap="8" width="100%" className={styles.maanedsbeloepDesktopOnly}>
      {pensjonsdata.map((data, index) => (
        <Box
          key={`desktop-${index}`}
          marginBlock="1 0"
          borderRadius="medium"
          paddingInline="6"
          paddingBlock="4"
          background="bg-subtle"
          maxWidth={{ sm: '27rem', md: '31rem' }}
          flexGrow="1"
        >
          <VStack gap="1">
            <BodyLong
              size="medium"
              weight="semibold"
              data-testid="maanedsbeloep-desktop-title"
            >
              {intl.formatMessage({
                id: 'beregning.avansert.maanedsbeloep.box_title',
              })}
              {formatUttaksalder(intl, data.alder)}{' '}
              {data.alderspensjon &&
                !data.afp &&
                !data.pensjonsavtale &&
                `(${hentUttaksmaanedOgAar(data.alder).maaned} ${hentUttaksmaanedOgAar(data.alder).aar})`}
            </BodyLong>

            <PensjonDataVisning
              pensjonsdata={data}
              summerYtelser={summerYtelser}
              hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
            />
          </VStack>
        </Box>
      ))}
    </HStack>
  )
}

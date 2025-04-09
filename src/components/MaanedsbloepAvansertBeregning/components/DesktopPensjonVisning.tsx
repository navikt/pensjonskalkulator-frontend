import React from 'react'
import { useIntl } from 'react-intl'

import { BodyLong, Box, HStack, VStack } from '@navikt/ds-react'

import { formatUttaksalder } from '@/utils/alder'

import { PensionData } from '../hooks/usePensjonBeregninger'
import { PensjonDataVisning } from './PensjonDataVisning'

import styles from '../MaanedsbloepAvansertBeregning.module.scss'

interface Props {
  pensionData: PensionData[]
  summerYtelser: (data: PensionData) => number
  hentUttaksmaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
}

export const DesktopPensjonVisning: React.FC<Props> = ({
  pensionData,
  summerYtelser,
  hentUttaksmaanedOgAar,
}) => {
  const intl = useIntl()

  if (!pensionData.length) return null

  return (
    <HStack gap="8" width="100%" className={styles.maanedsbeloepDesktopOnly}>
      {pensionData.map((data, index) => (
        <Box
          key={`desktop-${index}`}
          marginBlock="1 0"
          borderRadius="medium"
          paddingInline="6"
          paddingBlock="4"
          background="bg-subtle"
          maxWidth="31rem"
          flexGrow="1"
        >
          <VStack gap="1">
            <BodyLong size="medium" weight="semibold">
              {intl.formatMessage({
                id: 'beregning.avansert.maanedsbeloep.tittel_1',
              })}
              {formatUttaksalder(intl, data.alder)}{' '}
              {data.alderspensjon &&
                !data.afp &&
                !data.pensjonsavtale &&
                `(${hentUttaksmaanedOgAar(data.alder).maaned})`}
            </BodyLong>

            <PensjonDataVisning
              pensionData={data}
              summerYtelser={summerYtelser}
              hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
            />
          </VStack>
        </Box>
      ))}
    </HStack>
  )
}

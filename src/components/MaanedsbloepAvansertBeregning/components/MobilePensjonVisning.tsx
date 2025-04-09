import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ReadMore, VStack } from '@navikt/ds-react'

import { formatUttaksalder } from '@/utils/alder'

import { PensionData } from '../hooks/usePensjonBeregninger'
import { PensjonDataVisning } from './PensjonDataVisning'

import styles from '../MaanedsbloepAvansertBeregning.module.scss'

interface Props {
  pensionData: PensionData[]
  summerYtelser: (data: PensionData) => number
  hentUttaksmaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
  harGradering: boolean
}

export const MobilePensjonVisning: React.FC<Props> = ({
  pensionData,
  summerYtelser,
  hentUttaksmaanedOgAar,
  harGradering,
}) => {
  const intl = useIntl()

  if (!pensionData.length) return null

  // If there's no gradert view, show desktop like view on mobile
  if (!harGradering) {
    return (
      <div className={styles.maanedsbeloepMobileOnly}>
        <Box
          marginBlock="1 0"
          borderRadius="medium"
          paddingInline="6"
          paddingBlock="4"
          background="bg-subtle"
        >
          <VStack gap="1">
            <PensjonDataVisning
              pensionData={pensionData[0]}
              summerYtelser={summerYtelser}
              hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
              isMobile={true}
            />
          </VStack>
        </Box>
      </div>
    )
  }

  // If there's gradert view, use ReadMore component
  return (
    <div className={styles.maanedsbeloepMobileOnly}>
      <Box
        marginBlock="1 0"
        borderRadius="medium"
        paddingInline="6"
        paddingBlock="4"
        background="bg-subtle"
      >
        <VStack gap="2">
          {pensionData.map((data, index) => (
            <ReadMore
              key={`mobile-${index}`}
              defaultOpen={index === 0}
              header={
                intl.formatMessage({
                  id: 'beregning.avansert.maanedsbeloep.tittel_1',
                }) + formatUttaksalder(intl, data.alder)
              }
            >
              <PensjonDataVisning
                pensionData={data}
                summerYtelser={summerYtelser}
                hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
                isMobile={true}
              />
            </ReadMore>
          ))}
        </VStack>
      </Box>
    </div>
  )
}

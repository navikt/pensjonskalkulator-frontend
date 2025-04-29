import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ReadMore, VStack } from '@navikt/ds-react'

import { formatUttaksalder } from '@/utils/alder'

import { Pensjonsdata } from '../hooks'
import { PensjonDataVisning } from './PensjonDataVisning'
import { PensjonVisningDesktop } from './PensjonVisningDesktop'

interface Props {
  pensjonsdata: Pensjonsdata[]
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksmaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
  harGradering: boolean
}

export const PensjonVisningMobil: React.FC<Props> = ({
  pensjonsdata,
  summerYtelser,
  hentUttaksmaanedOgAar,
  harGradering,
}) => {
  const intl = useIntl()

  if (!pensjonsdata.length) return null

  if (!harGradering) {
    return (
      <PensjonVisningDesktop
        pensjonsdata={pensjonsdata}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
      />
    )
  }

  return (
    <Box
      marginBlock="1 0"
      borderRadius="medium"
      padding="3"
      background="bg-subtle"
    >
      <VStack gap="2">
        {pensjonsdata.map((data, index) => (
          <ReadMore
            key={`mobile-${index}`}
            defaultOpen={index === 0}
            header={
              intl.formatMessage({
                id: 'beregning.avansert.maanedsbeloep.box_title',
              }) + formatUttaksalder(intl, data.alder)
            }
          >
            <PensjonDataVisning
              pensjonsdata={data}
              summerYtelser={summerYtelser}
              hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
            />
          </ReadMore>
        ))}
      </VStack>
    </Box>
  )
}

import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ReadMore, VStack } from '@navikt/ds-react'

import {
  UTTAKSALDER_FOR_AP_VED_PRE2025_OFFENTLIG_AFP,
  formatUttaksalder,
} from '@/utils/alder'

import { Pensjonsdata } from '../hooks'
import { PensjonDataVisning } from './PensjonDataVisning'
import { PensjonVisningDesktop } from './PensjonVisningDesktop'

interface Props {
  pensjonsdata: Pensjonsdata[]
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksmaanedOgAar: (alder: Alder) => string
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
    <Box marginBlock="2 0" borderRadius="medium">
      <VStack gap="2">
        {pensjonsdata.map((data, index) => {
          const formattedUttaksalder =
            data.alderspensjon && data.pre2025OffentligAfp
              ? `${UTTAKSALDER_FOR_AP_VED_PRE2025_OFFENTLIG_AFP.aar} år`
              : formatUttaksalder(intl, data.alder)
          // Vis kalender maaned når det er bare en ytelse
          const showKalenderMaaned =
            [
              data.alderspensjon,
              data.afp,
              data.pensjonsavtale,
              data.pre2025OffentligAfp,
            ].filter(Boolean).length === 1

          return (
            <ReadMore
              key={`mobile-${index}`}
              defaultOpen={index === 0}
              header={
                intl.formatMessage({
                  id: 'beregning.avansert.maanedsbeloep.box_title',
                }) +
                formattedUttaksalder +
                ((showKalenderMaaned &&
                  ` (${hentUttaksmaanedOgAar(data.alder)})`) ||
                  '')
              }
            >
              <PensjonDataVisning
                pensjonsdata={data}
                summerYtelser={summerYtelser}
                hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
              />
            </ReadMore>
          )
        })}
      </VStack>
    </Box>
  )
}

import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ReadMore, VStack } from '@navikt/ds-react'

import {
  TIDLIGST_UTTAKSALDER_FOR_AP_VED_PRE2025_OFFENTLIG_AFP,
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
    <Box
      marginBlock="2 0"
      borderRadius="medium"
      padding="3"
      background="bg-subtle"
    >
      <VStack gap="2">
        {pensjonsdata.map((data, index) => {
          const kapittel20AP =
            data.alderspensjon &&
            !data.afp &&
            !data.pensjonsavtale &&
            !data.pre2025OffentligAfp
          const kapittel19OffentligAFP =
            data.pre2025OffentligAfp && !data.alderspensjon

          const uttaksalder =
            data.alderspensjon && data.pre2025OffentligAfp
              ? `${TIDLIGST_UTTAKSALDER_FOR_AP_VED_PRE2025_OFFENTLIG_AFP.aar} år`
              : formatUttaksalder(intl, data.alder)
          return (
            <ReadMore
              key={`mobile-${index}`}
              defaultOpen={index === 0}
              header={
                intl.formatMessage({
                  id: 'beregning.avansert.maanedsbeloep.box_title',
                }) +
                uttaksalder +
                (((kapittel20AP || kapittel19OffentligAFP) &&
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

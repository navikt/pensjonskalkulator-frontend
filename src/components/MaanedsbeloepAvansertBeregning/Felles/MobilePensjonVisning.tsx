import React from 'react'
import { useIntl } from 'react-intl'

import { BodyLong, Box, ReadMore, VStack } from '@navikt/ds-react'

import { formatUttaksalder } from '@/utils/alder'

import { Pensjonsdata } from '../hooks'
import { PensjonDataVisning } from './PensjonDataVisning'

import styles from '../MaanedsbeloepAvansertBeregning.module.scss'

interface Props {
  pensjonsdata: Pensjonsdata[]
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksmaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
  harGradering: boolean
}

export const MobilePensjonVisning: React.FC<Props> = ({
  pensjonsdata,
  summerYtelser,
  hentUttaksmaanedOgAar,
  harGradering,
}) => {
  const intl = useIntl()

  if (!pensjonsdata.length) return null

  // If there's no gradert view, show desktop like view on mobile
  if (!harGradering) {
    const data = pensjonsdata[0]
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
            <BodyLong
              size="medium"
              weight="semibold"
              className={styles.maanedsbeloepMobileOnly}
            >
              {intl.formatMessage({
                id: 'beregning.avansert.maanedsbeloep.tittel_1',
              })}
              {formatUttaksalder(intl, data.alder)}{' '}
              {data.alderspensjon &&
                !data.afp &&
                !data.pensjonsavtale &&
                `(${hentUttaksmaanedOgAar(data.alder).maaned} ${hentUttaksmaanedOgAar(data.alder).aar})`}
            </BodyLong>
            <PensjonDataVisning
              pensjonsdata={pensjonsdata[0]}
              summerYtelser={summerYtelser}
              hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
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
          {pensjonsdata.map((data, index) => (
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
                pensjonsdata={data}
                summerYtelser={summerYtelser}
                hentUttaksMaanedOgAar={hentUttaksmaanedOgAar}
              />
            </ReadMore>
          ))}
        </VStack>
      </Box>
    </div>
  )
}

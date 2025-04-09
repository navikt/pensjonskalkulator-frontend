import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading } from '@navikt/ds-react'

import { DesktopPensjonVisning, MobilePensjonVisning } from './components'
import { usePensjonBeregninger } from './hooks/usePensjonBeregninger'

interface Props {
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  offentligTp?: OffentligTp
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = (props) => {
  // Use our custom hook to extract all calculation logic
  const {
    pensionData,
    summerYtelser,
    hentUttaksmaanedOgAar,
    harGradering,
    uttaksalder,
  } = usePensjonBeregninger(props)

  if (!uttaksalder) {
    return null
  }

  return (
    <Box marginBlock="10 0">
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>

      {/* Desktop view component */}
      <DesktopPensjonVisning
        pensionData={pensionData}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
      />

      {/* Mobile view component */}
      <MobilePensjonVisning
        pensionData={pensionData}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
        harGradering={harGradering}
      />
    </Box>
  )
}

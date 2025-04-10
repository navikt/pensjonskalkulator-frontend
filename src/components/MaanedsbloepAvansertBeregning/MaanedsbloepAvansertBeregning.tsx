import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading } from '@navikt/ds-react'

import { DesktopPensjonVisning, MobilePensjonVisning } from './components'
import { usePensjonBeregninger } from './hooks'

interface Props {
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  simuilertTjenesepensjon?: SimulertTjenestepensjon
}

export const MaanedsbloepAvansertBeregning: React.FC<Props> = (props) => {
  // Use our custom hook to extract all calculation logic
  const {
    pensjonsdata,
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

      <DesktopPensjonVisning
        pensjonsdata={pensjonsdata}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
      />

      <MobilePensjonVisning
        pensjonsdata={pensjonsdata}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
        harGradering={harGradering}
      />
    </Box>
  )
}

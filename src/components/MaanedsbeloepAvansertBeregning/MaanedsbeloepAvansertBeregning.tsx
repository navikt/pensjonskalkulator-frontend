import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading } from '@navikt/ds-react'

import { PensjonVisningDesktop, PensjonVisningMobil } from './Felles'
import { usePensjonBeregninger } from './hooks'

interface Props {
  afpPrivatListe?: AfpPensjonsberegning[]
  afpOffentligListe?: AfpPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  simulertTjenestepensjon?: SimulertTjenestepensjon
}

export const MaanedsbeloepAvansertBeregning: React.FC<Props> = (props) => {
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
    <Box marginBlock="10 0" data-testid="maanedsbloep-avansert-beregning">
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>

      <PensjonVisningDesktop
        pensjonsdata={pensjonsdata}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
      />

      <PensjonVisningMobil
        pensjonsdata={pensjonsdata}
        summerYtelser={summerYtelser}
        hentUttaksmaanedOgAar={hentUttaksmaanedOgAar}
        harGradering={harGradering}
      />
    </Box>
  )
}

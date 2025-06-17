import React from 'react'

import { VStack } from '@navikt/ds-react'

import { AfpDetaljer } from '../Felles/AfpDetaljer'
import { AlderspensjonDetaljer } from '../Felles/AlderspensjonDetaljer'
import { OpptjeningDetaljer } from '../Felles/OpptjeningDetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerMobilProps {
  alderspensjonDetaljerListe: DetaljRad[][]
  opptjeningKap19Liste: DetaljRad[]
  opptjeningKap20Liste: DetaljRad[]
  opptjeningAfpPrivatListe?: DetaljRad[][]
  opptjeningPre2025OffentligAfpListe?: DetaljRad[]
}

export const BeregningsdetaljerMobil: React.FC<
  BeregningsdetaljerMobilProps
> = ({
  alderspensjonDetaljerListe,
  opptjeningKap19Liste,
  opptjeningKap20Liste,
  opptjeningAfpPrivatListe,
  opptjeningPre2025OffentligAfpListe,
}) => (
  <VStack gap="4 8" width="100%" marginBlock="2 0">
    <AlderspensjonDetaljer
      alderspensjonDetaljerListe={alderspensjonDetaljerListe}
      hasPre2025OffentligAfpUttaksalder={Boolean(
        opptjeningPre2025OffentligAfpListe?.length
      )}
    />
    <OpptjeningDetaljer
      opptjeningKap19Liste={opptjeningKap19Liste}
      opptjeningKap20Liste={opptjeningKap20Liste}
    />
    <AfpDetaljer
      opptjeningAfpPrivatListe={opptjeningAfpPrivatListe}
      opptjeningPre2025OffentligAfpListe={opptjeningPre2025OffentligAfpListe}
    />
  </VStack>
)

import React from 'react'

import { HStack } from '@navikt/ds-react'

import { AfpDetaljer } from '../Felles/AfpDetaljer'
import { AlderspensjonDetaljer } from '../Felles/AlderspensjonDetaljer'
import { OpptjeningDetaljer } from '../Felles/OpptjeningDetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerDesktopProps {
  alderspensjonDetaljerListe: DetaljRad[][]
  opptjeningKap19Liste: DetaljRad[]
  opptjeningKap20Liste: DetaljRad[]
  opptjeningAfpPrivatListe?: DetaljRad[][]
  opptjeningPre2025OffentligAfpListe?: DetaljRad[]
}

export const BeregningsdetaljerDesktop: React.FC<
  BeregningsdetaljerDesktopProps
> = ({
  alderspensjonDetaljerListe,
  opptjeningKap19Liste,
  opptjeningKap20Liste,
  opptjeningAfpPrivatListe,
  opptjeningPre2025OffentligAfpListe,
}) => (
  <HStack gap="20" width="100%">
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
  </HStack>
)

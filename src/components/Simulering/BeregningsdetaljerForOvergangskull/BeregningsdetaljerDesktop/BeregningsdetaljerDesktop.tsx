import React from 'react'

import { HStack } from '@navikt/ds-react'

import { Afpdetaljer } from '../Felles/Afpdetaljer'
import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerDesktopProps {
  grunnpensjonListe: DetaljRad[][]
  opptjeningKap19Liste: DetaljRad[]
  opptjeningKap20Liste: DetaljRad[]
  opptjeningAfpPrivatListe?: DetaljRad[][]
  opptjeningPre2025OffentligAfpListe?: DetaljRad[]
}

export const BeregningsdetaljerDesktop: React.FC<
  BeregningsdetaljerDesktopProps
> = ({
  grunnpensjonListe,
  opptjeningKap19Liste,
  opptjeningKap20Liste,
  opptjeningAfpPrivatListe,
  opptjeningPre2025OffentligAfpListe,
}) => (
  <HStack gap="20" width="100%">
    <Grunnpensjonsdetaljer
      grunnpensjonListe={grunnpensjonListe}
      hasPre2025OffentligAfpUttaksalder={Boolean(
        opptjeningPre2025OffentligAfpListe?.length
      )}
    />
    <Opptjeningsdetaljer
      opptjeningKap19Liste={opptjeningKap19Liste}
      opptjeningKap20Liste={opptjeningKap20Liste}
    />
    <Afpdetaljer
      opptjeningAfpPrivatListe={opptjeningAfpPrivatListe}
      opptjeningPre2025OffentligAfpListe={opptjeningPre2025OffentligAfpListe}
    />
  </HStack>
)

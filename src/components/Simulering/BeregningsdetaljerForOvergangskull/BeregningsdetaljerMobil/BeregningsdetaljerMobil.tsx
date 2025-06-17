import React from 'react'

import { VStack } from '@navikt/ds-react'

import { Afpdetaljer } from '../Felles/Afpdetaljer'
import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerMobilProps {
  grunnpensjonListe: DetaljRad[][]
  opptjeningKap19Liste: DetaljRad[]
  opptjeningKap20Liste: DetaljRad[]
  opptjeningAfpPrivatListe?: DetaljRad[][]
  opptjeningPre2025OffentligAfpListe?: DetaljRad[]
}

export const BeregningsdetaljerMobil: React.FC<
  BeregningsdetaljerMobilProps
> = ({
  grunnpensjonListe,
  opptjeningKap19Liste,
  opptjeningKap20Liste,
  opptjeningAfpPrivatListe,
  opptjeningPre2025OffentligAfpListe,
}) => (
  <VStack gap="4 8" width="100%" marginBlock="2 0">
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
  </VStack>
)

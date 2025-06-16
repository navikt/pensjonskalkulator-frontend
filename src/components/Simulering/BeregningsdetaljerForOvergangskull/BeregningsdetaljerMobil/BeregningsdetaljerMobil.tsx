import React from 'react'

import { VStack } from '@navikt/ds-react'

import { Afpdetaljer } from '../Felles/Afpdetaljer'
import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerMobilProps {
  grunnpensjonObjekter: DetaljRad[][]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningAfpPrivatObjekt?: DetaljRad[][]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const BeregningsdetaljerMobil: React.FC<
  BeregningsdetaljerMobilProps
> = ({
  grunnpensjonObjekter,
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
  opptjeningAfpPrivatObjekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => (
  <VStack gap="4 8" width="100%" marginBlock="2 0">
    <Grunnpensjonsdetaljer grunnpensjonObjekter={grunnpensjonObjekter} />
    <Grunnpensjonsdetaljer grunnpensjonObjekter={grunnpensjonObjekter} />
    <Opptjeningsdetaljer
      opptjeningKap19Objekt={opptjeningKap19Objekt}
      opptjeningKap20Objekt={opptjeningKap20Objekt}
    />
    <Afpdetaljer
      opptjeningAfpPrivatObjekt={opptjeningAfpPrivatObjekt}
      opptjeningPre2025OffentligAfpObjekt={opptjeningPre2025OffentligAfpObjekt}
    />
  </VStack>
)

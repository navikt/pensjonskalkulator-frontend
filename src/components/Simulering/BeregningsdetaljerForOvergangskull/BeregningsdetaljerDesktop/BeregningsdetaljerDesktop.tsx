import React from 'react'

import { HStack } from '@navikt/ds-react'

import { Afpdetaljer } from '../Felles/Afpdetaljer'
import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerDesktopProps {
  grunnpensjonObjekter: DetaljRad[][]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningAfpPrivatObjekt?: DetaljRad[][]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const BeregningsdetaljerDesktop: React.FC<
  BeregningsdetaljerDesktopProps
> = ({
  grunnpensjonObjekter,
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
  opptjeningAfpPrivatObjekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => (
  <HStack gap="20" width="100%">
    <Grunnpensjonsdetaljer grunnpensjonObjekter={grunnpensjonObjekter} />
    <Opptjeningsdetaljer
      opptjeningKap19Objekt={opptjeningKap19Objekt}
      opptjeningKap20Objekt={opptjeningKap20Objekt}
    />
    <Afpdetaljer
      opptjeningAfpPrivatObjekt={opptjeningAfpPrivatObjekt}
      opptjeningPre2025OffentligAfpObjekt={opptjeningPre2025OffentligAfpObjekt}
    />
  </HStack>
)

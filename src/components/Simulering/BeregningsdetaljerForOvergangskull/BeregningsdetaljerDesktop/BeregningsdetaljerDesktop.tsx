import React from 'react'

import { HStack } from '@navikt/ds-react'

import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerDesktopProps {
  gradertUttaksperiode: GradertUttak | null
  uttaksalder: Alder | null
  grunnpensjonObjekt: DetaljRad[]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const BeregningsdetaljerDesktop: React.FC<
  BeregningsdetaljerDesktopProps
> = ({
  gradertUttaksperiode,
  uttaksalder,
  grunnpensjonObjekt,
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => (
  <HStack gap="20" width="100%">
    <Grunnpensjonsdetaljer
      grunnpensjonObjekt={grunnpensjonObjekt}
      gradertUttaksperiode={gradertUttaksperiode}
      uttaksalder={uttaksalder}
    />
    <Opptjeningsdetaljer
      opptjeningKap19Objekt={opptjeningKap19Objekt}
      opptjeningKap20Objekt={opptjeningKap20Objekt}
      opptjeningPre2025OffentligAfpObjekt={opptjeningPre2025OffentligAfpObjekt}
    />
  </HStack>
)

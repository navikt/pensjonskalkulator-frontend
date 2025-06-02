import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, Heading } from '@navikt/ds-react'

import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import { DetaljRad } from '../hooks'

export interface BeregningsdetaljerMobilProps {
  grunnpensjonObjekter: DetaljRad[][]
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const BeregningsdetaljerMobil: React.FC<
  BeregningsdetaljerMobilProps
> = ({
  grunnpensjonObjekter,
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => (
  <HStack gap="4 8" width="100%" marginBlock="2 0">
    <Heading size="small" level="3">
      <FormattedMessage id="maanedsbeloep.title" />
    </Heading>
    <Grunnpensjonsdetaljer grunnpensjonObjekter={grunnpensjonObjekter} />
    <Opptjeningsdetaljer
      opptjeningKap19Objekt={opptjeningKap19Objekt}
      opptjeningKap20Objekt={opptjeningKap20Objekt}
      opptjeningPre2025OffentligAfpObjekt={opptjeningPre2025OffentligAfpObjekt}
    />
  </HStack>
)

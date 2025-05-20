import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Heading, VStack } from '@navikt/ds-react'

import { Grunnpensjonsdetaljer } from '../Felles/Grunnpensjonsdetaljer'
import { Opptjeningsdetaljer } from '../Felles/Opptjeningsdetaljer'
import {
  GrunnpensjonDetaljer,
  OpptjeningKap19Detaljer,
  OpptjeningKap20Detaljer,
} from '../hooks'

export interface BeregningsdetaljerDesktopProps {
  gradertUttaksperiode: GradertUttak | null
  uttaksalder: Alder | null
  grunnpensjonListe: GrunnpensjonDetaljer[]
  opptjeningKap19Liste: OpptjeningKap19Detaljer[]
  opptjeningKap20Liste: OpptjeningKap20Detaljer[]
}

export const BeregningsdetaljerDesktop: React.FC<
  BeregningsdetaljerDesktopProps
> = ({
  gradertUttaksperiode,
  uttaksalder,
  grunnpensjonListe,
  opptjeningKap19Liste,
  opptjeningKap20Liste,
}) => (
  <VStack gap="4 8" width="100%" marginBlock="2 0">
    <Heading size="small" level="3">
      <FormattedMessage id="maanedsbeloep.title" />
    </Heading>
    <Grunnpensjonsdetaljer
      grunnpensjonListe={grunnpensjonListe}
      gradertUttaksperiode={gradertUttaksperiode}
      uttaksalder={uttaksalder}
    />
    <Opptjeningsdetaljer
      opptjeningKap19Liste={opptjeningKap19Liste}
      opptjeningKap20Liste={opptjeningKap20Liste}
    />
  </VStack>
)

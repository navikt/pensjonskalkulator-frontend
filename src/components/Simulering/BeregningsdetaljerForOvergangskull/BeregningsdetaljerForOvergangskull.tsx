import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'

import { BeregningsdetaljerDesktop } from './BeregningsdetaljerDesktop/BeregningsdetaljerDesktop'
import { BeregningsdetaljerMobil } from './BeregningsdetaljerMobil/BeregningsdetaljerMobil'
import { useBeregningsdetaljer } from './hooks'

interface Props {
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
}

export const BeregningsdetaljerForOvergangskull: React.FC<Props> = ({
  alderspensjonListe,
  pre2025OffentligAfp,
}) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const {
    grunnpensjonObjekt,
    opptjeningKap19Objekt,
    opptjeningKap20Objekt,
    opptjeningPre2025OffentligAfpObjekt,
  } = useBeregningsdetaljer(alderspensjonListe, pre2025OffentligAfp)

  return (
    <Box marginBlock="10 0" data-testid="maanedsbloep-avansert-beregning">
      <Heading size="small" level="3">
        <FormattedMessage id="beregningsdetaljer.title" />
      </Heading>

      <div /* className={styles.beregningsdetaljerDesktopOnly} */>
        <BeregningsdetaljerDesktop
          uttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode}
          grunnpensjonObjekt={grunnpensjonObjekt}
          opptjeningKap19Objekt={opptjeningKap19Objekt}
          opptjeningKap20Objekt={opptjeningKap20Objekt}
          opptjeningPre2025OffentligAfpObjekt={
            opptjeningPre2025OffentligAfpObjekt
          }
        />
      </div>

      <div /* className={styles.beregningsdetaljerMobileOnly} */>
        <BeregningsdetaljerMobil
          uttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode}
          grunnpensjonObjekt={grunnpensjonObjekt}
          opptjeningKap19Objekt={opptjeningKap19Objekt}
          opptjeningKap20Objekt={opptjeningKap20Objekt}
          opptjeningPre2025OffentligAfpObjekt={
            opptjeningPre2025OffentligAfpObjekt
          }
        />
      </div>
    </Box>
  )
}

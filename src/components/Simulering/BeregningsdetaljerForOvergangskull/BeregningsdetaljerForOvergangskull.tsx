import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'

import { BeregningsdetaljerDesktop } from './BeregningsdetaljerDesktop/BeregningsdetaljerDesktop'
import { BeregningsdetaljerMobil } from './BeregningsdetaljerMobil/BeregningsdetaljerMobil'

interface Props {
  alderspensjonListe?: AlderspensjonPensjonsberegning[][]
}

export const BeregningsdetaljerForOvergangskull: React.FC<Props> = (props) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  return (
    <Box marginBlock="10 0" data-testid="maanedsbloep-avansert-beregning">
      <Heading size="small" level="3">
        <FormattedMessage id="beregningsdetaljer.title" />
      </Heading>

      <div /* className={styles.beregningsdetaljerDesktopOnly} */>
        <BeregningsdetaljerDesktop
          alderspensjonListe={props.alderspensjonListe}
          uttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode}
        />
      </div>

      <div /* className={styles.beregningsdetaljerMobileOnly} */>
        <BeregningsdetaljerMobil
          alderspensjonListe={props.alderspensjonListe}
          uttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode}
        />
      </div>
    </Box>
  )
}

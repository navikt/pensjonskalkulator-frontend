import React from 'react'

//import { FormattedMessage } from 'react-intl'

import { Box /* Heading */ } from '@navikt/ds-react'

import { BeregningsdetaljerDesktop } from './BeregningsdetaljerDesktop/BeregningsdetaljerDesktop'
import { BeregningsdetaljerMobil } from './BeregningsdetaljerMobil/BeregningsdetaljerMobil'
import { useBeregningsdetaljer } from './hooks'

import styles from './BeregningsdetaljerForOvergangskull.module.scss'

interface Props {
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPensjonsberegning[]
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
}

export const BeregningsdetaljerForOvergangskull: React.FC<Props> = ({
  alderspensjonListe,
  pre2025OffentligAfp,
  afpPrivatListe,
}) => {
  const {
    grunnpensjonObjekter,
    opptjeningKap19Objekt,
    opptjeningKap20Objekt,
    opptjeningAfpPrivatObjekt,
    opptjeningPre2025OffentligAfpObjekt,
  } = useBeregningsdetaljer(
    alderspensjonListe,
    afpPrivatListe,
    pre2025OffentligAfp
  )

  return (
    <Box marginBlock="10 0" data-testid="beregningsdetaljer-for-overgangskull">
      {/* <Heading size="small" level="2">
        <FormattedMessage id="beregningsdetaljer.title" />
      </Heading> */}

      <div className={styles.beregningsdetaljerForOvergangskullDesktopOnly}>
        <BeregningsdetaljerDesktop
          grunnpensjonObjekter={grunnpensjonObjekter}
          opptjeningKap19Objekt={opptjeningKap19Objekt}
          opptjeningKap20Objekt={opptjeningKap20Objekt}
          opptjeningAfpPrivatObjekt={opptjeningAfpPrivatObjekt}
          opptjeningPre2025OffentligAfpObjekt={
            opptjeningPre2025OffentligAfpObjekt
          }
        />
      </div>

      <div className={styles.beregningsdetaljerForOvergangskullMobileOnly}>
        <BeregningsdetaljerMobil
          grunnpensjonObjekter={grunnpensjonObjekter}
          opptjeningKap19Objekt={opptjeningKap19Objekt}
          opptjeningKap20Objekt={opptjeningKap20Objekt}
          opptjeningAfpPrivatObjekt={opptjeningAfpPrivatObjekt}
          opptjeningPre2025OffentligAfpObjekt={
            opptjeningPre2025OffentligAfpObjekt
          }
        />
      </div>
    </Box>
  )
}

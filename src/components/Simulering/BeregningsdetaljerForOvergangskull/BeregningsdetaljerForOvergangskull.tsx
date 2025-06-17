import React from 'react'

import { Box } from '@navikt/ds-react'

import { BeregningsdetaljerDesktop } from './BeregningsdetaljerDesktop/BeregningsdetaljerDesktop'
import { BeregningsdetaljerMobil } from './BeregningsdetaljerMobil/BeregningsdetaljerMobil'
import { useBeregningsdetaljer } from './hooks'

import styles from './BeregningsdetaljerForOvergangskull.module.scss'

interface Props {
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  pre2025OffentligAfp?: pre2025OffentligPensjonsberegning
}

export const BeregningsdetaljerForOvergangskull: React.FC<Props> = ({
  alderspensjonListe,
  pre2025OffentligAfp,
  afpPrivatListe,
}) => {
  const {
    alderspensjonDetaljerListe,
    opptjeningKap19Liste,
    opptjeningKap20Liste,
    opptjeningAfpPrivatListe,
    opptjeningPre2025OffentligAfpListe,
  } = useBeregningsdetaljer(
    alderspensjonListe,
    afpPrivatListe,
    pre2025OffentligAfp
  )

  return (
    <Box marginBlock="10 0" data-testid="beregningsdetaljer-for-overgangskull">
      <div className={styles.beregningsdetaljerForOvergangskullDesktopOnly}>
        <BeregningsdetaljerDesktop
          alderspensjonDetaljerListe={alderspensjonDetaljerListe}
          opptjeningKap19Liste={opptjeningKap19Liste}
          opptjeningKap20Liste={opptjeningKap20Liste}
          opptjeningAfpPrivatListe={opptjeningAfpPrivatListe}
          opptjeningPre2025OffentligAfpListe={
            opptjeningPre2025OffentligAfpListe
          }
        />
      </div>

      <div className={styles.beregningsdetaljerForOvergangskullMobileOnly}>
        <BeregningsdetaljerMobil
          alderspensjonDetaljerListe={alderspensjonDetaljerListe}
          opptjeningKap19Liste={opptjeningKap19Liste}
          opptjeningKap20Liste={opptjeningKap20Liste}
          opptjeningAfpPrivatListe={opptjeningAfpPrivatListe}
          opptjeningPre2025OffentligAfpListe={
            opptjeningPre2025OffentligAfpListe
          }
        />
      </div>
    </Box>
  )
}

import React from 'react'

import { Box, HStack, VStack } from '@navikt/ds-react'

import { AfpDetaljer } from './Felles/AfpDetaljer'
import { AlderspensjonDetaljer } from './Felles/AlderspensjonDetaljer'
import { OpptjeningDetaljer } from './Felles/OpptjeningDetaljer'
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

  const renderDetaljer = () => (
    <>
      <AlderspensjonDetaljer
        alderspensjonDetaljerListe={alderspensjonDetaljerListe}
        hasPre2025OffentligAfpUttaksalder={Boolean(
          opptjeningPre2025OffentligAfpListe?.length
        )}
      />
      <OpptjeningDetaljer
        opptjeningKap19Liste={opptjeningKap19Liste}
        opptjeningKap20Liste={opptjeningKap20Liste}
      />
      <AfpDetaljer
        opptjeningAfpPrivatListe={opptjeningAfpPrivatListe}
        opptjeningPre2025OffentligAfpListe={opptjeningPre2025OffentligAfpListe}
      />
    </>
  )

  return (
    <Box marginBlock="10 0" data-testid="beregningsdetaljer-for-overgangskull">
      <div className={styles.beregningsdetaljerForOvergangskullDesktopOnly}>
        <HStack gap="20" width="100%">
          {renderDetaljer()}
        </HStack>
      </div>

      <div className={styles.beregningsdetaljerForOvergangskullMobileOnly}>
        <VStack gap="4 8" width="100%" marginBlock="2 0">
          {renderDetaljer()}
        </VStack>
      </div>
    </Box>
  )
}

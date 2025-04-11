import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { formatInntekt } from '@/utils/inntekt'

import { Pensjonsdata } from '../hooks'

import styles from './PensjonDataVisning.module.scss'

interface Props {
  pensjonsdata: Pensjonsdata
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksMaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
  isMobile?: boolean
}

export const PensjonDataVisning: React.FC<Props> = ({
  pensjonsdata,
  summerYtelser,
  hentUttaksMaanedOgAar,
  isMobile = false,
}) => {
  const { alder, grad, afp, pensjonsavtale, alderspensjon } = pensjonsdata
  const harKunAlderspensjon = alderspensjon && !afp && !pensjonsavtale

  const size = isMobile ? 'small' : 'medium'

  return (
    <>
      {afp && (
        <div className={styles.row}>
          <BodyLong size={size}>
            <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
          </BodyLong>
          <span>{formatInntekt(afp)} kr</span>
        </div>
      )}

      {pensjonsavtale > 0 && (
        <div className={styles.row}>
          <BodyLong size={size}>
            <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
            :
          </BodyLong>
          <span>{formatInntekt(pensjonsavtale)} kr</span>
        </div>
      )}

      {alderspensjon && (
        <div className={styles.row}>
          <BodyLong size={size}>
            <FormattedMessage
              id="beregning.avansert.maanedsbeloep.alderspensjon"
              values={{ prosent: grad }}
            />
            :
          </BodyLong>
          <span>{formatInntekt(alderspensjon)} kr</span>
        </div>
      )}

      {!harKunAlderspensjon && (
        <div className={`${styles.row} ${styles.sum}`}>
          <BodyLong size={size} as="span">
            <FormattedMessage
              id="beregning.avansert.maanedsbeloep.sum"
              values={hentUttaksMaanedOgAar(alder)}
            />
            :
          </BodyLong>
          <span>{formatInntekt(summerYtelser(pensjonsdata))} kr</span>
        </div>
      )}
    </>
  )
}

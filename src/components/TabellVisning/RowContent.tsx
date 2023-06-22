import React from 'react'

import { BodyShort } from '@navikt/ds-react'

import styles from './RowContent.module.scss'
import { formatAsDecimal } from '@/utils/currency'

interface Props {
  alderspensjon: number
  afpPrivat: number
  inntekt: number
}

export const RowContent: React.FC<Props> = React.memo(
  ({ alderspensjon, afpPrivat, inntekt }) => {
    return (
      <ul className={styles.details}>
        {inntekt > 0 && (
          <li>
            <BodyShort>Inntekt (lønn m.m.)</BodyShort>
            <BodyShort>{formatAsDecimal(inntekt)}</BodyShort>
          </li>
        )}
        {afpPrivat > 0 && (
          <li>
            <BodyShort>Avtalefestet pensjon (AFP)</BodyShort>
            <BodyShort>{formatAsDecimal(afpPrivat)}</BodyShort>
          </li>
        )}
        {alderspensjon > 0 && (
          <li>
            <BodyShort>Alderspensjon (NAV)</BodyShort>
            <BodyShort>{formatAsDecimal(alderspensjon)}</BodyShort>
          </li>
        )}
      </ul>
    )
  }
)

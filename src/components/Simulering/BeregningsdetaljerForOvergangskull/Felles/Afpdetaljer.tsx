import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface AfpdetaljerProps {
  opptjeningAfpPrivatObjekt?: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const Afpdetaljer: React.FC<AfpdetaljerProps> = ({
  opptjeningAfpPrivatObjekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => {
  return (
    <section>
      {opptjeningAfpPrivatObjekt && opptjeningAfpPrivatObjekt.length > 0 && (
        <dl>
          <div className={styles.hstackRow}>
            <strong>
              <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.afpPrivat.table.title" />
            </strong>
          </div>
          {opptjeningAfpPrivatObjekt.map((detalj, index) => (
            <React.Fragment key={index}>
              <HStack justify="space-between" className={styles.hstackRow}>
                <dt>{`${detalj.tekst}:`}</dt>
                <dd>{detalj.verdi}</dd>
              </HStack>
            </React.Fragment>
          ))}
        </dl>
      )}

      {opptjeningPre2025OffentligAfpObjekt &&
        opptjeningPre2025OffentligAfpObjekt.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.pre2025OffentligAfp.table.title" />
              </strong>
            </div>
            {opptjeningPre2025OffentligAfpObjekt.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </React.Fragment>
            ))}
          </dl>
        )}
    </section>
  )
}

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, VStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface OpptjeningsdetaljerProps {
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
}

export const Opptjeningsdetaljer: React.FC<OpptjeningsdetaljerProps> = ({
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
}) => {
  return (
    <section>
      <VStack gap="14">
        {opptjeningKap19Objekt && opptjeningKap19Objekt.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap19.table.title" />
              </strong>
            </div>
            {opptjeningKap19Objekt.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </React.Fragment>
            ))}
          </dl>
        )}

        {opptjeningKap20Objekt && opptjeningKap20Objekt.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap20.table.title" />
              </strong>
            </div>
            {opptjeningKap20Objekt.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </React.Fragment>
            ))}
          </dl>
        )}
      </VStack>
    </section>
  )
}

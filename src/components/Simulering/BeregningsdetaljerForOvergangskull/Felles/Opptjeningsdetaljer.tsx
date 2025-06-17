import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, VStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface OpptjeningsdetaljerProps {
  opptjeningKap19Liste: DetaljRad[]
  opptjeningKap20Liste: DetaljRad[]
}

export const Opptjeningsdetaljer: React.FC<OpptjeningsdetaljerProps> = ({
  opptjeningKap19Liste,
  opptjeningKap20Liste,
}) => {
  return (
    <section>
      <VStack gap="14">
        {opptjeningKap19Liste && opptjeningKap19Liste.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap19.table.title" />
              </strong>
            </div>
            {opptjeningKap19Liste.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </React.Fragment>
            ))}
          </dl>
        )}

        {opptjeningKap20Liste && opptjeningKap20Liste.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap20.table.title" />
              </strong>
            </div>
            {opptjeningKap20Liste.map((detalj, index) => (
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

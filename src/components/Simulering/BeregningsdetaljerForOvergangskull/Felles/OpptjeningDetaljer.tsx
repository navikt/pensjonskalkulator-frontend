import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, VStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface OpptjeningDetaljerProps {
  opptjeningKap19Liste: DetaljRad[][]
  opptjeningKap20Liste: DetaljRad[][]
}

export const OpptjeningDetaljer: React.FC<OpptjeningDetaljerProps> = ({
  opptjeningKap19Liste,
  opptjeningKap20Liste,
}) => {
  const renderOpptjeningSection = (
    detaljListe: DetaljRad[][],
    titleId: string,
    sectionIndex: number
  ) => {
    if (!detaljListe || detaljListe.length === 0) return null

    return detaljListe
      .map((detaljer, arrayIndex) => {
        if (detaljer.length === 0) return null

        return (
          <dl key={`${sectionIndex}-${arrayIndex}`}>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id={titleId} />
              </strong>
            </div>
            {detaljer.map((detalj, index) => (
              <Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </Fragment>
            ))}
          </dl>
        )
      })
      .filter(Boolean) // Remove null values
  }

  return (
    <section>
      <VStack gap="20">
        {renderOpptjeningSection(
          opptjeningKap19Liste,
          'beregning.detaljer.OpptjeningDetaljer.kap19.table.title',
          0
        )}
        {renderOpptjeningSection(
          opptjeningKap20Liste,
          'beregning.detaljer.OpptjeningDetaljer.kap20.table.title',
          1
        )}
      </VStack>
    </section>
  )
}

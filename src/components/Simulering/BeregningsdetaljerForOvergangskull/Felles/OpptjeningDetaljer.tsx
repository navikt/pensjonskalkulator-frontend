import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, VStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface OpptjeningDetaljerProps {
  opptjeningKap19Liste: DetaljRad[][]
  opptjeningKap20Liste: DetaljRad[][]
  alderspensjonDetaljerListe: DetaljRad[][]
}

export const OpptjeningDetaljer: React.FC<OpptjeningDetaljerProps> = ({
  opptjeningKap19Liste,
  opptjeningKap20Liste,
  alderspensjonDetaljerListe,
}) => {
  // Calculate spacing to align with AlderspensjonDetaljer
  const calculateFirstSectionSpacing = () => {
    // If only one section in alderspensjonDetaljerListe, only title spacing is needed
    if (alderspensjonDetaljerListe.length === 1) {
      return 'var(--a-spacing-8)'
    }

    // If two sections, we need to calculate the height of the first section + gap
    if (alderspensjonDetaljerListe.length === 2) {
      const firstSectionRows = alderspensjonDetaljerListe[0]?.length || 0

      const titleRowAndDataRowsHeight = `calc(${firstSectionRows + 1} * (var(--a-spacing-3) + var(--a-spacing-3)))`
      const headingHeight = 'var(--a-font-line-height-small)'
      const gapBetweenSections = 'var(--a-spacing-14)'

      const totalSpacing = `calc(${headingHeight} + ${titleRowAndDataRowsHeight} + ${gapBetweenSections})`

      return totalSpacing
    }

    return 'var(--a-spacing-8)'
  }

  const firstSectionSpacing = calculateFirstSectionSpacing()
  // Render sections in the correct order for gradert uttak
  const renderOpptjeningSections = () => {
    const maxLength = Math.max(
      opptjeningKap19Liste?.length || 0,
      opptjeningKap20Liste?.length || 0
    )

    const sectionGroups = []

    for (let i = 0; i < maxLength; i++) {
      const sectionsInGroup = []

      // Render Kap 19 section for this index
      if (opptjeningKap19Liste?.[i]?.length > 0) {
        sectionsInGroup.push(
          <dl key={`kap19-${i}`}>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.kap19.table.title" />
              </strong>
            </div>
            {opptjeningKap19Liste[i].map((detalj, index) => (
              <Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </Fragment>
            ))}
          </dl>
        )
      }

      // Render Kap 20 section for this index
      if (opptjeningKap20Liste?.[i]?.length > 0) {
        sectionsInGroup.push(
          <dl key={`kap20-${i}`}>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.kap20.table.title" />
              </strong>
            </div>
            {opptjeningKap20Liste[i].map((detalj, index) => (
              <Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </Fragment>
            ))}
          </dl>
        )
      }

      // Only add the group if it has sections
      if (sectionsInGroup.length > 0) {
        sectionGroups.push(
          <HStack key={`group-${i}`} gap="8">
            {sectionsInGroup}
          </HStack>
        )
      }
    }

    return sectionGroups
  }

  return (
    <VStack
      gap="14"
      className={styles.opptjeningDetaljer as string}
      style={{ marginTop: firstSectionSpacing }}
    >
      {renderOpptjeningSections()}
    </VStack>
  )
}

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, Heading, VStack } from '@navikt/ds-react'

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
  // Calculate the height of the first section of AlderspensjonDetaljer
  const calculateFirstSectionSpacing = () => {
    if (alderspensjonDetaljerListe.length < 2) return 0

    const firstSectionRows = alderspensjonDetaljerListe[0]?.length || 0
    if (firstSectionRows === 0) return 0

    // Use CSS calc with design system variables for precise alignment
    // Each row contributes: content height + spacing
    // The gap between sections is var(--a-spacing-14)

    return `calc(${firstSectionRows} * (1.5rem + var(--a-spacing-3) * 2 + 1px) - var(--a-spacing-3) + var(--a-spacing-14) + var(--a-spacing-3))`
  }
  // Render sections in the correct order for gradert uttak
  const renderOpptjeningSections = () => {
    const maxLength = Math.max(
      opptjeningKap19Liste?.length || 0,
      opptjeningKap20Liste?.length || 0
    )

    const sectionGroups = []
    const firstSectionSpacing = calculateFirstSectionSpacing()

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
        const isSecondSection =
          i === 1 && alderspensjonDetaljerListe.length >= 2

        sectionGroups.push(
          <HStack
            key={`group-${i}`}
            gap="8"
            style={{
              marginTop: isSecondSection ? firstSectionSpacing : undefined,
            }}
          >
            {sectionsInGroup}
          </HStack>
        )
      }
    }

    return sectionGroups
  }

  return (
    <VStack gap="14" className={styles.opptjeningDetaljer as string}>
      <Heading level="4" size="small">
        &nbsp;
      </Heading>
      {renderOpptjeningSections()}
    </VStack>
  )
}

import React, { useState } from 'react'

import { ReadMore, Table } from '@navikt/ds-react'

import { RowContent } from '@/components/TabellVisning/RowContent'

import styles from './Tabellvisning.module.scss'
import { formatAsDecimal } from '@/utils/currency'

interface Props {
  aldere: string[]
  data: {
    alderspensjon: number[]
    afpPrivat: number[]
    inntekt: number[]
  }
}

export const Tabellvisning: React.FC<Props> = React.memo(({ aldere, data }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ReadMore
      header={isOpen ? 'Lukk tabell' : 'Vis tabell'}
      className={styles.readMore}
      open={isOpen}
      onClick={() => setIsOpen((prevState) => !prevState)}
    >
      <Table className={styles.table}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell scope="col">Alder</Table.HeaderCell>
            <Table.HeaderCell scope="col" className={styles.rightAligned}>
              Sum (kr)
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {aldere.map((alder, i) => (
            <Table.ExpandableRow
              key={alder}
              content={
                <RowContent
                  inntekt={data.inntekt[i]}
                  afpPrivat={data.afpPrivat[i]}
                  alderspensjon={data.alderspensjon[i]}
                />
              }
            >
              <Table.DataCell>{alder}</Table.DataCell>
              <Table.DataCell className={styles.rightAligned}>
                {formatAsDecimal(
                  (data.inntekt[i] ?? 0) +
                    (data.afpPrivat[i] ?? 0) +
                    (data.alderspensjon[i] ?? 0)
                )}
              </Table.DataCell>
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </Table>
    </ReadMore>
  )
})

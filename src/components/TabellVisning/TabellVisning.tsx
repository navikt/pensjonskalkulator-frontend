import { Fragment } from 'react'

import { Table } from '@navikt/ds-react'
import clsx from 'clsx'
import { SeriesColumnOptions } from 'highcharts'

import { formatAsDecimal } from '@/utils/currency'

import { useTableData } from './hooks'

interface Props {
  series: SeriesColumnOptions[]
  aarArray?: string[]
}

import styles from './TabellVisning.module.scss'

export function TabellVisning({ series, aarArray }: Props) {
  const tableData = useTableData(series, aarArray)

  return (
    <Table className={styles.table}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className={styles.tableMobileOnly} />
          <Table.HeaderCell scope="col">Alder</Table.HeaderCell>
          <Table.HeaderCell scope="col" className={styles.detailsItemRight}>
            Sum<span className={styles.tableMobileOnly}> (kr)</span>
          </Table.HeaderCell>
          <Table.HeaderCell
            scope="col"
            className={clsx(styles.detailsItemRight, styles.tableDesktopOnly)}
          >
            Inntekt
            <br />
            (lønn m.m.)
          </Table.HeaderCell>
          <Table.HeaderCell
            scope="col"
            className={clsx(styles.detailsItemRight, styles.tableDesktopOnly)}
          >
            Avtalefestet pensjon (AFP)
          </Table.HeaderCell>
          <Table.HeaderCell
            scope="col"
            className={clsx(styles.detailsItemRight, styles.tableDesktopOnly)}
          >
            Pensjonsavtaler (arbeidsgiver)
          </Table.HeaderCell>
          <Table.HeaderCell
            scope="col"
            className={clsx(styles.detailsItemRight, styles.tableDesktopOnly)}
          >
            Alderspensjon (NAV)
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className={styles.tableMobileOnly}>
        {tableData.map(({ alder, sum, detaljer }, i) => {
          const detaljerGrid = (
            <dl key={i} className={styles.details}>
              {detaljer.map(({ name, subSum }, j) => (
                <Fragment key={j}>
                  <dt>{name}</dt>
                  <dd className={styles.detailsItemRight}>
                    {formatAsDecimal(subSum)}
                  </dd>
                </Fragment>
              ))}
            </dl>
          )
          return (
            <Table.ExpandableRow key={i} content={detaljerGrid}>
              <Table.DataCell>{alder}</Table.DataCell>
              <Table.DataCell className={styles.detailsItemRight}>
                {formatAsDecimal(sum)}
              </Table.DataCell>
            </Table.ExpandableRow>
          )
        })}
      </Table.Body>
      <Table.Body className={styles.tableDesktopOnly}>
        {tableData.map(({ alder, sum, detaljer }, i) => {
          return (
            <Table.Row key={i}>
              <Table.DataCell>{alder}</Table.DataCell>
              <Table.DataCell
                className={clsx(
                  styles.detailsItemRight,
                  styles.detailsItemBold
                )}
              >
                {sum > 0 ? `${formatAsDecimal(sum)} kr` : ''}
              </Table.DataCell>
              {detaljer.map(({ subSum }, j) => (
                <Table.DataCell key={j} className={styles.detailsItemRight}>
                  {subSum > 0 ? `${formatAsDecimal(subSum)} kr` : ''}
                </Table.DataCell>
              ))}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

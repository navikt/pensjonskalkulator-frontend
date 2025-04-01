import { IntlShape } from 'react-intl'

import { SeriesColumnOptions } from 'highcharts'

export type TableDataRowDetaljer = { name: string; subSum: number }

export type TableDataRow = {
  alder: string
  sum: number
  detaljer: TableDataRowDetaljer[]
}

export function formatSeriesToTableData(
  intl: IntlShape,
  series: SeriesColumnOptions[],
  aarArray?: string[]
): TableDataRow[] {
  const tableData: TableDataRow[] = []
  if (aarArray === undefined) {
    return tableData
  }

  for (let i = 0; i < aarArray.length; i++) {
    let sum = 0
    const detaljer: TableDataRowDetaljer[] = []
    const alder = `${aarArray[i]} ${
      aarArray[i].includes('+')
        ? intl.formatMessage({ id: 'alder.aar_livsvarig' })
        : intl.formatMessage({ id: 'alder.aar' })
    }`

    for (const obj of series) {
      const { name, data } = obj
      if (data && name) {
        const temporarySum = !isNaN(data[i] as number) ? (data[i] as number) : 0
        sum += temporarySum

        detaljer.push({ name, subSum: temporarySum })
      }
    }

    console.log(`Year: ${aarArray[i]}, Sum: ${sum}, Details:`, detaljer)

    tableData.push({ alder, sum, detaljer })
  }
  console.log('Final Table Data:', tableData)

  return tableData
}

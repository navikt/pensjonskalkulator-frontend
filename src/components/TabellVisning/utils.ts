import { SeriesColumnOptions } from 'highcharts'

export type TableDataRowDetaljer = { name: string; subSum: number }

export type TableDataRow = {
  alder: string
  sum: number
  detaljer: TableDataRowDetaljer[]
}

export function formatSeriesToTableData(
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
      aarArray[i].includes('+') ? '(livsvarig)' : 'år'
    }`

    for (const obj of series) {
      const { name, data } = obj
      if (data && name) {
        const temporarySum = data[i] as number
        sum += temporarySum

        detaljer.push({ name, subSum: temporarySum })
      }
    }

    tableData.push({ alder, sum, detaljer })
  }

  return tableData
}

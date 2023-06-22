import React from 'react'

import { Grafvisning } from '@/components/Grafvisning'
import { Tabellvisning } from '@/components/TabellVisning'
import { useSimuleringQuery } from '@/state/api/apiSlice'

import {
  findSenesteAlder,
  findTidligsteAlder,
  generateXAxis,
  getSeriesData,
} from './utils'

type Props = {
  uttaksalder: Uttaksalder
}

export const Pensjonssimulering: React.FC<Props> = React.memo(
  ({ uttaksalder }) => {
    const { data } = useSimuleringQuery({
      simuleringstype: 'ALDER',
      uttaksgrad: 100,
      foersteUttaksdato: uttaksalder.uttaksdato,
      epsHarInntektOver2G: false,
    })

    if (!data) {
      return null
    }

    const tidligsteAlder = findTidligsteAlder(data)
    const senesteAlder = findSenesteAlder(data)
    const aldere = generateXAxis(tidligsteAlder, senesteAlder)

    const simulering = {
      alderspensjon: getSeriesData(data.alderspensjon, {
        ...{
          start: tidligsteAlder - 1,
          end: senesteAlder,
        },
        livsvarig: true,
      }),
      afpPrivat: getSeriesData(data.afpPrivat, {
        start: tidligsteAlder - 1,
        end: senesteAlder,
      }),
      inntekt: getSeriesData([{ alder: tidligsteAlder - 1, belop: 650_000 }], {
        start: tidligsteAlder,
        end: senesteAlder,
      }),
      pensjonsavtaler: [],
    }

    return (
      <>
        <Grafvisning aldere={aldere} data={simulering} />
        <Tabellvisning aldere={aldere} data={simulering} />
      </>
    )
  }
)

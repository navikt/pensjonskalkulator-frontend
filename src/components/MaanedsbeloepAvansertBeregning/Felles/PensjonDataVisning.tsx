import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong } from '@navikt/ds-react'

import { formatInntekt } from '@/utils/inntekt'

import { Pensjonsdata } from '../hooks'

import styles from './PensjonDataVisning.module.scss'

interface Props {
  pensjonsdata: Pensjonsdata
  summerYtelser: (data: Pensjonsdata) => number
  hentUttaksMaanedOgAar: (alder: Alder) => { maaned: string; aar: string }
}

export const PensjonDataVisning: React.FC<Props> = ({
  pensjonsdata,
  summerYtelser,
  hentUttaksMaanedOgAar,
}) => {
  const { alder, grad, afp, pensjonsavtale, alderspensjon } = pensjonsdata
  const harKunAlderspensjon = alderspensjon && !afp && !pensjonsavtale

  return (
    <table className={styles.container}>
      <caption className={styles.srOnly}>
        <FormattedMessage id="beregning.avansert.maanedsbeloep.table_title" />
      </caption>
      <tbody>
        {afp && (
          <tr className={styles.row}>
            <th scope="row">
              <BodyLong>
                <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
              </BodyLong>
            </th>
            <td>{formatInntekt(afp)} kr</td>
          </tr>
        )}

        {pensjonsavtale > 0 && (
          <tr className={styles.row}>
            <th scope="row">
              <BodyLong>
                <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
                :
              </BodyLong>
            </th>
            <td>{formatInntekt(pensjonsavtale)} kr</td>
          </tr>
        )}

        {alderspensjon && (
          <tr className={styles.row}>
            <th scope="row">
              <BodyLong>
                <FormattedMessage
                  id="beregning.avansert.maanedsbeloep.alderspensjon"
                  values={{ prosent: grad }}
                />
                :
              </BodyLong>
            </th>
            <td>{formatInntekt(alderspensjon)} kr</td>
          </tr>
        )}

        {!harKunAlderspensjon && (
          <tr
            className={`${styles.row} ${styles.sum}`}
            data-testid="maanedsbeloep-avansert-sum"
          >
            <th scope="row">
              <BodyLong>
                <FormattedMessage
                  id="beregning.avansert.maanedsbeloep.sum"
                  values={hentUttaksMaanedOgAar(alder)}
                />
                :
              </BodyLong>
            </th>
            <td>{formatInntekt(summerYtelser(pensjonsdata))} kr</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

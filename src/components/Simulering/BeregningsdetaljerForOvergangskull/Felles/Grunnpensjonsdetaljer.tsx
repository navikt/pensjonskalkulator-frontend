import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

import styles from './Grunnpensjonsdetaljer.module.scss'

export interface GrunnpensjonsdetaljerProps {
  grunnpensjonObjekt: DetaljRad[]
  uttaksalder: Alder | null
  gradertUttaksperiode: GradertUttak | null
}

export const Grunnpensjonsdetaljer: React.FC<GrunnpensjonsdetaljerProps> = ({
  grunnpensjonObjekt,
  gradertUttaksperiode,
  //uttaksalder,
}) => {
  return (
    <>
      {gradertUttaksperiode && (
        <div className="gradertUttak">
          {/* <Box>
          {props.alderspensjonListe?.map((alderspensjon, index) => (
            <div key={index} />
          ))}
        </Box> */}
        </div>
      )}
      <div className="heltUttak">
        <dl>
          <div className={styles.hstackRow}>
            <strong>
              <FormattedMessage id="beregning.detaljer.grunnpensjon.title" />
            </strong>
          </div>
          {grunnpensjonObjekt.map((detalj, index) => (
            <React.Fragment key={index}>
              <HStack justify="space-between" className={styles.hstackRow}>
                <dt>
                  {index === grunnpensjonObjekt.length - 1 ? (
                    <strong>{detalj.tekst}:</strong>
                  ) : (
                    `${detalj.tekst}:`
                  )}
                </dt>
                <dd>
                  {index === grunnpensjonObjekt.length - 1 ? (
                    <strong>{detalj.verdi}</strong>
                  ) : (
                    detalj.verdi
                  )}
                </dd>
              </HStack>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </>
  )
}

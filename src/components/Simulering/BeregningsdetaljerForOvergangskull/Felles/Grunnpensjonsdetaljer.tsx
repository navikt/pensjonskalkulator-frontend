import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Heading } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

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
        <Heading size="small" level="3">
          <FormattedMessage id="beregning.detaljer.grunnpensjon.title" />
        </Heading>
        <dl>
          {grunnpensjonObjekt.map((detalj, index) => (
            <React.Fragment key={index}>
              {index === grunnpensjonObjekt.length - 1 ? (
                <>
                  <dt>
                    <strong>{detalj.tekst}:</strong>
                  </dt>
                  <dd>
                    <strong>{detalj.verdi}</strong>
                  </dd>
                </>
              ) : (
                <>
                  <dt>{detalj.tekst}:</dt>
                  <dd>{detalj.verdi}</dd>
                </>
              )}
            </React.Fragment>
          ))}
        </dl>
      </div>
    </>
  )
}

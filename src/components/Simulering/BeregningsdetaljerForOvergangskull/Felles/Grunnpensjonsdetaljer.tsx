import React from 'react'

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
          Månedlig alderspensjon fra Nav
        </Heading>
        <dl>
          {grunnpensjonObjekt.map((detalj, index) => (
            <React.Fragment key={index}>
              {index === grunnpensjonObjekt.length - 1 ? (
                <>
                  <dt>
                    <b>{detalj.tekst}:</b>
                  </dt>
                  <dd>
                    <b>{detalj.verdi}</b>
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

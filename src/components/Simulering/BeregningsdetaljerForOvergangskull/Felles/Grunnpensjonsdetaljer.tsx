import React from 'react'

import { GrunnpensjonDetaljer } from '../hooks'

export interface GrunnpensjonsdetaljerProps {
  grunnpensjonListe: GrunnpensjonDetaljer[]
  uttaksalder: Alder | null
  gradertUttaksperiode: GradertUttak | null
}

export const Grunnpensjonsdetaljer: React.FC<GrunnpensjonsdetaljerProps> = ({
  //grunnpensjonListe,
  gradertUttaksperiode,
  //uttaksalder,
}) => {
  // Component logic and rendering here, using the new props
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
        {/* <Box>
          {props.alderspensjonListe?.map((alderspensjon, index) => (
            <div key={index} />
          ))}
        </Box> */}
      </div>
    </>
  )
}

import React from 'react'

import { OpptjeningKap19Detaljer, OpptjeningKap20Detaljer } from '../hooks'

export interface GrunnpensjonsdetaljerProps {
  opptjeningKap19Liste: OpptjeningKap19Detaljer[]
  opptjeningKap20Liste: OpptjeningKap20Detaljer[]
}

export const Opptjeningsdetaljer: React.FC<GrunnpensjonsdetaljerProps> = ({
  opptjeningKap19Liste,
  opptjeningKap20Liste,
}) => {
  return (
    <div>
      {opptjeningKap19Liste.map((detalj, index) => (
        <div key={index}>
          <h4>Opptjening Kap 19 - Detaljer</h4>
          <p>Andelsbrøk: {detalj.andelsbroekKap19}</p>
          <p>Sluttpoengtall: {detalj.sluttpoengtall}</p>
          <p>Poengår Sum: {detalj.poengaarSum}</p>
          <p>Trygdetid: {detalj.trygdetidKap19}</p>
        </div>
      ))}
      {opptjeningKap20Liste.map((detalj, index) => (
        <div key={index}>
          <h4>Opptjening Kap 20 - Detaljer</h4>
          <p>Andelsbrøk: {detalj.andelsbroekKap20}</p>
          <p>Trygdetid: {detalj.trygdetidKap20}</p>
          <p>
            Pensjon Beholdning Før Uttak Beløp:{' '}
            {detalj.pensjonBeholdningFoerUttakBeloep}
          </p>
        </div>
      ))}
    </div>
  )
}

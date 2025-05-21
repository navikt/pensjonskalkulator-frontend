import React from 'react'

import { Heading } from '@navikt/ds-react'

import { DetaljRad } from '../hooks'

export interface OpptjeningsdetaljerProps {
  opptjeningKap19Objekt: DetaljRad[]
  opptjeningKap20Objekt: DetaljRad[]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const Opptjeningsdetaljer: React.FC<OpptjeningsdetaljerProps> = ({
  opptjeningKap19Objekt,
  opptjeningKap20Objekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => {
  return (
    <section>
      <Heading size="small" level="3">
        Opptjening alderspensjon etter kapittel 19
      </Heading>
      <dl>
        {opptjeningKap19Objekt.map((detalj) => (
          <>
            <dt>{detalj.tekst}:</dt>
            <dd>{detalj.verdi}</dd>
          </>
        ))}
      </dl>
      <Heading size="small" level="3">
        Opptjening alderspensjon etter kapittel 20
      </Heading>
      <dl>
        {opptjeningKap20Objekt.map((detalj) => (
          <>
            <dt>{detalj.tekst}:</dt>
            <dd>{detalj.verdi}</dd>
          </>
        ))}
      </dl>
      <Heading size="small" level="3">
        Opptjening avtalefestet pensjon (AFP)
      </Heading>
      <dl>
        {opptjeningPre2025OffentligAfpObjekt?.map((detalj) => (
          <>
            <dt>{detalj.tekst}:</dt>
            <dd>{detalj.verdi}</dd>
          </>
        ))}
      </dl>
    </section>
  )
}

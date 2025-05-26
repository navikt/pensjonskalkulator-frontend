import React from 'react'
import { FormattedMessage } from 'react-intl'

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
        <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap19.title" />
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
        <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.kap20.title" />
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
        <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.pre2025OffentligAfp.title" />
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

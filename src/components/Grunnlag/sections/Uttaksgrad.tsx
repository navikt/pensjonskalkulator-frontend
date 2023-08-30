import { Accordion, BodyLong } from '@navikt/ds-react'

import { SectionContent } from './components/SectionContent'
import { SectionHeader } from './components/SectionHeader'

const gyldigeUttaksgrader = [20, 40, 50, 60, 80, 100]

const formatUttaksgrader = (uttaksgrad: number): string => {
  const grader = gyldigeUttaksgrader
    .filter((grad) => grad !== uttaksgrad)
    .map((grad) => `${grad} %`)

  return grader.slice(0, -1).join(', ') + ' og ' + grader.slice(-1)
}

interface Props {
  uttaksgrad: number
}

export function Uttaksgrad({ uttaksgrad }: Props) {
  return (
    <Accordion.Item>
      <SectionHeader label="Uttaksgrad" value={`${uttaksgrad} %`} />
      <SectionContent>
        <BodyLong>
          Denne beregningen viser {uttaksgrad} % uttak av alderspensjon. I
          avansert kalkulator kan du beregne alderspensjon med andre
          uttaksgrader ({formatUttaksgrader(uttaksgrad)}
          ). Du kan jobbe så mye du vil ved siden av pensjon selv om du har tatt
          ut {uttaksgrad} %.
        </BodyLong>
      </SectionContent>
    </Accordion.Item>
  )
}

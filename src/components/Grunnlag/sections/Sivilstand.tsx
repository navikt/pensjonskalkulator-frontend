import { useMemo } from 'react'

import { Accordion, BodyLong, Link } from '@navikt/ds-react'

import { SectionContent } from '@/components/Grunnlag/sections/components/SectionContent'
import { SectionHeader } from '@/components/Grunnlag/sections/components/SectionHeader'
import { useGetPersonQuery } from '@/state/api/apiSlice'
import { formatSivilstand } from '@/utils/sivilstand'

export function Sivilstand() {
  const { data: person, isSuccess } = useGetPersonQuery()

  const formatertSivilstand = useMemo(
    () => (person ? formatSivilstand(person.sivilstand) : ''),
    [person]
  )

  return (
    <Accordion.Item data-testid="accordion-sivilstand">
      <SectionHeader
        label="Sivilstand"
        value={isSuccess ? formatertSivilstand : 'Kunne ikke hentes'}
      />
      <SectionContent>
        <BodyLong>
          Garantipensjon skal sikre et minste garantipensjonsnivå ved 67 år for
          de som har lav eller ingen opptjening til inntektspensjon. Størrelsen
          på garantipensjonen avhenger av din sivilstatus, og om ektefelle,
          partner eller samboer har egen inntekt eller mottar egen pensjon.{' '}
          <Link>Mer om garantipensjon og satser</Link>.
        </BodyLong>
      </SectionContent>
    </Accordion.Item>
  )
}

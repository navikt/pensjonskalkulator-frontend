import { FormattedMessage } from 'react-intl'

import { /* Box, */ HStack, Heading } from '@navikt/ds-react'

interface Props {
  alderspensjonListe?: AlderspensjonPensjonsberegning[][]
  gradertUttaksperiode: GradertUttak | null
  uttaksalder: Alder | null
}

export const BeregningsdetaljerMobil: React.FC<Props> = (/* props */) => {
  return (
    <HStack gap="4 8" width="100%" marginBlock="2 0">
      <Heading size="small" level="3">
        <FormattedMessage id="maanedsbeloep.title" />
      </Heading>
      <div className="gradertUttak">
        {/*  <Box>
          {props.alderspensjonListe?.map((alderspensjon, index) => (
            <div key={index} />
          ))}
        </Box> */}
      </div>
      <div className="heltUttak">
        {/* <Box>
          {props.alderspensjonListe?.map((alderspensjon, index) => (
            <div key={index} />
          ))}
        </Box> */}
      </div>
    </HStack>
  )
}

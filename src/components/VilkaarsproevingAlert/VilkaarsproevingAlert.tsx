/* c8 disable */
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Alert } from '@navikt/ds-react'

import { useGetGradertUfoereAfpFeatureToggleQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import {
  selectNedreAldersgrense,
  selectNormertPensjonsalder,
} from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

export interface Props {
  vilkaarsproeving: Vilkaarsproeving
  uttaksalder: Alder
  hasAFP?: boolean
}

export const VilkaarsproevingAlert = ({
  vilkaarsproeving,
  uttaksalder,
  hasAFP = false,
}: Props) => {
  const intl = useIntl()
  const normertPensjonsalder = useAppSelector(selectNormertPensjonsalder)
  const nedreAldersgrense = useAppSelector(selectNedreAldersgrense)

  const { data: getGradertUfoereAfpFeatureToggle } =
    useGetGradertUfoereAfpFeatureToggleQuery()

  const isGradertUfoereAfpToggleEnabled =
    getGradertUfoereAfpFeatureToggle?.enabled

  const harIkkeNokOpptjening = React.useMemo(() => {
    return (
      JSON.stringify(vilkaarsproeving.alternativ?.heltUttaksalder) ===
        JSON.stringify(normertPensjonsalder) &&
      !vilkaarsproeving.alternativ?.gradertUttaksalder
    )
  }, [vilkaarsproeving])

  const isHeltUttaksalderLik = React.useMemo(() => {
    return (
      JSON.stringify(vilkaarsproeving.alternativ?.heltUttaksalder) ===
      JSON.stringify(uttaksalder)
    )
  }, [vilkaarsproeving])

  const gradertUttaksalder = vilkaarsproeving?.alternativ?.gradertUttaksalder
  const heltUttaksalder = vilkaarsproeving?.alternativ?.heltUttaksalder
  const uttaksgrad = vilkaarsproeving?.alternativ?.uttaksgrad

  return (
    <Alert variant="warning">
      <FormattedMessage id="beregning.vilkaarsproeving.intro" />

      {isGradertUfoereAfpToggleEnabled && hasAFP ? (
        <>
          <FormattedMessage
            id={
              harIkkeNokOpptjening
                ? 'beregning.vilkaarsproeving.intro.ikke_nok_opptjening'
                : 'beregning.vilkaarsproeving.intro.medAFP.optional'
            }
            values={{
              ...getFormatMessageValues(),
              normertPensjonsalder: formatUttaksalder(
                intl,
                normertPensjonsalder
              ),
            }}
          />
          {
            // 1. Hvis forslag om ny alder for helt uttak uten forslag for gradert uttak
            !harIkkeNokOpptjening && !gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.medAFP.heltUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtHeltStartAar: heltUttaksalder?.aar,
                  alternativtHeltStartMaaned: heltUttaksalder?.maaneder,
                }}
              />
            )
          }
          {
            // 2. Hvis forslag om ny alder for gradert uttak uten forslag for helt uttak
            isHeltUttaksalderLik && gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.medAFP.gradertUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtGrad: uttaksgrad,
                  nedreAldersgrense: formatUttaksalder(intl, nedreAldersgrense),
                }}
              />
            )
          }
          {
            // 3. Hvis forslag om ny alder for helt uttak og ny alder for gradert uttak
            !isHeltUttaksalderLik && gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.medAFP.heltOgGradertUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtGrad: uttaksgrad,
                  nedreAldersgrense: formatUttaksalder(intl, nedreAldersgrense),
                  alternativtHeltStartAar: heltUttaksalder?.aar,
                  alternativtHeltStartMaaned: heltUttaksalder?.maaneder,
                }}
              />
            )
          }
        </>
      ) : (
        <>
          <FormattedMessage
            id={
              harIkkeNokOpptjening
                ? 'beregning.vilkaarsproeving.intro.ikke_nok_opptjening'
                : 'beregning.vilkaarsproeving.intro.optional'
            }
            values={{
              ...getFormatMessageValues(),
              normertPensjonsalder: formatUttaksalder(
                intl,
                normertPensjonsalder
              ),
            }}
          />
          {
            // 1. Hvis forslag om ny alder for helt uttak uten forslag for gradert uttak
            !harIkkeNokOpptjening && !gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.heltUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtHeltStartAar: heltUttaksalder?.aar,
                  alternativtHeltStartMaaned: heltUttaksalder?.maaneder,
                }}
              />
            )
          }
          {
            // 2. Hvis forslag om ny alder for gradert uttak uten forslag for helt uttak
            isHeltUttaksalderLik && gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.gradertUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtGrad: uttaksgrad,
                  alternativtGradertStartAar: gradertUttaksalder?.aar,
                  alternativtGradertStartMaaned: gradertUttaksalder?.maaneder,
                }}
              />
            )
          }
          {
            // 3. Hvis forslag om ny alder for helt uttak og ny alder for gradert uttak
            !isHeltUttaksalderLik && gradertUttaksalder && (
              <FormattedMessage
                id="beregning.vilkaarsproeving.alternativer.heltOgGradertUttak"
                values={{
                  ...getFormatMessageValues(),
                  alternativtGrad: uttaksgrad,
                  alternativtGradertStartAar: gradertUttaksalder?.aar,
                  alternativtGradertStartMaaned: gradertUttaksalder?.maaneder,
                  alternativtHeltStartAar: heltUttaksalder?.aar,
                  alternativtHeltStartMaaned: heltUttaksalder?.maaneder,
                }}
              />
            )
          }
        </>
      )}
    </Alert>
  )
}

export default VilkaarsproevingAlert

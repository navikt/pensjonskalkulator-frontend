import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, Heading, VStack } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

import { AfpDetaljer } from './Felles/AfpDetaljer'
import { AfpDetaljerListe } from './hooks'

interface Props {
  afpDetaljerListe: AfpDetaljerListe[]
}

export const AfpDetaljerGrunnlag: React.FC<Props> = ({ afpDetaljerListe }) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const renderDetaljer = (afpDetaljForValgtUttak: AfpDetaljerListe) => (
    <AfpDetaljer afpDetaljForValgtUttak={afpDetaljForValgtUttak} />
  )

  return (
    <VStack gap="14" width="100%" data-testid="beregningsdetaljer-for-overgangskull">
      {afpDetaljerListe.map((afpDetaljForValgtUttak, index) => (
        <Box key={index}>
          <VStack gap="4 8" width="100%" marginBlock="6 4">
            {renderHeading(afpDetaljForValgtUttak, index)}
            {renderDetaljer(afpDetaljForValgtUttak)}
          </VStack>
        </Box>
      ))}
    </VStack>
  )

  function renderHeading(
    afpDetaljForValgtUttak: AfpDetaljerListe,
    index: number = 0
  ) {
    const currentAge =
      gradertUttaksperiode?.uttaksalder?.aar ?? uttaksalder?.aar
    const currentMonths =
      gradertUttaksperiode?.uttaksalder?.maaneder ?? uttaksalder?.maaneder

    // For AFP Privat - handle both current age and 67-year headings
    if (afpDetaljForValgtUttak.afpPrivat.length > 0) {
      const isGradertUttak = Boolean(
        gradertUttaksperiode &&
          gradertUttaksperiode?.uttaksalder.aar !== uttaksalder?.aar &&
          gradertUttaksperiode.grad > 0
      )

      if (index === 0 && isGradertUttak && currentAge && currentAge < 67) {
        return (
          <Heading size="small" level="4">
            <FormattedMessage
              id="beregning.detaljer.afpPrivat.gradertUttak.title"
              values={{
                ...getFormatMessageValues(),
                alderAar: `${currentAge} år`,
                alderMd:
                  currentMonths && currentMonths > 0
                    ? `og ${currentMonths} måneder`
                    : '',
              }}
            />
          </Heading>
        )
      } else {
        return (
          <Heading size="small" level="4">
            <FormattedMessage
              id="beregning.detaljer.afpPrivat.heltUttak.title"
              values={{
                ...getFormatMessageValues(),
                alderAar: `${currentAge && currentAge < 67 ? 67 : currentAge} år`,
                alderMd:
                  currentAge &&
                  currentAge >= 67 &&
                  currentMonths &&
                  currentMonths > 0
                    ? `og ${currentMonths} måneder`
                    : '',
              }}
            />
          </Heading>
        )
      }
    }

    // For AFP Offentlig
    if (afpDetaljForValgtUttak.afpOffentlig.length > 0) {
      return (
        <Heading size="small" level="4">
          <FormattedMessage
            id="beregning.detaljer.afpOffentlig.uttak.title"
            values={{
              ...getFormatMessageValues(),
              alderAar: `${currentAge} år`,
              alderMd:
                currentMonths && currentMonths > 0
                  ? `og ${currentMonths} måneder`
                  : '',
            }}
          />
        </Heading>
      )
    }

    // For Pre-2025 Offentlig AFP
    if (afpDetaljForValgtUttak.pre2025OffentligAfp.length > 0) {
      return (
        <Heading size="small" level="4">
          <FormattedMessage
            id="beregning.detaljer.grunnpensjon.pre2025OffentligAfp.title"
            values={{
              ...getFormatMessageValues(),
              alderAar: `${uttaksalder?.aar} år`,
              alderMd: `og ${uttaksalder!.maaneder} måneder`,
            }}
          />
        </Heading>
      )
    }

    return null
  }
}

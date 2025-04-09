import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Box, VStack } from '@navikt/ds-react'

import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import { useAppSelector } from '@/state/hooks'
import { selectFoedselsdato } from '@/state/userInput/selectors'
import { formatUttaksalder, transformUttaksalderToDate } from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'

import styles from './MaanedsbeloepBoks.module.scss'

interface Props {
  alder: Alder
  grad: number
  pensjonsavtale: number
  afp?: number
  alderspensjon?: number
}

export const MaanedsbeloepBoks: React.FC<Props> = ({
  alder,
  pensjonsavtale,
  afp,
  alderspensjon,
  grad,
}) => {
  const intl = useIntl()

  const foedselsdato = useAppSelector(selectFoedselsdato)

  const harKunAlderspensjon = alderspensjon && !afp && !pensjonsavtale

  const summerYtelser = () => {
    return (pensjonsavtale || 0) + (afp || 0) + (alderspensjon || 0)
  }

  const formatertAlderTittel = () => {
    return formatUttaksalder(intl, {
      aar: alder.aar,
      maaneder: alder.maaneder,
    })
  }

  const hentUttaksmaanedOgAar = (uttak: Alder) => {
    const date = transformUttaksalderToDate(uttak, foedselsdato!)
    const [day, month, year] = date.split('.')
    const maaned = new Date(`${year}-${month}-${day}`).toLocaleDateString(
      getSelectedLanguage(),
      {
        month: 'long',
      }
    )
    return {
      maaned,
      aar: year,
    }
  }

  return (
    <Box
      marginBlock="1 0"
      borderRadius="medium"
      paddingInline="6"
      paddingBlock="4"
      background="bg-subtle"
      maxWidth="31rem"
      flexGrow="1"
    >
      <VStack className={styles.maanedsbeloep} gap="1">
        <BodyLong size="medium" weight="semibold">
          <FormattedMessage
            id="beregning.avansert.maanedsbeloep.tittel_1"
            values={{
              aar: alder.aar,
              maaned: alder.maaneder,
            }}
          />
          {formatertAlderTittel()}{' '}
          {harKunAlderspensjon && `(${hentUttaksmaanedOgAar(alder).maaned})`}
        </BodyLong>
        {afp && (
          <div>
            <BodyLong size="medium">
              <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
            </BodyLong>
            {formatInntekt(afp ?? 0)} kr
          </div>
        )}
        {pensjonsavtale > 0 && (
          <div>
            <BodyLong size="medium">
              <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
              :
            </BodyLong>
            {formatInntekt(pensjonsavtale)} kr
          </div>
        )}
        {alderspensjon && (
          <div>
            <BodyLong size="medium">
              <FormattedMessage
                id="beregning.avansert.maanedsbeloep.alderspensjon"
                values={{ prosent: grad }}
              />
              :
            </BodyLong>
            {formatInntekt(alderspensjon)} kr
          </div>
        )}
        {!harKunAlderspensjon && (
          <div>
            <BodyLong
              size="medium"
              className={styles.maanedsbeloepSum}
              as="span"
            >
              <FormattedMessage
                id="beregning.avansert.maanedsbeloep.sum"
                values={hentUttaksmaanedOgAar(alder)}
              />
              :
            </BodyLong>
            {formatInntekt(summerYtelser())} kr
          </div>
        )}
      </VStack>
    </Box>
  )
}

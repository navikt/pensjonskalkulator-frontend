import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, VStack } from '@navikt/ds-react'

import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import { useAppSelector } from '@/state/hooks'
import { selectFoedselsdato } from '@/state/userInput/selectors'
import { formatUttaksalder, transformUttaksalderToDate } from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'

import styles from './MaanedsbeloepMobil.module.scss'

interface Props {
  alder: Alder
  grad: number
  pensjonsavtale?: number
  afp?: number
  alderspensjon?: number
}

export const MaanedsbeloepMobil: React.FC<Props> = ({
  alder,
  pensjonsavtale,
  afp,
  alderspensjon,
  grad,
}) => {
  const intl = useIntl()

  const foedselsdato = useAppSelector(selectFoedselsdato)

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
    <VStack className={styles.maanedsbeloep} gap="1">
      <BodyLong size="medium" weight="semibold">
        <FormattedMessage
          id="beregning.avansert.maanedsbeloep.tittel_1"
          values={{
            aar: alder.aar,
            maaned: alder.maaneder,
          }}
        />
        {formatertAlderTittel()}
      </BodyLong>
      {afp && (
        <div>
          <BodyLong size="medium">
            <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
          </BodyLong>
          {formatInntekt(afp ?? 0)} kr
        </div>
      )}
      {pensjonsavtale && (
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
      <div>
        <BodyLong size="medium">
          <FormattedMessage
            id="beregning.avansert.maanedsbeloep.sum"
            values={{
              maaned: hentUttaksmaanedOgAar(alder).maaned,
            }}
          />
          :
        </BodyLong>
        {formatInntekt(summerYtelser())} kr
      </div>
    </VStack>
  )
}

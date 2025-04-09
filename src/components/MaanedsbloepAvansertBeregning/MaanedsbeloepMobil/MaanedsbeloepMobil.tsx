import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong, VStack } from '@navikt/ds-react'

import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import { useAppSelector } from '@/state/hooks'
import { selectFoedselsdato } from '@/state/userInput/selectors'
import { transformUttaksalderToDate } from '@/utils/alder'
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
  const foedselsdato = useAppSelector(selectFoedselsdato)

  const summerYtelser = () => {
    return (pensjonsavtale || 0) + (afp || 0) + (alderspensjon || 0)
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
      {afp && (
        <div>
          <BodyLong size="small">
            <FormattedMessage id="beregning.avansert.maanedsbeloep.afp" />:
          </BodyLong>
          {formatInntekt(afp ?? 0)} kr
        </div>
      )}
      {pensjonsavtale && (
        <div>
          <BodyLong size="small">
            <FormattedMessage id="beregning.avansert.maanedsbeloep.pensjonsavtaler" />
            :
          </BodyLong>
          {formatInntekt(pensjonsavtale)} kr
        </div>
      )}
      {alderspensjon && (
        <div>
          <BodyLong size="small">
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
        <BodyLong size="small">
          <FormattedMessage
            id="beregning.avansert.maanedsbeloep.sum"
            values={hentUttaksmaanedOgAar(alder)}
          />
          :
        </BodyLong>
        {formatInntekt(summerYtelser())} kr
      </div>
    </VStack>
  )
}

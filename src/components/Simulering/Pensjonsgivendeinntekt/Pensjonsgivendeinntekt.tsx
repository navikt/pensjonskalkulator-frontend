import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BodyLong, Heading, Link, VStack } from '@navikt/ds-react'

import { EndreInntekt } from '@/components/EndreInntekt'
import { SanityReadmore } from '@/components/common/SanityReadmore'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
  selectAarligInntektFoerUttakBeloepFraSkatt,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './Pensjonsgivendeinntekt.module.scss'

interface Props {
  goToAvansert: React.MouseEventHandler<HTMLAnchorElement>
}

export const Pensjonsgivendeinntekt: React.FC<Props> = ({ goToAvansert }) => {
  const dispatch = useAppDispatch()

  const aarligInntektFoerUttakBeloepFraBrukerInput = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraBrukerInput
  )

  const aarligInntektFoerUttakBeloepFraSkatt = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraSkatt
  )

  return (
    <VStack gap="2">
      <Heading level="2" size="small">
        <FormattedMessage id="grunnlag2.endre_inntekt.title" />
      </Heading>
      <BodyLong>
        <FormattedMessage
          id="grunnlag.inntekt.ingress"
          values={{
            ...getFormatMessageValues(),
            beloep: aarligInntektFoerUttakBeloepFraSkatt?.beloep,
            aar: aarligInntektFoerUttakBeloepFraSkatt?.aar,
          }}
        />
        <Link href="#" onClick={goToAvansert}>
          <FormattedMessage id="grunnlag.inntekt.avansert_link" />
        </Link>
      </BodyLong>
      <EndreInntekt
        visning="enkel"
        variant="secondary"
        className={styles.endreInntektButton}
        value={aarligInntektFoerUttakBeloepFraBrukerInput}
        onSubmit={(uformatertInntekt) => {
          dispatch(
            userInputActions.setCurrentSimulationAarligInntektFoerUttakBeloep(
              uformatertInntekt
            )
          )
          dispatch(userInputActions.setCurrentSimulationUttaksalder(null))
        }}
      />
      <SanityReadmore id="om_pensjonsgivende_inntekt" />
    </VStack>
  )
}

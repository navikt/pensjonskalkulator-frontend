import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Box, HStack, Heading } from '@navikt/ds-react'

import { EndreInntekt } from '@/components/EndreInntekt'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectAarligInntektFoerUttakBeloepFraBrukerInput } from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './Pensjonsgivendeinntekt.module.scss'

export const Pensjonsgivendeinntekt = () => {
  const intl = useIntl()
  const dispatch = useAppDispatch()

  const aarligInntektFoerUttakBeloepFraBrukerInput = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraBrukerInput
  )

  return (
    <HStack gap="2">
      <Heading level="2" size="small">
        <FormattedMessage id="grunnlag2.endre_inntekt.title" />
      </Heading>
      <BodyLong>
        <FormattedMessage
          id="grunnlag.inntekt.ingress"
          values={{
            ...getFormatMessageValues(),
            beloep: 400,
            aar: 3,
          }}
        />
      </BodyLong>
      <EndreInntekt
        visning="enkel"
        variant="secondary"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    </HStack>
  )
}

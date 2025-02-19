import React from 'react'
import { useNavigate } from 'react-router'

import {
  paths,
  stegvisningOrder,
  stegvisningOrderEndring,
} from '@/router/constants'
import { useGetLoependeVedtakQuery } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectUfoeregrad,
  selectAfp,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'
import {
  isAlderOverAnnenAlder,
  transformFoedselsdatoToAlder,
  AFP_UFOERE_OPPSIGELSESALDER,
} from '@/utils/alder'
import { isLoependeVedtakEndring } from '@/utils/loependeVedtak'

export const useStegvisningNavigation = (currentPath: Path) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const foedselsdato = useAppSelector(selectFoedselsdato)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)

  const { isFetching, data: loependeVedtak } = useGetLoependeVedtakQuery()

  const onStegvisningNext = () => {
    const stepArrays =
      loependeVedtak && isLoependeVedtakEndring(loependeVedtak)
        ? stegvisningOrderEndring
        : stegvisningOrder
    navigate(stepArrays[stepArrays.indexOf(currentPath) + 1])
  }

  const onStegvisningPrevious = () => {
    let antallStepTilbake = 1
    const isEndring = loependeVedtak && isLoependeVedtakEndring(loependeVedtak)
    const stepArrays = isEndring ? stegvisningOrderEndring : stegvisningOrder

    const currentPathIndex = stepArrays.indexOf(currentPath)

    // Hvis brukeren er på eller forbi afp steget (gjelder både endring og vanlig flyt)
    if (currentPathIndex >= stepArrays.indexOf(paths.afp)) {
      // Bruker med uføretrygd som er eldre enn AFP-Uføre oppsigelsesalder har ikke fått steg om AFP og skal navigere tilbake forbi den
      if (
        ufoeregrad &&
        foedselsdato &&
        isAlderOverAnnenAlder(
          transformFoedselsdatoToAlder(foedselsdato),
          AFP_UFOERE_OPPSIGELSESALDER
        )
      ) {
        antallStepTilbake = antallStepTilbake + 1
      } else if (loependeVedtak?.afpPrivat || loependeVedtak?.afpOffentlig) {
        // Bruker med vedtak om AFP har ikke fått steg om AFP og skal navigere tilbake forbi den
        antallStepTilbake = antallStepTilbake + 1
      }
    }

    // Hvis brukeren er på eller forbi ufoeretrygdAFP steget (gjelder både endring og vanlig flyt)
    if (currentPathIndex >= stepArrays.indexOf(paths.ufoeretrygdAFP)) {
      // Bruker uten uføretryg, eller bruker med uføretrygd som har svart "nei" på AFP, eller bruker med uføretrygd eldre enn AFP-Uføre oppsigelsesalder har ikke fått infosteg om AFP + Uføretrygd og skal navigere tilbake forbi den
      if (
        !ufoeregrad ||
        (ufoeregrad && (afp === null || afp === 'nei')) ||
        (ufoeregrad &&
          foedselsdato &&
          isAlderOverAnnenAlder(
            transformFoedselsdatoToAlder(foedselsdato),
            AFP_UFOERE_OPPSIGELSESALDER
          ))
      ) {
        antallStepTilbake = antallStepTilbake + 1
      }
    }

    // Hvis brukeren er på eller forbi samtykkeOffentligAFP steget (gjelder både endring og vanlig flyt)
    if (currentPathIndex >= stepArrays.indexOf(paths.samtykkeOffentligAFP)) {
      // Bruker med uføretrygd eller brukere som har svart noe annet enn "ja_offentlig" på afp steget har ikke fått info steg om samtykkeOffentligAFP og skal navigere tilbake forbi den
      if (ufoeregrad || afp !== 'ja_offentlig') {
        antallStepTilbake = antallStepTilbake + 1
      }
    }

    navigate(stepArrays[currentPathIndex - antallStepTilbake])
  }

  const onStegvisningCancel = () => {
    dispatch(userInputActions.flush())
    navigate(paths.login)
  }

  const handlers = React.useMemo(
    () => ({
      onStegvisningNext: isFetching ? undefined : onStegvisningNext,
      onStegvisningPrevious,
      onStegvisningCancel,
    }),
    [isFetching]
  )

  return [handlers] as const
}

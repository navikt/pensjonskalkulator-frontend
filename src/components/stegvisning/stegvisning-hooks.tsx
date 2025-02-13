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
import { isFoedselsdatoOverEllerLikMinUttaksalder } from '@/utils/alder'
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
    console.log('currentPathIndex', currentPathIndex)

    // Hvis brukeren er på eller forbi afp steget
    if (
      (!isEndring && currentPathIndex >= 4) ||
      (isEndring && currentPathIndex >= 2)
    ) {
      // Bruker med uføretrygd som er eldre enn AFP-Uføre oppsigelsesalder har ikke fått steg om AFP og skal navigere tilbake forbi den
      if (
        ufoeregrad &&
        foedselsdato &&
        isFoedselsdatoOverEllerLikMinUttaksalder(foedselsdato)
      ) {
        console.log('currentPathIndex >= 4: +1')
        antallStepTilbake = antallStepTilbake + 1
      } else if (loependeVedtak?.afpPrivat || loependeVedtak?.afpOffentlig) {
        // Bruker med vedtak om AFP har ikke fått steg om AFP og skal navigere tilbake forbi den
        antallStepTilbake = antallStepTilbake + 1
      }
    }

    // Hvis brukeren er på eller forbi ufoeretrygdAFP steget
    if (
      (!isEndring && currentPathIndex >= 5) ||
      (isEndring && currentPathIndex >= 3)
    ) {
      // Bruker uten uføretryg, eller bruker med uføretrygd som har svart "nei" på AFP, eller bruker med uføretrygd eldre enn AFP-Uføre oppsigelsesalder har ikke fått infosteg om AFP + Uføretrygd og skal navigere tilbake forbi den
      if (
        !ufoeregrad ||
        (ufoeregrad && (afp === null || afp === 'nei')) ||
        (ufoeregrad &&
          foedselsdato &&
          isFoedselsdatoOverEllerLikMinUttaksalder(foedselsdato))
      ) {
        console.log('currentPathIndex >= 5: +1')
        antallStepTilbake = antallStepTilbake + 1
      }
    }

    // Hvis brukeren er på eller forbi samtykkeOffentligAFP steget
    if (
      (!isEndring && currentPathIndex >= 6) ||
      (isEndring && currentPathIndex >= 4)
    ) {
      // Bruker med uføretrygd eller brukere som har svart noe annet enn "ja_offentlig" på afp steget har ikke fått info steg om samtykkeOffentligAFP og skal navigere tilbake forbi den
      if (ufoeregrad || afp !== 'ja_offentlig') {
        console.log('currentPathIndex >= 6: +1', afp)
        antallStepTilbake = antallStepTilbake + 1
      }
    }
    console.log('>>> onStegvisningPrevious', antallStepTilbake)
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

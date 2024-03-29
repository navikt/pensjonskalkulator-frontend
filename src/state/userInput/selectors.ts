import { createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '@/state/api/apiSlice'
import { RootState } from '@/state/store'
import { Simulation } from '@/state/userInput/userInputReducer'
import { checkHarSamboer } from '@/utils/sivilstand'

export const selectUtenlandsopphold = (state: RootState): boolean | null =>
  state.userInput.utenlandsopphold

export const selectSamtykke = (state: RootState): boolean | null =>
  state.userInput.samtykke

export const selectAfp = (state: RootState): AfpRadio | null =>
  state.userInput.afp

export const selectSamboerFraBrukerInput = (state: RootState): boolean | null =>
  state.userInput.samboer

export const selectSivilstand = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return apiSlice.endpoints.getPerson.select(undefined)(state)?.data
      ?.sivilstand
  }
)

export const selectSamboerFraSivilstand = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    const sivilstand =
      apiSlice.endpoints.getPerson.select(undefined)(state)?.data?.sivilstand
    return sivilstand ? checkHarSamboer(sivilstand) : null
  }
)

export const selectSamboer = (state: RootState): boolean | null => {
  const samboerskapFraBrukerInput = selectSamboerFraBrukerInput(state)
  if (samboerskapFraBrukerInput === null) {
    return selectSamboerFraSivilstand(state, undefined)
  }
  return samboerskapFraBrukerInput
}

export const selectAarligInntektFoerUttakBeloepFraBrukerInput = (
  state: RootState
): number | null =>
  state.userInput.currentSimulation.aarligInntektFoerUttakBeloep

export const selectAarligInntektFoerUttakBeloepFraSkatt = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return apiSlice.endpoints.getInntekt.select(undefined)(state)?.data
  }
)

export const selectAarligInntektFoerUttakBeloep = (
  state: RootState
): number | null | undefined => {
  const aarligInntektFoerUttakBeloepFraBrukerInput =
    selectAarligInntektFoerUttakBeloepFraBrukerInput(state)
  if (aarligInntektFoerUttakBeloepFraBrukerInput === null) {
    return selectAarligInntektFoerUttakBeloepFraSkatt(state, undefined)?.beloep
  }
  return aarligInntektFoerUttakBeloepFraBrukerInput
}

export const selectFormatertUttaksalderReadOnly = (
  state: RootState
): string | null =>
  state.userInput.currentSimulation.formatertUttaksalderReadOnly

export const selectCurrentSimulation = (state: RootState): Simulation =>
  state.userInput.currentSimulation

export const selectHarHentetTpoMedlemskap = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return !apiSlice.endpoints.getTpoMedlemskap.select(undefined)(state)
      ?.isUninitialized
  }
)

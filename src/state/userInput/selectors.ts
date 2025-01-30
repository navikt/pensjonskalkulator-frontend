import { createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '@/state/api/apiSlice'
import { RootState } from '@/state/store'
import { Simulation } from '@/state/userInput/userInputReducer'
import { formatInntekt } from '@/utils/inntekt'
import { isLoependeVedtakEndring } from '@/utils/loependeVedtak'
import { checkHarSamboer } from '@/utils/sivilstand'

export const selectHarUtenlandsopphold = (state: RootState): boolean | null =>
  state.userInput.harUtenlandsopphold

export const selectSamtykke = (state: RootState): boolean | null =>
  state.userInput.samtykke

export const selectSamtykkeOffentligAFP = (state: RootState): boolean | null =>
  state.userInput.samtykkeOffentligAFP

export const selectVeilederBorgerFnr = (state: RootState) =>
  state.userInput.veilederBorgerFnr

export const selectVeilederBorgerEncryptedFnr = (state: RootState) =>
  state.userInput.veilederBorgerEncryptedFnr

export const selectIsVeileder = (state: RootState) =>
  !!state.userInput.veilederBorgerFnr ||
  !!state.userInput.veilederBorgerEncryptedFnr

export const selectAfp = (state: RootState): AfpRadio | null =>
  state.userInput.afp

export const selectFoedselsdato = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return apiSlice.endpoints.getPerson.select(undefined)(state)?.data
      ?.foedselsdato
  }
)

export const selectSivilstand = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    // Returner userInput dersom satt, hvis ikke returner respons fra `getPerson`
    const isEndring = selectIsEndring(state)
    if (isEndring) {
      return apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)?.data
        ?.alderspensjon?.sivilstand
    } else {
      const personQuerySivilstandResponse =
        apiSlice.endpoints.getPerson.select()(state).data?.sivilstand ?? 'UGIFT'

      if (state.userInput.sivilstand) {
        return state.userInput.sivilstand
      }

      return (state.userInput.sivilstand ??
        ['UNKNOWN', 'UOPPGITT'].includes(personQuerySivilstandResponse))
        ? 'UGIFT'
        : personQuerySivilstandResponse
    }
  }
)

export const selectEpsHarInntektOver2G = (state: RootState): boolean | null =>
  state.userInput.epsHarInntektOver2G

export const selectEpsHarPensjon = (state: RootState): boolean | null =>
  state.userInput.epsHarPensjon

export const selectSamboerFraVedtak = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    const sivilstand =
      apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)?.data
        ?.alderspensjon?.sivilstand
    return sivilstand ? checkHarSamboer(sivilstand) : null
  }
)

export const selectAarligInntektFoerUttakBeloepFraBrukerInput = (
  state: RootState
): string | null =>
  state.userInput.currentSimulation.aarligInntektFoerUttakBeloep

export const selectAarligInntektFoerUttakBeloepFraSkatt = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    const aarligInntektFraSkatt =
      apiSlice.endpoints.getInntekt.select(undefined)(state)?.data
    return aarligInntektFraSkatt
      ? {
          ...aarligInntektFraSkatt,
          beloep: formatInntekt(aarligInntektFraSkatt?.beloep),
        }
      : undefined
  }
)

export const selectAarligInntektFoerUttakBeloep = (
  state: RootState
): string | null | undefined => {
  const aarligInntektFoerUttakBeloepFraBrukerInput =
    selectAarligInntektFoerUttakBeloepFraBrukerInput(state)

  if (aarligInntektFoerUttakBeloepFraBrukerInput === null) {
    return formatInntekt(
      selectAarligInntektFoerUttakBeloepFraSkatt(state, undefined)?.beloep
    )
  }
  return aarligInntektFoerUttakBeloepFraBrukerInput
}

export const selectCurrentSimulationUtenlandsperioder = (
  state: RootState
): Utenlandsperiode[] => state.userInput.currentSimulation.utenlandsperioder

export const selectFormatertUttaksalderReadOnly = (
  state: RootState
): string | null =>
  state.userInput.currentSimulation.formatertUttaksalderReadOnly

export const selectCurrentSimulation = (state: RootState): Simulation =>
  state.userInput.currentSimulation

export const selectHarHentetOffentligTp = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    const offentligTpEntries = Object.keys(state.api.queries).filter((key) =>
      key.startsWith('offentligTp')
    )

    return offentligTpEntries.some(
      (key) => !state.api.queries[key]?.isUninitialized
    )
  }
)

export const selectLoependeVedtak = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)
      ?.data as LoependeVedtak
  }
)

export const selectUfoeregrad = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    return apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)?.data
      ?.ufoeretrygd.grad as number
  }
)

export const selectIsEndring = createSelector(
  [(state) => state, (_, params = undefined) => params],
  (state) => {
    if (!apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)?.data) {
      return false
    }
    return isLoependeVedtakEndring(
      apiSlice.endpoints.getLoependeVedtak.select(undefined)(state)
        ?.data as LoependeVedtak
    )
  }
)

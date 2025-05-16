import { describe, it } from 'vitest'

import { setupStore } from '../store'
import {
  UserInputState,
  userInputInitialState,
} from '../userInput/userInputSlice'

describe('store', () => {
  it('returnerer store med riktig userInput initial state', () => {
    const store = setupStore()
    const initialState = store.getState()
    expect(initialState.userInput).toBe(userInputInitialState)
  })

  it('returnerer store med riktig state når setupStore kalles med parameter', () => {
    const state: UserInputState = {
      veilederBorgerEncryptedFnr: undefined,
      veilederBorgerFnr: undefined,
      harUtenlandsopphold: true,
      utenlandsperioder: [],
      samtykke: true,
      samtykkeOffentligAFP: true,
      afp: null,
      afpUtregningValg: null,
      sivilstand: null,
      epsHarPensjon: null,
      epsHarInntektOver2G: null,
      afpInntektMaanedFoerUttak: null,
      currentSimulation: {
        beregningsvalg: null,
        uttaksalder: null,
        aarligInntektFoerUttakBeloep: '500 000',
        gradertUttaksperiode: null,
      },
    }

    const store = setupStore({ userInput: state }, true)
    const initialState = store.getState()

    expect(initialState.userInput).toMatchObject(state)
  })
})

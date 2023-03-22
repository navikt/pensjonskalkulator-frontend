import { describe, it } from 'vitest'

import { setupStore } from '../store'
import {
  userInputInitialState,
  UserInputState,
} from '../userInput/userInputReducer'

describe('store', () => {
  it('returnerer store med riktig slices og default state', () => {
    const store = setupStore()
    const initialState = store.getState()

    expect(initialState).toHaveProperty('api')
    expect(initialState).toHaveProperty('userInput')
    expect(initialState.userInput).toMatchObject(userInputInitialState)
  })

  it('returnerer store med riktig state når setupStore kalles med parameter', () => {
    const state: UserInputState = {
      samtykke: true,
      currentSimulation: {
        inntekt: 500000,
        uttaksalder: null,
        uttaksgrad: null,
      },
    }

    const store = setupStore({ api: undefined, userInput: state })
    const initialState = store.getState()

    expect(initialState.userInput).toMatchObject(state)
  })
})

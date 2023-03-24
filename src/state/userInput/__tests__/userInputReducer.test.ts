import userInputSlice, {
  userInputInitialState,
  userInputActions,
} from '../userInputReducer'

describe('userInputSlice', () => {
  // TODO fjerne denne dersom den testes riktig i store
  it('initialize slice with initialValue', () => {
    const listSliceInit = userInputSlice(userInputInitialState, {
      type: 'unknown',
    })
    expect(listSliceInit).toBe(userInputInitialState)
  })

  describe('actions', () => {
    it('setSamtykke', () => {
      const updatedState = userInputSlice(
        userInputInitialState,
        userInputActions.setSamtykke(true)
      )

      expect(updatedState).toStrictEqual({
        ...userInputInitialState,
        samtykke: true,
      })
    })
  })
})

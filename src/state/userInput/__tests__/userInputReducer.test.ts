import userInputSlice, {
  userInputInitialState,
  userInputActions,
} from '../userInputReducer'

describe('userInputSlice', () => {
  test('initialize slice with initialValue', () => {
    const listSliceInit = userInputSlice(userInputInitialState, {
      type: 'unknown',
    })
    expect(listSliceInit).toBe(userInputInitialState)
  })

  describe('actions', () => {
    test('setSamtykke', () => {
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

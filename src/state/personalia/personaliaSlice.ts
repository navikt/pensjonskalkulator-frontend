import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserPersonalia {
  id: number | null
  sivilstand: string | null
  something?: string
  somethingElse?: string
  hasSomething?: boolean
}

interface PersonaliaState {
  user: UserPersonalia
  ektefelle?: UserPersonalia
}

const initialState: PersonaliaState = {
  user: {
    id: null,
    sivilstand: null,
  },
  ektefelle: undefined,
}

export const personaliaSlice = createSlice({
  name: 'personaliaSlice',
  initialState,
  reducers: {
    // Logout the user by returning the initial state
    resetPersonalia: () => initialState,
    // Save the user's info
    setUserInfo: (state, action: PayloadAction<PersonaliaState>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.user = action.payload.user
    },
  },
})

export const { resetPersonalia, setUserInfo } = personaliaSlice.actions
// ? Export the authSlice.reducer to be included in the store.
export default personaliaSlice.reducer

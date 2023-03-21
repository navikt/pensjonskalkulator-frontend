import { Unsubscribe } from '@reduxjs/toolkit'

import { AppStartListening /* , AppListenerEffectAPI */ } from '../store'
import { userInputActions } from '../userInput/userInputReducer'

async function onSamtykkeUpdate({
  payload,
}: ReturnType<typeof userInputActions.setSamtykke>) {
  // { dispatch, getState, getOriginalState, condition }: AppListenerEffectAPI
  // const hasSamtykke = getState().userInput.samtykke
  console.log('>>>> running EFFECT onSamtykkeUpdate...', payload)
  // f.eks flush store, logout, delay and redirect or dispatch another action
}

export function createSamtykkeListener(
  startListening: AppStartListening
): Unsubscribe {
  const subscriptions = [
    startListening({
      actionCreator: userInputActions.setSamtykke,
      effect: onSamtykkeUpdate,
    }),
  ]

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}

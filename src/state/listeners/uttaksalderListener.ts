import { createIntl, createIntlCache } from 'react-intl'

import { Unsubscribe } from '@reduxjs/toolkit'

import { getCookie, getTranslations } from '@/context/LanguageProvider/utils'
import { AppListenerEffectAPI, AppStartListening } from '@/state/store'
import { userInputActions } from '@/state/userInput/userInputReducer'
import { formatUttaksalder } from '@/utils/alder'

/**
 * onSetCurrentSimulationStartAlder
 * 1. formaterer uttaksalder
 * 2. oppdaterer current simulation med formatert uttaksalder
 *
 * @param payload - alder satt av setCurrentSimulationStartAlder
 * @param { dispatch, getState getOriginalState, condition } - fra AppListenerEffectAPI
 */
async function onSetCurrentSimulationStartAlder(
  {
    payload,
  }: ReturnType<typeof userInputActions.setCurrentSimulationStartAlder>,
  { dispatch /* , getState*/ }: AppListenerEffectAPI
) {
  /* c8 ignore next 1 */
  const locale = getCookie('decorator-language') || 'nb'
  const cache = createIntlCache()
  const intl = createIntl(
    {
      locale,
      messages: getTranslations(locale),
    },
    cache
  )
  const formatertUttaksalder = formatUttaksalder(intl, payload)

  dispatch(
    userInputActions.syncCurrentSimulationFormatertUttaksalderReadOnly(
      formatertUttaksalder
    )
  )
}

// Vil kalle onSetFormatertUttaksalder hver gang setCurrentSimulationFormatertUttaksalder kjører
export function createUttaksalderListener(
  startListening: AppStartListening
): Unsubscribe {
  const subscriptions = [
    startListening({
      actionCreator: userInputActions.setCurrentSimulationStartAlder,
      effect: onSetCurrentSimulationStartAlder,
    }),
  ]

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}

import {
  AnalyticsEvent,
  getAnalyticsInstance,
} from '@navikt/nav-dekoratoren-moduler'

import { isAnchorTag } from '@/state/api/typeguards'

type IExtendedAnalyticsEvents =
  | AnalyticsEvent<'les mer åpnet', { tittel: string }>
  | AnalyticsEvent<'les mer lukket', { tittel: string }>
  | AnalyticsEvent<'radiogroup valgt', { tekst: string; valg: string }>
  | AnalyticsEvent<'knapp klikket', { tekst: string }>
  | AnalyticsEvent<'chip valgt', { tekst: string; chipVerdi: string }>
  | AnalyticsEvent<
      'grunnlag for beregningen',
      { tekst: string; data: string | number }
    >
  | AnalyticsEvent<
      'valg av uttaksalder for 100 % alderspensjon',
      { tekst: string; data: string }
    >
  | AnalyticsEvent<
      'valg av uttaksalder for gradert alderspensjon',
      { tekst: string; data: string }
    >
  | AnalyticsEvent<'valg av uttaksgrad', { tekst: string; data: string }>
  | AnalyticsEvent<'graf tooltip åpnet', { data: string }>
  | AnalyticsEvent<'help text åpnet', { tekst: string }>
  | AnalyticsEvent<'help text lukket', { tekst: string }>
  | AnalyticsEvent<'feilside', { tekst: string }>
  | AnalyticsEvent<'lenke klikket', { href?: string; target?: string }>
  | AnalyticsEvent<'info', { tekst: string; data: string | number }>
  | AnalyticsEvent<'show more åpnet', { tekst: string }>
  | AnalyticsEvent<'show more lukket', { tekst: string }>
  | AnalyticsEvent<'resultat vist', { tekst: string }>

export const logger =
  getAnalyticsInstance<IExtendedAnalyticsEvents>('dekoratoren')

export const wrapLogger =
  (
    name: IExtendedAnalyticsEvents['name'],
    properties: IExtendedAnalyticsEvents['properties']
  ) =>
  (func: () => void) =>
  () => {
    logger(name, properties)
    return func()
  }

export const logOpenLink: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  if (isAnchorTag(e.target)) {
    e.preventDefault()
    const { href, target } = e.target
    logger('lenke klikket', { href, target })
    window.open(href, target)
  }
}

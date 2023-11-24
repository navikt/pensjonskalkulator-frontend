import {
  getAmplitudeInstance,
  AmplitudeEvent,
} from '@navikt/nav-dekoratoren-moduler'

type IExtendedAmpltitudeEvents =
  | AmplitudeEvent<'readmore åpnet', { tekst: string }>
  | AmplitudeEvent<'readmore lukket', { tekst: string }>
  | AmplitudeEvent<'radiogroup valgt', { tekst: string; valg: string }>
  | AmplitudeEvent<'button klikk', { tekst: string }>
  | AmplitudeEvent<'chip valgt', { tekst: string; data: string }>
  | AmplitudeEvent<'chip avvalgt', { tekst: string; data: string }>
  | AmplitudeEvent<'graf tooltip åpnet', { data: string }>
  | AmplitudeEvent<'table expand åpnet', { tekst: string; data: string }>
  | AmplitudeEvent<'table expand lukket', { tekst: string; data: string }>
  | AmplitudeEvent<'help text åpnet', { tekst: string }>
  | AmplitudeEvent<'help text lukket', { tekst: string }>
  | AmplitudeEvent<'alert', { tekst: string }>
  | AmplitudeEvent<'feilside', { tekst: string }>

export const logger =
  getAmplitudeInstance<IExtendedAmpltitudeEvents>('dekoratoren')

export const wrapLogger =
  (
    name: IExtendedAmpltitudeEvents['name'],
    properties: IExtendedAmpltitudeEvents['properties']
  ) =>
  (func: () => void) =>
  () => {
    logger(name, properties)
    return func()
  }

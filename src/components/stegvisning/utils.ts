export const STEGVISNING_FORM_NAMES = {
  afp: 'stegvisning-afp',
  samtykkeOffentligAFP: 'stegvisning-samtykke-offentlig-afp',
  samtykkePensjonsavtaler: 'stegvisning-samtykke-pensjonsavtaler',
  sivilstand: 'stegvisning-sivilstand',
  utenlandsopphold: 'stegvisning-utenlandsopphold',
}

export const convertBooleanRadioToBoolean = (
  input: BooleanRadio | null
): boolean | null => {
  if (input === null) {
    return null
  }
  return input === 'ja' ? true : false
}

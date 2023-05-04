export const formatSivilstand = (sivilstand: Sivilstand): string => {
  switch (sivilstand) {
    case 'GIFT': {
      return 'Gift'
    }
    case 'SKILT': {
      return 'Skilt'
    }
    case 'SEPARERT': {
      return 'Separert'
    }
    case 'REGISTRERT_PARTNER': {
      return 'Registrert partner'
    }
    case 'SEPARERT_PARTNER': {
      return 'Separert partner'
    }
    case 'SKILT_PARTNER': {
      return 'Skilt partner'
    }
    case 'GJENLEVENDE_PARTNER': {
      return 'Gjenlevende partner'
    }
    default: {
      return 'Ugift'
    }
  }
}

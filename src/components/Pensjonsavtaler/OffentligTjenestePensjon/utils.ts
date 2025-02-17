import type { IntlShape } from 'react-intl'

import type { Translations } from '@/translations/nb'

export const tpNummerMap: Record<string, 'spk' | 'klp'> = {
  '3010': 'spk',
  '3060': 'spk',
  '4080': 'klp',
  '3200': 'klp',
}

export const getLeverandoerHeading = (
  intl: IntlShape,
  tpNummer: string,
  tpLeverandoer?: string
) => {
  if (tpNummer in tpNummerMap) {
    return intl.formatMessage({
      id: `pensjonsavtaler.offentligtp.subtitle.${tpNummerMap[tpNummer]}`,
    })
  }
  return tpLeverandoer
}

export const getInfoOmAfpOgBetingetTjenestepensjon = (
  tpNummer: string,
  afp: AfpRadio | null,
  betingetTjenestepensjonErInkludert?: boolean
): keyof Translations => {
  if (tpNummerMap[tpNummer] === 'klp') {
    if (afp === 'ja_offentlig' || afp === 'ja_privat') {
      return 'pensjonsavtaler.offentligtp.klp.afp_ja'
    }
    return 'pensjonsavtaler.offentligtp.klp.afp_nei+vetikke'
  }

  // SPK
  if (afp === 'ja_offentlig' || afp === 'ja_privat') {
    return 'pensjonsavtaler.offentligtp.spk.afp_ja'
  } else if (afp === 'vet_ikke') {
    return 'pensjonsavtaler.offentligtp.spk.afp_vet_ikke'
  } else {
    if (betingetTjenestepensjonErInkludert) {
      return 'pensjonsavtaler.offentligtp.spk.afp_nei.med_betinget'
    } else {
      return 'pensjonsavtaler.offentligtp.spk.afp_nei.uten_betinget'
    }
  }
}

export const formatLeverandoerList = (
  locale: string,
  leverandoerList: string[]
) =>
  Intl.ListFormat
    ? new Intl.ListFormat(locale, { type: 'disjunction' }).format(
        leverandoerList
      )
    : leverandoerList.join(', ')

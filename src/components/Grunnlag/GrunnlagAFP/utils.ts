// Input:
// AFPValg
// isKap19
// erApoteker
// loependeVedtak
// uforegrad
// intl - interasjonalisering
import { IntlShape } from 'react-intl'

import { isFoedtFoer1963 } from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

interface IAfpGrunnlagInput {
  /** Dersom bruker er kap19/apoteker kan man velge å beregne offentlig AFP sammen med aldersensjon */
  afpUtregning: AfpUtregningValg
  /** Valg av hvilken AFP utregning bruker har valgt */
  afpValg: AfpRadio | null
  /** Valg for beregning av pensjon */
  beregningsvalg: Beregningsvalg | null
  /** Indikerer om brukeren er apoteker */
  erApoteker: boolean
  /** Brukerens fødselsdato */
  foedselsdato: string
  /** Informasjon om løpende vedtak */
  loependeVedtak: LoependeVedtak
  /** Samtykke til beregning av offentlig AFP */
  samtykkeOffentligAFP: boolean | null
}

export const afpContentIntl = (intl: IntlShape) => ({
  offentligIkkeBeregnet_1: {
    title: `${intl.formatMessage({ id: 'afp.offentlig' })} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`,
    content: 'grunnlag.afp.ingress.ja_offentlig_utilgjengelig',
  },

  afpOffentligOppgitt_2: {
    title: `${intl.formatMessage({ id: 'afp.offentlig' })}`,
    content: 'grunnlag.afp.ingress.ja_offentlig',
  },

  offentligAfpOgUforeKanIkkeBeregnes_3: {
    title: `${intl.formatMessage({ id: 'afp.offentlig' })} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`,
    content: 'grunnlag.afp.ingress.ja_offentlig.ufoeretrygd',
  },

  afpPrivat_4: {
    title: `${intl.formatMessage({ id: 'afp.privat' })}`,
    content: 'grunnlag.afp.ingress.ja_privat',
  },

  afpPrivatIkkeBeregnet_5: {
    title: `${intl.formatMessage({ id: 'afp.nei' })} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`,
    content: 'grunnlag.afp.ingress.ja_privat.ufoeretrygd',
  },

  afpIkkeSvart_6: {
    title: `${intl.formatMessage({ id: 'afp.nei' })}`,
    content: 'grunnlag.afp.ingress.nei',
  },

  afpVetIkke_7: {
    title: `${intl.formatMessage({ id: 'afp.vet_ikke' })}`,
    content: 'grunnlag.afp.ingress.vet_ikke',
  },

  afpVetIkkeUforetrygd_8: {
    title: `${intl.formatMessage({ id: 'afp.vet_ikke' })}`,
    content: 'grunnlag.afp.ingress.vet_ikke.ufoeretrygd',
  },

  afpUforetrygd_9: {
    title: `${intl.formatMessage({ id: 'afp.nei' })}`,
    content: 'grunnlag.afp.ingress.overgangskull.ufoeretrygd_eller_ap',
  },

  afpUforetrygdNei_10: {
    title: `${intl.formatMessage({ id: 'afp.nei' })}`,
    content: 'grunnlag.afp.ingress.ufoeretrygd',
  },
  afpPrivatUendret_11: {
    title: `${intl.formatMessage({ id: 'afp.privat' })} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`,
    content: 'grunnlag.afp.ingress.ja_privat.endring',
  },
  harAfpOffentlig_12: {
    title: `${intl.formatMessage({ id: 'afp.offentlig' })}`,
    content: 'grunnlag.afp.ingress.overgangskull',
  },
})

export const generateAfpContent =
  (intl: IntlShape) => (input: IAfpGrunnlagInput) => {
    const content = afpContentIntl(intl)
    const {
      afpValg,
      samtykkeOffentligAFP,
      afpUtregning,
      foedselsdato,
      loependeVedtak,
      beregningsvalg,
      erApoteker,
    } = input

    const hasUfoeregradGreaterThanZero = loependeVedtak?.ufoeretrygd?.grad > 0
    const has100PercentUfoeretrygd = loependeVedtak?.ufoeretrygd?.grad === 100
    const hasLoependeVedtak = loependeVedtak?.harLoependeVedtak === true
    const isKap19 = isFoedtFoer1963(foedselsdato)
    const hasAfpPrivat = loependeVedtak?.afpPrivat !== undefined
    const hasAfpOffentlig = loependeVedtak?.afpOffentlig !== undefined
    const hasAlderspensjon = loependeVedtak?.alderspensjon !== undefined

    // Personer født før 1963 eller apotekere behandles likt for AFP-formål
    const isKap19OrApoteker = isKap19 || erApoteker

    // Prioritet 1: Håndter eksisterende AFP-vedtak
    if (hasAfpOffentlig) {
      return content.harAfpOffentlig_12
    }
    if (hasAfpPrivat) {
      return content.afpPrivatUendret_11
    }

    // Prioritet 2: Håndter spesielle regler for apotekere og personer født før 1963
    if (isKap19OrApoteker) {
      // Offentlig AFP med KUN_ALDERSPENSJON
      if (afpValg === 'ja_offentlig' && afpUtregning === 'KUN_ALDERSPENSJON') {
        return content.afpIkkeSvart_6
      }

      // Manglende afpValg med vedtak om alderspensjon eller uføretrygd
      if (
        afpValg === null &&
        (hasAlderspensjon || hasUfoeregradGreaterThanZero)
      ) {
        return content.afpUforetrygd_9
      }
    }

    // Prioritet 3: Håndter tilfeller med uføretrygd
    if (hasUfoeregradGreaterThanZero) {
      // Tilfelle 3.1: Født før 1963 eller apoteker med manglende AFP-valg
      if (isKap19OrApoteker && (afpValg === null || afpValg === undefined)) {
        return content.afpUforetrygd_9
      }

      // Tilfelle 3.2: Personer som verken er født før 1963 eller er apoteker, med uføretrygd
      if (!isKap19OrApoteker) {
        // Tilfelle 3.2.1: Privat AFP uten AFP-beregning
        if (afpValg === 'ja_privat' && beregningsvalg === 'uten_afp') {
          return content.afpPrivatIkkeBeregnet_5
        }

        // Tilfelle 3.2.2: Offentlig AFP uten AFP-beregning
        if (afpValg === 'ja_offentlig' && beregningsvalg === 'uten_afp') {
          return content.offentligAfpOgUforeKanIkkeBeregnes_3
        }

        // Tilfelle 3.2.3: Ingen AFP-valg med uføretrygd
        if (afpValg === 'nei' || afpValg === null || afpValg === undefined) {
          // Spesialtilfelle for gradert vedtak uten 100% uføregrad
          if (!has100PercentUfoeretrygd && !isKap19 && afpValg === 'nei') {
            return content.afpIkkeSvart_6
          }

          // Spesialtilfeller for løpende ytelser
          if (!isKap19OrApoteker && (hasLoependeVedtak || hasAlderspensjon)) {
            return content.afpUforetrygdNei_10
          }

          return content.afpUforetrygdNei_10
        }

        // Tilfelle 3.2.4: "Vet ikke" med uføretrygd
        if (afpValg === 'vet_ikke') {
          return content.afpVetIkkeUforetrygd_8
        }
      }
    }

    // Prioritet 4: Håndter AFP-valg basert på forskjellige betingelser
    switch (afpValg) {
      case 'ja_offentlig': {
        // Tilfelle 4.1: Født 1963 eller senere (og ikke apoteker) med offentlig AFP
        if (!isKap19OrApoteker) {
          // Uføretrygd uten AFP-beregning
          if (hasUfoeregradGreaterThanZero && beregningsvalg === 'uten_afp') {
            return content.offentligAfpOgUforeKanIkkeBeregnes_3
          }

          // Manglende samtykke til AFP-beregning
          if (samtykkeOffentligAFP === false) {
            return content.offentligIkkeBeregnet_1
          }

          // Samtykket til AFP-beregning
          return content.afpOffentligOppgitt_2
        }

        // Tilfelle 4.2: Født før 1963 eller apoteker med offentlig AFP (isKap19OrApoteker)
        if (afpUtregning === 'KUN_ALDERSPENSJON') {
          return content.afpIkkeSvart_6
        }

        if (hasLoependeVedtak && hasUfoeregradGreaterThanZero) {
          return content.harAfpOffentlig_12
        }

        return content.afpOffentligOppgitt_2
      }

      case 'ja_privat': {
        // Tilfelle 4.3: Privat AFP (standardrespons)
        return content.afpPrivat_4
      }

      case 'nei': {
        // Tilfelle 4.4: Ingen AFP med mulig uføretrygd
        if (hasUfoeregradGreaterThanZero) {
          return content.afpUforetrygdNei_10
        }

        return content.afpIkkeSvart_6
      }

      case 'vet_ikke':
      default: {
        // Tilfelle 4.5: "Vet ikke" med mulig uføretrygd
        if (hasUfoeregradGreaterThanZero) {
          return content.afpVetIkkeUforetrygd_8
        }

        return content.afpVetIkke_7
      }
    }
  }

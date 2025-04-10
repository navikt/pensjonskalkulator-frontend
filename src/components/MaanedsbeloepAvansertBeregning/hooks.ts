import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectFoedselsdato,
} from '@/state/userInput/selectors'
import { transformUttaksalderToDate } from '@/utils/alder'

import {
  hentSumOffentligTjenestepensjonVedUttak,
  hentSumPensjonsavtalerVedUttak,
} from '../Pensjonsavtaler/utils'

export interface Pensjonsdata {
  alder: Alder
  grad: number
  afp?: number
  pensjonsavtale: number
  alderspensjon?: number
}

interface PensjonBeregningerProps {
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  afpOffentligListe?: AfpPrivatPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  pensjonsavtaler?: Pensjonsavtale[]
  simulertTjenestepensjon?: SimulertTjenestepensjon
}

export const usePensjonBeregninger = ({
  alderspensjonMaanedligVedEndring,
  afpPrivatListe,
  afpOffentligListe,
  pensjonsavtaler,
  simulertTjenestepensjon,
}: PensjonBeregningerProps) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )
  const foedselsdato = useAppSelector(selectFoedselsdato)

  // Calculate sum of pension agreements
  const sumPensjonsavtaler = (alder?: Alder): number => {
    if (!pensjonsavtaler || !alder) return 0
    return hentSumPensjonsavtalerVedUttak(pensjonsavtaler, alder)
  }

  // Calculate sum of service pension
  const sumTjenestepensjon = (alder?: Alder): number => {
    if (!simulertTjenestepensjon || !alder) return 0
    return hentSumOffentligTjenestepensjonVedUttak(
      simulertTjenestepensjon,
      alder
    )
  }

  // Find AFP amount at withdrawal
  const afpVedUttak = (
    ordning: 'offentlig' | 'privat',
    alder?: Alder
  ): number | undefined => {
    const liste = ordning === 'offentlig' ? afpOffentligListe : afpPrivatListe
    if (!liste?.length || !alder) return undefined

    return liste.findLast((utbetaling) => alder.aar >= utbetaling.alder)
      ?.maanedligBeloep
  }

  // Calculate sum of all benefits
  const summerYtelser = (data: Pensjonsdata): number => {
    return (
      (data.pensjonsavtale || 0) + (data.afp || 0) + (data.alderspensjon || 0)
    )
  }

  // Gets month and year for withdrawal
  const hentUttaksmaanedOgAar = (uttak: Alder) => {
    const date = transformUttaksalderToDate(uttak, foedselsdato!)
    const [day, month, year] = date.split('.')
    const maaned = new Date(`${year}-${month}-${day}`).toLocaleDateString(
      getSelectedLanguage(),
      {
        month: 'long',
      }
    )
    return {
      maaned,
      aar: year,
    }
  }

  // Prepare pension data for each withdrawal stage
  const getPensionData = (): Pensjonsdata[] => {
    const data: Pensjonsdata[] = []

    if (gradertUttaksperiode) {
      const gradertAlder = gradertUttaksperiode.uttaksalder
      data.push({
        alder: gradertAlder,
        grad: gradertUttaksperiode.grad,
        afp:
          afpVedUttak('offentlig', gradertAlder) ||
          afpVedUttak('privat', gradertAlder),
        pensjonsavtale:
          sumPensjonsavtaler(gradertAlder) + sumTjenestepensjon(gradertAlder),
        alderspensjon:
          alderspensjonMaanedligVedEndring?.gradertUttakMaanedligBeloep,
      })
    }

    if (uttaksalder) {
      data.push({
        alder: uttaksalder,
        grad: 100,
        afp:
          afpVedUttak('offentlig', uttaksalder) ||
          afpVedUttak('privat', uttaksalder),
        pensjonsavtale:
          sumPensjonsavtaler(uttaksalder) + sumTjenestepensjon(uttaksalder),
        alderspensjon:
          alderspensjonMaanedligVedEndring?.heltUttakMaanedligBeloep,
      })
    }

    return data
  }

  return {
    pensjonsdata: getPensionData(),
    summerYtelser,
    hentUttaksmaanedOgAar,
    harGradering: !!gradertUttaksperiode,
    uttaksalder,
  }
}

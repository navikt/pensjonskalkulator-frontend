import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { BeregningContext } from '@/pages/Beregning/context'
import {
  generateTidligstMuligHeltUttakRequestBody,
  generateTidligstMuligGradertUttakRequestBody,
} from '@/state/api/utils'
import { formatUttaksalder, isAlderOverMinUttaksaar } from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

import { FORM_NAMES } from './utils'

export const useFormLocalState = (initialValues: {
  aarligInntektFoerUttakBeloepFraBrukerSkattBeloep: number | undefined
  aarligInntektFoerUttakBeloepFraBrukerInput: number | null
  uttaksalder: Alder | null
  aarligInntektVsaHelPensjon: AarligInntektVsaPensjon | undefined
  gradertUttaksperiode: GradertUttak | null
}) => {
  const {
    aarligInntektFoerUttakBeloepFraBrukerSkattBeloep,
    aarligInntektFoerUttakBeloepFraBrukerInput,
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
  } = initialValues

  const { setHarAvansertSkjemaUnsavedChanges } =
    React.useContext(BeregningContext)

  const [localInntektFremTilUttak, setInntektFremTilUttak] = React.useState<
    number | null
  >(
    aarligInntektFoerUttakBeloepFraBrukerInput
      ? aarligInntektFoerUttakBeloepFraBrukerInput
      : null
  )
  const [localHeltUttak, setHeltUttak] = React.useState<
    RecursivePartial<HeltUttak> | undefined
  >({
    uttaksalder: uttaksalder !== null ? uttaksalder : undefined,
    aarligInntektVsaPensjon: aarligInntektVsaHelPensjon
      ? {
          ...aarligInntektVsaHelPensjon,
          beloep: aarligInntektVsaHelPensjon.beloep,
        }
      : undefined,
  })
  const [localGradertUttak, setGradertUttak] = React.useState<
    | (Omit<RecursivePartial<GradertUttak>, 'aarligInntektVsaPensjonBeloep'> & {
        aarligInntektVsaPensjonBeloep?: string
      })
    | undefined
  >(
    gradertUttaksperiode
      ? {
          ...gradertUttaksperiode,
          aarligInntektVsaPensjonBeloep:
            gradertUttaksperiode.aarligInntektVsaPensjonBeloep
              ? gradertUttaksperiode.aarligInntektVsaPensjonBeloep.toString()
              : undefined,
        }
      : undefined
  )

  React.useEffect(() => {
    const hasInntektFremTilUnntakChanged =
      (aarligInntektFoerUttakBeloepFraBrukerInput !== null &&
        localInntektFremTilUttak !==
          aarligInntektFoerUttakBeloepFraBrukerInput) ||
      (aarligInntektFoerUttakBeloepFraBrukerInput === null &&
        localInntektFremTilUttak !== null &&
        localInntektFremTilUttak !==
          aarligInntektFoerUttakBeloepFraBrukerSkattBeloep)
    const hasGradChanged =
      localGradertUttak?.grad !== gradertUttaksperiode?.grad
    const hasGradertUttaksalderChanged =
      JSON.stringify(localGradertUttak?.uttaksalder) !==
      JSON.stringify(gradertUttaksperiode?.uttaksalder)
    const hasAarligInntektVsaGradertPensjonChanged =
      (localGradertUttak?.aarligInntektVsaPensjonBeloep ?? '') !==
      (gradertUttaksperiode?.aarligInntektVsaPensjonBeloep
        ? gradertUttaksperiode?.aarligInntektVsaPensjonBeloep.toString()
        : '')
    const hasUttaksalderChanged =
      JSON.stringify(localHeltUttak?.uttaksalder) !==
      JSON.stringify(uttaksalder ?? undefined)
    const hasAarligInntektBeloepVsaHelPensjonChanged =
      (localHeltUttak?.aarligInntektVsaPensjon?.beloep ?? 0) !==
      (aarligInntektVsaHelPensjon?.beloep ?? 0)
    const hasAarligInntektSluttAlderVsaHelPensjonChanged =
      JSON.stringify(localHeltUttak?.aarligInntektVsaPensjon?.sluttAlder) !==
      JSON.stringify(aarligInntektVsaHelPensjon?.sluttAlder)

    const updatedHasUnsavedChanges =
      hasInntektFremTilUnntakChanged ||
      hasGradChanged ||
      hasGradertUttaksalderChanged ||
      hasAarligInntektVsaGradertPensjonChanged ||
      hasUttaksalderChanged ||
      hasAarligInntektBeloepVsaHelPensjonChanged ||
      hasAarligInntektSluttAlderVsaHelPensjonChanged

    setHarAvansertSkjemaUnsavedChanges((previous) => {
      return previous !== updatedHasUnsavedChanges
        ? !!updatedHasUnsavedChanges
        : previous
    })
  }, [
    uttaksalder,
    aarligInntektFoerUttakBeloepFraBrukerInput,
    gradertUttaksperiode,
    aarligInntektVsaHelPensjon,
    localInntektFremTilUttak,
    localGradertUttak,
    localHeltUttak,
  ])

  const handlers = React.useMemo(
    () => ({
      setLocalInntektFremTilUttak: setInntektFremTilUttak,
      setLocalHeltUttak: setHeltUttak,
      setLocalGradertUttak: setGradertUttak,
    }),
    []
  )

  return [
    localInntektFremTilUttak,
    localHeltUttak,
    localGradertUttak,
    handlers,
  ] as const
}

export const useTidligstMuligUttakRequestBodyState = (initialValues: {
  afp: AfpRadio | null
  sivilstand: Sivilstand | undefined
  harSamboer: boolean | null
  aarligInntektFoerUttakBeloep: number | null | undefined
  localInntektFremTilUttak: number | null
  localGradertUttak?: Omit<
    RecursivePartial<GradertUttak>,
    'aarligInntektVsaPensjonBeloep'
  > & {
    aarligInntektVsaPensjonBeloep?: string
  }
  localHeltUttak?: RecursivePartial<HeltUttak>
}) => {
  const {
    afp,
    sivilstand,
    harSamboer,
    aarligInntektFoerUttakBeloep,
    localInntektFremTilUttak,
    localGradertUttak,
    localHeltUttak,
  } = initialValues

  const [
    tidligstMuligHeltUttakRequestBody,
    setTidligstMuligHeltUttakRequestBody,
  ] = React.useState<TidligstMuligHeltUttakRequestBody | undefined>(undefined)

  const [
    tidligstMuligGradertUttakRequestBody,
    setTidligstMuligGradertUttakRequestBody,
  ] = React.useState<TidligstMuligGradertUttakRequestBody | undefined>(
    undefined
  )

  React.useEffect(() => {
    const oppdatertHeltUttakRequestBody =
      generateTidligstMuligHeltUttakRequestBody({
        afp,
        sivilstand: sivilstand,
        harSamboer,
        aarligInntektFoerUttakBeloep:
          localInntektFremTilUttak !== null
            ? localInntektFremTilUttak
            : aarligInntektFoerUttakBeloep ?? 0,
      })

    if (oppdatertHeltUttakRequestBody !== undefined) {
      setTidligstMuligHeltUttakRequestBody(oppdatertHeltUttakRequestBody)
    }

    if (localGradertUttak?.grad) {
      setTidligstMuligGradertUttakRequestBody(
        generateTidligstMuligGradertUttakRequestBody({
          afp,
          sivilstand: sivilstand,
          harSamboer,
          aarligInntektFoerUttakBeloep:
            localInntektFremTilUttak !== null
              ? localInntektFremTilUttak
              : aarligInntektFoerUttakBeloep ?? 0,
          heltUttak: {
            uttaksalder:
              localHeltUttak?.uttaksalder?.aar &&
              localHeltUttak?.uttaksalder?.maaneder !== undefined
                ? (localHeltUttak?.uttaksalder as Alder)
                : { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon:
              localHeltUttak?.aarligInntektVsaPensjon?.beloep &&
              localHeltUttak?.aarligInntektVsaPensjon?.sluttAlder
                ? {
                    beloep: localHeltUttak?.aarligInntektVsaPensjon?.beloep,

                    sluttAlder: {
                      ...(localHeltUttak?.aarligInntektVsaPensjon
                        ?.sluttAlder as Alder),
                    },
                  }
                : undefined,
          },
          gradertUttak: {
            grad: localGradertUttak?.grad,
            aarligInntektVsaPensjonBeloep:
              localGradertUttak.aarligInntektVsaPensjonBeloep
                ? parseInt(
                    localGradertUttak.aarligInntektVsaPensjonBeloep as string,
                    10
                  )
                : undefined,
          },
        })
      )
    }
  }, [
    afp,
    sivilstand,
    aarligInntektFoerUttakBeloep,
    harSamboer,
    localInntektFremTilUttak,
    localGradertUttak,
    localHeltUttak,
  ])

  const handlers = React.useMemo(
    () => ({
      setTidligstMuligHeltUttakRequestBody:
        setTidligstMuligHeltUttakRequestBody,
      setTidligstMuligGradertUttakRequestBody:
        setTidligstMuligGradertUttakRequestBody,
    }),
    []
  )

  return [
    tidligstMuligHeltUttakRequestBody,
    tidligstMuligGradertUttakRequestBody,
    handlers,
  ] as const
}

export const useFormValidationErrors = (initialValues: {
  grad?: number
  tidligstMuligHeltUttak?: Alder
  tidligstMuligGradertUttak?: Alder
}) => {
  const { grad, tidligstMuligHeltUttak, tidligstMuligGradertUttak } =
    initialValues
  const intl = useIntl()

  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({
    [FORM_NAMES.uttaksalderHeltUttak]: '',
    [FORM_NAMES.uttaksalderGradertUttak]: '',
    [FORM_NAMES.inntektVsaGradertUttak]: '',
  })

  const gradertUttakAgePickerError = React.useMemo(() => {
    return validationErrors[FORM_NAMES.uttaksalderGradertUttak] ? (
      <>
        {intl.formatMessage({
          id: validationErrors[FORM_NAMES.uttaksalderGradertUttak],
        })}{' '}
        <FormattedMessage
          id="beregning.avansert.rediger.agepicker.validation_error"
          values={{ ...getFormatMessageValues(intl), grad: grad }}
        />
      </>
    ) : (
      ''
    )
  }, [validationErrors, initialValues])

  const heltUttakAgePickerError = React.useMemo(() => {
    return validationErrors[FORM_NAMES.uttaksalderHeltUttak] ? (
      <>
        {intl.formatMessage({
          id: validationErrors[FORM_NAMES.uttaksalderHeltUttak],
        })}{' '}
        <FormattedMessage
          id="beregning.avansert.rediger.agepicker.validation_error"
          values={{ ...getFormatMessageValues(intl), grad: 100 }}
        />
      </>
    ) : (
      ''
    )
  }, [validationErrors, initialValues])

  const gradertUttakAgePickerBeskrivelse = React.useMemo(() => {
    return tidligstMuligGradertUttak &&
      tidligstMuligHeltUttak &&
      isAlderOverMinUttaksaar(tidligstMuligHeltUttak) ? (
      <>
        <FormattedMessage
          id="beregning.avansert.rediger.agepicker.beskrivelse"
          values={{ ...getFormatMessageValues(intl), grad: grad }}
        />
        {` ${formatUttaksalder(intl, tidligstMuligGradertUttak)}.`}
      </>
    ) : (
      ''
    )
  }, [tidligstMuligGradertUttak, tidligstMuligHeltUttak, grad])

  const heltUttakAgePickerBeskrivelse = React.useMemo(() => {
    if (tidligstMuligHeltUttak) {
      if (grad === undefined || grad === 100) {
        return (
          <>
            <FormattedMessage
              id="beregning.avansert.rediger.agepicker.beskrivelse"
              values={{ ...getFormatMessageValues(intl), grad: 100 }}
            />
            {` ${formatUttaksalder(intl, tidligstMuligHeltUttak)}.`}
          </>
        )
      } else {
        if (isAlderOverMinUttaksaar(tidligstMuligHeltUttak)) {
          return (
            <FormattedMessage
              id="beregning.avansert.rediger.agepicker.tmu_info"
              values={{ ...getFormatMessageValues(intl) }}
            />
          )
        } else {
          return ''
        }
      }
    } else {
      return ''
    }
  }, [tidligstMuligHeltUttak, grad])

  const handlers = React.useMemo(
    () => ({
      setValidationErrors: setValidationErrors,
      setValidationErrorUttaksalderHeltUttak: (s: string) => {
        setValidationErrors((prevState) => {
          return {
            ...prevState,
            [FORM_NAMES.uttaksalderHeltUttak]: s,
          }
        })
      },
      setValidationErrorUttaksalderGradertUttak: (s: string) => {
        setValidationErrors((prevState) => {
          return {
            ...prevState,
            [FORM_NAMES.uttaksalderGradertUttak]: s,
          }
        })
      },
      setValidationErrorInntektVsaGradertUttak: (s: string) => {
        setValidationErrors((prevState) => {
          return {
            ...prevState,
            [FORM_NAMES.inntektVsaGradertUttak]: s,
          }
        })
      },
      resetValidationErrors: () => {
        setValidationErrors(() => {
          return {
            [FORM_NAMES.uttaksalderHeltUttak]: '',
            [FORM_NAMES.uttaksalderGradertUttak]: '',
            [FORM_NAMES.inntektVsaGradertUttak]: '',
          }
        })
      },
    }),
    []
  )

  return [
    validationErrors,
    gradertUttakAgePickerError,
    heltUttakAgePickerError,
    gradertUttakAgePickerBeskrivelse,
    heltUttakAgePickerBeskrivelse,

    handlers,
  ] as const
}

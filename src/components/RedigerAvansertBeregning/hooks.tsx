import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { BeregningContext } from '@/pages/Beregning/context'
import { getFormatMessageValues } from '@/utils/translations'

import { FORM_NAMES } from './utils'

export const useFormLocalState = (initialValues: {
  aarligInntektFoerUttakBeloepFraBrukerSkattBeloep: string | undefined
  aarligInntektFoerUttakBeloepFraBrukerInput: string | null
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

  const [localHarInntektVsaHeltUttakRadio, setHarInntektVsaHeltUttakRadio] =
    React.useState<boolean | null>(
      !uttaksalder ? null : aarligInntektVsaHelPensjon ? true : false
    )

  const [
    localHarInntektVsaGradertUttakRadio,
    setHarInntektVsaGradertUttakRadio,
  ] = React.useState<boolean | null>(
    !uttaksalder || !gradertUttaksperiode?.uttaksalder
      ? null
      : gradertUttaksperiode?.aarligInntektVsaPensjonBeloep
        ? true
        : false
  )

  const [localInntektFremTilUttak, setInntektFremTilUttak] = React.useState<
    string | null
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
    RecursivePartial<GradertUttak> | undefined
  >({
    grad: gradertUttaksperiode?.grad
      ? gradertUttaksperiode.grad
      : uttaksalder
        ? 100
        : undefined,
    uttaksalder: gradertUttaksperiode?.uttaksalder
      ? {
          ...gradertUttaksperiode.uttaksalder,
        }
      : undefined,
    aarligInntektVsaPensjonBeloep:
      gradertUttaksperiode?.aarligInntektVsaPensjonBeloep
        ? gradertUttaksperiode.aarligInntektVsaPensjonBeloep.toString()
        : undefined,
  })

  const minAlderInntektSluttAlder = React.useMemo(
    () =>
      localHeltUttak?.uttaksalder?.aar
        ? {
            aar:
              localHeltUttak?.uttaksalder?.maaneder === 11
                ? localHeltUttak?.uttaksalder?.aar + 1
                : localHeltUttak?.uttaksalder?.aar,
            maaneder:
              localHeltUttak?.uttaksalder?.maaneder !== undefined &&
              localHeltUttak?.uttaksalder?.maaneder !== 11
                ? localHeltUttak?.uttaksalder?.maaneder + 1
                : 0,
          }
        : undefined,
    [localHeltUttak]
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
      setLocalHarInntektVsaHeltUttakRadio: setHarInntektVsaHeltUttakRadio,
      setLocalHarInntektVsaGradertUttakRadio: setHarInntektVsaGradertUttakRadio,
    }),
    []
  )

  return [
    localInntektFremTilUttak,
    localHeltUttak,
    localHarInntektVsaHeltUttakRadio,
    localGradertUttak,
    localHarInntektVsaGradertUttakRadio,
    minAlderInntektSluttAlder,
    handlers,
  ] as const
}

export const useFormValidationErrors = (initialValues: { grad?: number }) => {
  const intl = useIntl()

  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({
    [FORM_NAMES.uttaksalderHeltUttak]: '',
    [FORM_NAMES.uttaksalderGradertUttak]: '',
    [FORM_NAMES.inntektVsaGradertUttak]: '',
  })

  React.useEffect(() => {
    const ariaInvalidElements = document.querySelectorAll(
      'input[aria-invalid]:not([aria-invalid="false"]), select[aria-invalid]:not([aria-invalid="false"])'
    )

    if (
      document.activeElement?.tagName === 'BUTTON' &&
      ariaInvalidElements.length > 0
    ) {
      ;(ariaInvalidElements[0] as HTMLElement).focus()
      ;(ariaInvalidElements[0] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [validationErrors])

  const gradertUttakAgePickerError = React.useMemo(() => {
    return validationErrors[FORM_NAMES.uttaksalderGradertUttak] ? (
      <>
        {intl.formatMessage(
          {
            id: validationErrors[FORM_NAMES.uttaksalderGradertUttak],
          },
          { ...getFormatMessageValues(intl) }
        )}{' '}
        <FormattedMessage
          id="beregning.avansert.rediger.agepicker.validation_error"
          values={{
            ...getFormatMessageValues(intl),
            grad: initialValues.grad,
          }}
        />
      </>
    ) : (
      ''
    )
  }, [validationErrors, initialValues])

  const heltUttakAgePickerError = React.useMemo(() => {
    return validationErrors[FORM_NAMES.uttaksalderHeltUttak] ? (
      <>
        {intl.formatMessage(
          {
            id: validationErrors[FORM_NAMES.uttaksalderHeltUttak],
          },
          { ...getFormatMessageValues(intl) }
        )}{' '}
        {(validationErrors[FORM_NAMES.uttaksalderHeltUttak] ===
          'agepicker.validation_error.aar' ||
          validationErrors[FORM_NAMES.uttaksalderHeltUttak] ===
            'agepicker.validation_error.maaneder') && (
          <FormattedMessage
            id="beregning.avansert.rediger.agepicker.validation_error"
            values={{ ...getFormatMessageValues(intl), grad: 100 }}
          />
        )}
      </>
    ) : (
      ''
    )
  }, [validationErrors, initialValues])

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
      setValidationErrorInntektVsaHeltUttak: (s: string) => {
        setValidationErrors((prevState) => {
          return {
            ...prevState,
            [FORM_NAMES.inntektVsaHeltUttak]: s,
          }
        })
      },
      setValidationErrorInntektVsaHeltUttakSluttAlder: (s: string) => {
        setValidationErrors((prevState) => {
          return {
            ...prevState,
            [FORM_NAMES.inntektVsaHeltUttakSluttAlder]: s,
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
    handlers,
  ] as const
}

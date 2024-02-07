import React from 'react'

import {
  generateTidligstMuligHeltUttakRequestBody,
  generateTidligstMuligGradertUttakRequestBody,
} from '@/state/api/utils'

export const useFormLocalState = (initialValues: {
  aarligInntektFoerUttakBeloepFraBrukerInput: number | null
  uttaksalder: Alder | null
  aarligInntektVsaHelPensjon: AarligInntektVsaPensjon | undefined
  gradertUttaksperiode: GradertUttak | null
}) => {
  const {
    aarligInntektFoerUttakBeloepFraBrukerInput,
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
  } = initialValues

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
      ? aarligInntektVsaHelPensjon
      : undefined,
  })
  const [localGradertUttak, setGradertUttak] = React.useState<
    RecursivePartial<GradertUttak> | undefined
  >(gradertUttaksperiode ?? undefined)

  const [isFormUnderUpdate, setIsFormUnderUpdate] = React.useState<
    boolean | null
  >(false)

  React.useEffect(() => {
    const updatedIsFormUnderUpdate =
      uttaksalder &&
      ((aarligInntektFoerUttakBeloepFraBrukerInput !== null &&
        localInntektFremTilUttak !==
          aarligInntektFoerUttakBeloepFraBrukerInput) ||
        (aarligInntektFoerUttakBeloepFraBrukerInput === null &&
          localInntektFremTilUttak !== null) ||
        localGradertUttak?.grad !== gradertUttaksperiode?.grad ||
        JSON.stringify(localGradertUttak?.uttaksalder) !==
          JSON.stringify(gradertUttaksperiode?.uttaksalder) ||
        localGradertUttak?.aarligInntektVsaPensjonBeloep !==
          gradertUttaksperiode?.aarligInntektVsaPensjonBeloep ||
        JSON.stringify(localHeltUttak?.uttaksalder) !==
          JSON.stringify(uttaksalder) ||
        localHeltUttak?.aarligInntektVsaPensjon?.beloep !==
          aarligInntektVsaHelPensjon?.beloep ||
        JSON.stringify(localHeltUttak?.aarligInntektVsaPensjon?.sluttAlder) !==
          JSON.stringify(aarligInntektVsaHelPensjon?.sluttAlder))

    setIsFormUnderUpdate((previous) => {
      return previous !== updatedIsFormUnderUpdate
        ? updatedIsFormUnderUpdate
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
    isFormUnderUpdate,
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
  localGradertUttak: RecursivePartial<GradertUttak> | undefined
  localHeltUttak: RecursivePartial<HeltUttak> | undefined
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
                ? (localHeltUttak?.aarligInntektVsaPensjon as AarligInntektVsaPensjon)
                : undefined,
          },
          gradertUttak: {
            grad: localGradertUttak?.grad,
            aarligInntektVsaPensjonBeloep:
              localGradertUttak.aarligInntektVsaPensjonBeloep,
          },
        })
      )
    }
  }, [
    afp,
    sivilstand,
    aarligInntektFoerUttakBeloep,
    harSamboer,
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

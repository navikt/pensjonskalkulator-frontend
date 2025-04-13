import clsx from 'clsx'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Alert, Radio, RadioGroup, TextField } from '@navikt/ds-react'

import { VilkaarsproevingAlert } from '@/components/VilkaarsproevingAlert'
import { AgePicker } from '@/components/common/AgePicker'
import { Divider } from '@/components/common/Divider'
import { BeregningContext } from '@/pages/Beregning/context'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloep,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAfpInntektMaanedFoerUttak,
  selectCurrentSimulation,
  selectFoedselsdato,
  selectIsEndring,
  selectLoependeVedtak,
  selectNedreAldersgrense,
  selectNormertPensjonsalder,
} from '@/state/userInput/selectors'
import { getBrukerensAlderISluttenAvMaaneden } from '@/utils/alder'
import { updateAndFormatInntektFromInputField } from '@/utils/inntekt'
import { getFormatMessageValues } from '@/utils/translations'

import {
  AvansertSkjemaInntekt,
  AvansertSkjemaIntroEndring,
  FormButtonRow,
} from '../Felles'
import { useFormLocalState, useFormValidationErrors } from '../hooks'
import { AVANSERT_FORM_NAMES, onAvansertBeregningSubmit } from '../utils'

import styles from './AvansertSkjemaForBrukereMedKap19Afp.module.scss'

export const AvansertSkjemaForBrukereMedKap19Afp: React.FC<{
  vilkaarsproeving?: Vilkaarsproeving
}> = ({ vilkaarsproeving }) => {
  const intl = useIntl()
  const dispatch = useAppDispatch()

  const { setAvansertSkjemaModus } = React.useContext(BeregningContext)

  const foedselsdato = useAppSelector(selectFoedselsdato)
  const normertPensjonsalder = useAppSelector(selectNormertPensjonsalder)
  const isEndring = useAppSelector(selectIsEndring)
  const inntektVsaGradertUttakInputRef = React.useRef<HTMLInputElement>(null)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const nedreAldersgrense = useAppSelector(selectNedreAldersgrense)
  const { uttaksalder, gradertUttaksperiode, aarligInntektVsaHelPensjon } =
    useAppSelector(selectCurrentSimulation)
  const aarligInntektFoerUttakBeloepFraBrukerInput = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraBrukerInput
  )
  const aarligInntektFoerUttakBeloepFraBrukerSkatt = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraSkatt
  )
  const aarligInntektFoerUttakBeloep = useAppSelector(
    selectAarligInntektFoerUttakBeloep
  )
  const afpInntektMaanedFoerUttak = useAppSelector(
    selectAfpInntektMaanedFoerUttak
  )
  const { harAvansertSkjemaUnsavedChanges } = React.useContext(BeregningContext)

  const gaaTilResultat = () => {
    setAvansertSkjemaModus('resultat')
    window.scrollTo(0, 0)
  }

  const agePickerMinAlder = loependeVedtak.ufoeretrygd.grad
    ? normertPensjonsalder
    : getBrukerensAlderISluttenAvMaaneden(foedselsdato, nedreAldersgrense)

  const {
    localInntektFremTilUttak,
    localHeltUttak,
    localGradertUttak,
    localHarInntektVsaGradertUttakRadio,
    localHarAfpInntektMaanedFoerUttakRadio,
    handlers: {
      setLocalInntektFremTilUttak,
      setLocalHeltUttak,
      setLocalGradertUttak,
      setLocalHarInntektVsaHeltUttakRadio,
      setLocalHarInntektVsaGradertUttakRadio,
      setLocalHarAfpInntektMaanedFoerUttakRadio,
    },
  } = useFormLocalState({
    isEndring,
    ufoeregrad: loependeVedtak.ufoeretrygd.grad,
    aarligInntektFoerUttakBeloepFraBrukerSkattBeloep:
      aarligInntektFoerUttakBeloepFraBrukerSkatt?.beloep,
    aarligInntektFoerUttakBeloepFraBrukerInput,
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
    normertPensjonsalder,
    afpInntektMaanedFoerUttak,
    beregningsvalg: null,
  })

  const {
    validationErrors,
    heltUttakAgePickerError,
    handlers: {
      setValidationErrors,
      setValidationErrorUttaksalderHeltUttak,
      setValidationErrorInntektVsaAfp,
      resetValidationErrors,
    },
  } = useFormValidationErrors({
    grad: localGradertUttak?.grad,
    afp: true,
  })

  const handleHeltUttaksalderChange = (alder: Partial<Alder> | undefined) => {
    setValidationErrorUttaksalderHeltUttak('')
    setLocalHeltUttak((prevState) => {
      const sluttAlderAntallMaaneder =
        prevState?.aarligInntektVsaPensjon?.sluttAlder?.aar !== undefined
          ? prevState?.aarligInntektVsaPensjon?.sluttAlder.aar * 12 +
            (prevState?.aarligInntektVsaPensjon?.sluttAlder.maaneder ?? 0)
          : 0
      const shouldDeleteInntektVsaPensjon =
        alder?.aar &&
        alder?.aar * 12 + (alder?.maaneder ?? 0) >= sluttAlderAntallMaaneder
      return {
        ...prevState,
        uttaksalder: alder,
        aarligInntektVsaPensjon:
          shouldDeleteInntektVsaPensjon || !prevState?.aarligInntektVsaPensjon
            ? undefined
            : { ...prevState?.aarligInntektVsaPensjon },
      }
    })
  }

  const handleInntektVsaGradertUttakRadioChange = (s: BooleanRadio) => {
    setLocalHarInntektVsaGradertUttakRadio(s === 'ja')
    setValidationErrors({
      [AVANSERT_FORM_NAMES.inntektVsaAfpRadio]: '',
      [AVANSERT_FORM_NAMES.inntektVsaAfp]: '',
    })
    if (s === 'nei') {
      setLocalGradertUttak((previous) => {
        return {
          ...previous,
          grad: 100,
          aarligInntektVsaPensjonBeloep: undefined,
        }
      })
    }
  }

  const handleInntektVsaGradertUttakChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    updateAndFormatInntektFromInputField(
      inntektVsaGradertUttakInputRef.current,
      e.target.value,
      (s: string) => {
        setLocalGradertUttak((previous) => ({
          ...previous,
          aarligInntektVsaPensjonBeloep: s || undefined,
        }))
      },
      setValidationErrorInntektVsaAfp
    )
  }

  const handleAfpInntektMaanedFoerUttakRadioChange = (s: BooleanRadio) => {
    setLocalHarAfpInntektMaanedFoerUttakRadio?.(s === 'ja')
    setValidationErrors({
      [AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio]: '',
    })
  }

  const resetForm = (): void => {
    resetValidationErrors()
    setLocalInntektFremTilUttak(
      aarligInntektFoerUttakBeloepFraBrukerSkatt?.beloep ?? null
    )
    setLocalGradertUttak(undefined)
    setLocalHeltUttak(undefined)
    setLocalHarInntektVsaGradertUttakRadio(null)
    setLocalHarInntektVsaHeltUttakRadio(null)
    setLocalHarAfpInntektMaanedFoerUttakRadio?.(null)
  }

  return (
    <>
      <form
        id={AVANSERT_FORM_NAMES.form}
        data-testid="AVANSERT_SKJEMA_FOR_BRUKERE"
        method="dialog"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          onAvansertBeregningSubmit(
            data,
            dispatch,
            setValidationErrors,
            gaaTilResultat,
            {
              foedselsdato: foedselsdato as string,
              normertPensjonsalder,
              loependeVedtak,
              localInntektFremTilUttak,
              hasVilkaarIkkeOppfylt:
                vilkaarsproeving?.vilkaarErOppfylt === false,
              harAvansertSkjemaUnsavedChanges,
            },
            true
          )
        }}
      />

      <div
        className={clsx(styles.container, styles.container__hasMobilePadding)}
      >
        <div className={styles.form}>
          {isEndring && <AvansertSkjemaIntroEndring />}

          <AvansertSkjemaInntekt
            localInntektFremTilUttak={localInntektFremTilUttak}
            aarligInntektFoerUttakBeloep={aarligInntektFoerUttakBeloep}
            setLocalInntektFremTilUttak={setLocalInntektFremTilUttak}
          />

          <Divider noMargin />

          <div className={styles.alertWrapper} aria-live="polite">
            {validationErrors[
              AVANSERT_FORM_NAMES.endringAlertFremtidigDato
            ] && (
              <Alert variant="warning">
                <FormattedMessage
                  id="beregning.endring.alert.uttaksdato"
                  values={{
                    ...getFormatMessageValues(),
                    dato: validationErrors[
                      AVANSERT_FORM_NAMES.endringAlertFremtidigDato
                    ],
                  }}
                />
              </Alert>
            )}
          </div>

          <div className={styles.alertWrapper} aria-live="polite">
            {vilkaarsproeving &&
              !vilkaarsproeving?.vilkaarErOppfylt &&
              uttaksalder && (
                <VilkaarsproevingAlert
                  alternativ={vilkaarsproeving?.alternativ}
                  uttaksalder={uttaksalder}
                />
              )}
          </div>

          <div>
            {/* HER: Når vil du ta ut AFP */}
            <AgePicker
              form={AVANSERT_FORM_NAMES.form}
              name={AVANSERT_FORM_NAMES.uttaksalderHeltUttak}
              label={
                <FormattedMessage
                  id={
                    isEndring
                      ? 'velguttaksalder.endring.title'
                      : 'velguttaksalder.title'
                  }
                />
              }
              value={localHeltUttak?.uttaksalder}
              onChange={handleHeltUttaksalderChange}
              error={heltUttakAgePickerError}
              minAlder={agePickerMinAlder}
            />
          </div>
          {/* HER: Forventer du å ha inntekt på minst 21 924 kr før skatt den siste måneden før du tar ut AFP? */}
          <div>
            <RadioGroup
              legend={
                <FormattedMessage
                  id="beregning.avansert.rediger.radio.afp_inntekt_maaned_foer_uttak"
                  values={{
                    ...getFormatMessageValues(),
                    afpInntektMaanedFoerUttak: '1G/12',
                  }}
                />
              }
              description={
                <FormattedMessage id="beregning.avansert.rediger.radio.afp_inntekt_maaned_foer_uttak.description" />
              }
              name={AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}
              data-testid={AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}
              value={
                localHarAfpInntektMaanedFoerUttakRadio === null
                  ? null
                  : localHarAfpInntektMaanedFoerUttakRadio
                    ? 'ja'
                    : 'nei'
              }
              onChange={handleAfpInntektMaanedFoerUttakRadioChange}
              error={
                validationErrors[
                  AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio
                ]
                  ? intl.formatMessage({
                      id: validationErrors[
                        AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio
                      ],
                    })
                  : ''
              }
              role="radiogroup"
              aria-required="true"
            >
              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-ja`}
                value="ja"
                aria-invalid={
                  !!validationErrors[
                    AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio
                  ]
                }
              >
                <FormattedMessage id="stegvisning.radio_ja" />
              </Radio>

              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio}-nei`}
                value="nei"
              >
                <FormattedMessage id="stegvisning.radio_nei" />
              </Radio>
            </RadioGroup>
          </div>
          {/* HER: Forventer du å ha inntekt samtidig som du tar ut AFP? */}
          <div>
            <RadioGroup
              legend={
                <FormattedMessage
                  id="beregning.avansert.rediger.radio.inntekt_vsa_afp"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
              }
              description={
                <FormattedMessage id="beregning.avansert.rediger.radio.inntekt_vsa_afp.description" />
              }
              name={AVANSERT_FORM_NAMES.inntektVsaAfpRadio}
              data-testid={AVANSERT_FORM_NAMES.inntektVsaAfpRadio}
              value={
                localHarInntektVsaGradertUttakRadio === null
                  ? null
                  : localHarInntektVsaGradertUttakRadio
                    ? 'ja'
                    : 'nei'
              }
              onChange={handleInntektVsaGradertUttakRadioChange}
              error={
                validationErrors[AVANSERT_FORM_NAMES.inntektVsaAfpRadio]
                  ? intl.formatMessage({
                      id: validationErrors[
                        AVANSERT_FORM_NAMES.inntektVsaAfpRadio
                      ],
                    })
                  : ''
              }
              role="radiogroup"
              aria-required="true"
            >
              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-ja`}
                value="ja"
                aria-invalid={
                  !!validationErrors[AVANSERT_FORM_NAMES.inntektVsaAfpRadio]
                }
              >
                <FormattedMessage id="stegvisning.radio_ja" />
              </Radio>

              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.inntektVsaAfpRadio}-nei`}
                value="nei"
              >
                <FormattedMessage id="stegvisning.radio_nei" />
              </Radio>
            </RadioGroup>
          </div>
          {/* HER: Hva er din forventede årsinntekt samtidig som du tar ut AFP? */}
          {localHarInntektVsaGradertUttakRadio && (
            <TextField
              ref={inntektVsaGradertUttakInputRef}
              form={AVANSERT_FORM_NAMES.form}
              name={AVANSERT_FORM_NAMES.inntektVsaAfp}
              data-testid={AVANSERT_FORM_NAMES.inntektVsaAfp}
              type="text"
              inputMode="numeric"
              className={styles.textfield}
              label={
                <FormattedMessage
                  id="inntekt.endre_inntekt_vsa_afp_modal.textfield.label"
                  values={getFormatMessageValues()}
                />
              }
              description={intl.formatMessage({
                id: 'inntekt.endre_inntekt_vsa_pensjon_modal.textfield.description',
              })}
              error={
                validationErrors[AVANSERT_FORM_NAMES.inntektVsaAfp]
                  ? intl.formatMessage(
                      {
                        id: validationErrors[AVANSERT_FORM_NAMES.inntektVsaAfp],
                      },
                      { ...getFormatMessageValues() }
                    )
                  : undefined
              }
              onChange={handleInntektVsaGradertUttakChange}
              value={localGradertUttak?.aarligInntektVsaPensjonBeloep}
              aria-required="true"
            />
          )}

          <FormButtonRow
            formId={AVANSERT_FORM_NAMES.form}
            resetForm={resetForm}
            gaaTilResultat={gaaTilResultat}
            hasVilkaarIkkeOppfylt={vilkaarsproeving?.vilkaarErOppfylt === false}
          />
        </div>
      </div>
    </>
  )
}

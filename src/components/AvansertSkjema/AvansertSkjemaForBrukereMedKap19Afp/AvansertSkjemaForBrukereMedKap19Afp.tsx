import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import {
  Alert,
  BodyLong,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@navikt/ds-react'
import clsx from 'clsx'

import {
  AvansertSkjemaIntroEndring,
  AvansertSkjemaInntekt,
  FormButtonRow,
  ReadMoreOmPensjonsalder,
} from '../Felles'
import { useFormLocalState, useFormValidationErrors } from '../hooks'
import { AVANSERT_FORM_NAMES, onAvansertBeregningSubmit } from '../utils'
import { AgePicker } from '@/components/common/AgePicker'
import { Divider } from '@/components/common/Divider'
import { ReadMore } from '@/components/common/ReadMore'
import { VilkaarsproevingAlert } from '@/components/VilkaarsproevingAlert'
import { BeregningContext } from '@/pages/Beregning/context'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectFoedselsdato,
  selectLoependeVedtak,
  selectCurrentSimulation,
  selectIsEndring,
  selectAarligInntektFoerUttakBeloep,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
  selectNedreAldersgrense,
  selectNormertPensjonsalder,
  selectAfpInntektMaanedFoerUttak,
} from '@/state/userInput/selectors'
import {
  DEFAULT_MAX_OPPTJENINGSALDER,
  formatUttaksalder,
  getBrukerensAlderISluttenAvMaaneden,
} from '@/utils/alder'
import { updateAndFormatInntektFromInputField } from '@/utils/inntekt'
import { getFormatMessageValues } from '@/utils/translations'

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
  const inntektVsaHeltUttakInputRef = React.useRef<HTMLInputElement>(null)
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
  const formatertNormertPensjonsalder = formatUttaksalder(
    intl,
    normertPensjonsalder
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
    localHarInntektVsaHeltUttakRadio,
    localGradertUttak,
    localHarInntektVsaGradertUttakRadio,
    localHarAfpInntektMaanedFoerUttakRadio,
    minAlderInntektSluttAlder,
    muligeUttaksgrad,
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

  const [
    validationErrors,
    gradertUttakAgePickerError,
    heltUttakAgePickerError,
    {
      setValidationErrors,
      setValidationErrorUttaksalderHeltUttak,
      setValidationErrorInntektVsaHeltUttak,
      setValidationErrorInntektVsaHeltUttakSluttAlder,
      setValidationErrorInntektVsaGradertUttak,
      resetValidationErrors,
    },
  ] = useFormValidationErrors({
    grad: localGradertUttak?.grad,
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
      [AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio]: '',
      [AVANSERT_FORM_NAMES.inntektVsaGradertUttak]: '',
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
      setValidationErrorInntektVsaGradertUttak
    )
  }

  const handleAfpInntektMaanedFoerUttakRadioChange = (s: BooleanRadio) => {
    setLocalHarAfpInntektMaanedFoerUttakRadio?.(s === 'ja')
    setValidationErrors({
      [AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio]: '',
    })
  }

  const handleInntektVsaHeltUttakChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    updateAndFormatInntektFromInputField(
      inntektVsaHeltUttakInputRef.current,
      e.target.value,
      (s: string) => {
        setLocalHeltUttak((previous) => ({
          ...previous,
          aarligInntektVsaPensjon: {
            ...previous?.aarligInntektVsaPensjon,
            beloep: s || undefined,
          },
        }))
      },
      setValidationErrorInntektVsaHeltUttak
    )
  }

  const handleInntektVsaHeltUttakSluttAlderChange = (
    alder: Partial<Alder> | undefined
  ) => {
    setValidationErrorInntektVsaHeltUttakSluttAlder('')
    setLocalHeltUttak((previous) => ({
      ...previous,
      aarligInntektVsaPensjon: {
        ...previous?.aarligInntektVsaPensjon,
        sluttAlder: alder,
      },
    }))
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
              localBeregningsTypeRadio: null,
              localInntektFremTilUttak,
              hasVilkaarIkkeOppfylt:
                vilkaarsproeving?.vilkaarErOppfylt === false,
              harAvansertSkjemaUnsavedChanges,
            }
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
                  vilkaarsproeving={vilkaarsproeving}
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
                  ? intl.formatMessage(
                      {
                        id: validationErrors[
                          AVANSERT_FORM_NAMES.afpInntektMaanedFoerUttakRadio
                        ],
                      },
                      { ...getFormatMessageValues() }
                    )
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
              name={AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}
              data-testid={AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}
              value={
                localHarInntektVsaGradertUttakRadio === null
                  ? null
                  : localHarInntektVsaGradertUttakRadio
                    ? 'ja'
                    : 'nei'
              }
              onChange={handleInntektVsaGradertUttakRadioChange}
              error={
                validationErrors[
                  AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio
                ]
                  ? intl.formatMessage({
                      id: validationErrors[
                        AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio
                      ],
                    })
                  : ''
              }
              role="radiogroup"
              aria-required="true"
            >
              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-ja`}
                value="ja"
                aria-invalid={
                  !!validationErrors[
                    AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio
                  ]
                }
              >
                <FormattedMessage id="stegvisning.radio_ja" />
              </Radio>

              <Radio
                form={AVANSERT_FORM_NAMES.form}
                data-testid={`${AVANSERT_FORM_NAMES.inntektVsaGradertUttakRadio}-nei`}
                value="nei"
              >
                <FormattedMessage id="stegvisning.radio_nei" />
              </Radio>
            </RadioGroup>
          </div>
          {/* HER: Hva er din forventede årsinntekt samtidig som du tar ut AFP? */}
          {localHarInntektVsaGradertUttakRadio && (
            <TextField
              ref={inntektVsaHeltUttakInputRef}
              form={AVANSERT_FORM_NAMES.form}
              name={AVANSERT_FORM_NAMES.inntektVsaGradertUttak}
              data-testid={AVANSERT_FORM_NAMES.inntektVsaGradertUttak}
              type="text"
              inputMode="numeric"
              className={styles.textfield}
              label={
                <FormattedMessage
                  id="inntekt.endre_inntekt_vsa_pensjon_modal.textfield.label"
                  values={getFormatMessageValues()}
                />
              }
              description={intl.formatMessage({
                id: 'inntekt.endre_inntekt_vsa_pensjon_modal.textfield.description',
              })}
              error={
                validationErrors[AVANSERT_FORM_NAMES.inntektVsaHeltUttak]
                  ? intl.formatMessage(
                      {
                        id: validationErrors[
                          AVANSERT_FORM_NAMES.inntektVsaHeltUttak
                        ],
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

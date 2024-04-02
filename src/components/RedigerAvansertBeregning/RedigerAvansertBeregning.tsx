import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { BodyLong, Label, Select, TextField } from '@navikt/ds-react'

import { AgePicker } from '@/components/common/AgePicker'
import { Divider } from '@/components/common/Divider'
import { ReadMore } from '@/components/common/ReadMore'
import { EndreInntekt } from '@/components/EndreInntekt'
import { InfoOmInntekt } from '@/components/EndreInntekt/InfoOmInntekt'
import { VilkaarsproevingAlert } from '@/components/VilkaarsproevingAlert'
import { BeregningContext } from '@/pages/Beregning/context'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectCurrentSimulation,
  selectAarligInntektFoerUttakBeloep,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
} from '@/state/userInput/selectors'
import { formatWithoutDecimal } from '@/utils/inntekt'
import { getFormatMessageValues } from '@/utils/translations'

import { FormButtonRow } from './FormButtonRow'
import { useFormLocalState, useFormValidationErrors } from './hooks'
import { ReadMoreOmPensjonsalder } from './ReadMoreOmPensjonsalder'
import { FORM_NAMES, onAvansertBeregningSubmit } from './utils'

import styles from './RedigerAvansertBeregning.module.scss'

export const RedigerAvansertBeregning: React.FC<{
  gaaTilResultat: () => void
  vilkaarsproeving?: Vilkaarsproeving
}> = ({ gaaTilResultat, vilkaarsproeving }) => {
  const intl = useIntl()
  const dispatch = useAppDispatch()

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
  const { harAvansertSkjemaUnsavedChanges } = React.useContext(BeregningContext)

  const [
    localInntektFremTilUttak,
    localHeltUttak,
    localGradertUttak,
    { setLocalInntektFremTilUttak, setLocalHeltUttak, setLocalGradertUttak },
  ] = useFormLocalState({
    aarligInntektFoerUttakBeloepFraBrukerSkattBeloep:
      aarligInntektFoerUttakBeloepFraBrukerSkatt?.beloep,
    aarligInntektFoerUttakBeloepFraBrukerInput,
    uttaksalder,
    aarligInntektVsaHelPensjon,
    gradertUttaksperiode,
  })

  const [
    validationErrors,
    gradertUttakAgePickerError,
    heltUttakAgePickerError,
    {
      setValidationErrors,
      setValidationErrorUttaksalderHeltUttak,
      setValidationErrorUttaksalderGradertUttak,
      setValidationErrorInntektVsaGradertUttak,
      resetValidationErrors,
    },
  ] = useFormValidationErrors({
    grad: localGradertUttak?.grad,
  })

  const handleUttaksgradChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidationErrors()
    const avansertBeregningFormatertUttaksgradAsNumber = e.target.value
      ? parseInt(e.target.value.match(/\d+/)?.[0] as string, 10)
      : 100

    if (
      !isNaN(avansertBeregningFormatertUttaksgradAsNumber) &&
      avansertBeregningFormatertUttaksgradAsNumber !== localGradertUttak?.grad
    ) {
      // if the avansertBeregningFormatertUttaksgradAsNumber is different than 100
      if (avansertBeregningFormatertUttaksgradAsNumber !== 100) {
        // if there was no gradert uttak, empty the value for helt
        if (localGradertUttak?.uttaksalder === undefined) {
          setLocalHeltUttak((previous) => {
            return {
              ...previous,
              uttaksalder: undefined,
            }
          })
        }
        // transfer the uttaksalder value from the first age picker (helt) to gradert age picker
        setLocalGradertUttak((previous) => {
          return {
            ...previous,
            uttaksalder:
              previous?.uttaksalder === undefined
                ? localHeltUttak?.uttaksalder
                : previous?.uttaksalder,
            grad: avansertBeregningFormatertUttaksgradAsNumber,
          }
        })
      } else {
        // transfer the value from gradert age picker to helt age picker
        setLocalHeltUttak((previous) => {
          return {
            ...previous,
            uttaksalder: localGradertUttak?.uttaksalder,
          }
        })

        // empty the values for gradert
        setLocalGradertUttak(undefined)
      }
    }
  }

  const handleInntektVsaGradertPensjonChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLocalGradertUttak((previous) => ({
      ...previous,
      aarligInntektVsaPensjonBeloep: e.target.value
        ? e.target.value
        : undefined,
    }))
    setValidationErrorInntektVsaGradertUttak('')
  }

  const handleInntektVsaHeltPensjonChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLocalHeltUttak((previous) => ({
      ...previous,
      aarligInntektVsaPensjon: e.target.value
        ? {
            ...previous?.aarligInntektVsaPensjon,
            beloep: e.target.value,
          }
        : undefined,
    }))
    // setValidationErrorInntektVsaGradertUttak('')
  }

  const handleSluttAlderInntektVsaHeltPensjonChange = (
    alder: Partial<Alder> | undefined
  ): void => {
    setLocalHeltUttak((previous) => ({
      ...previous,
      aarligInntektVsaPensjon: {
        ...previous?.aarligInntektVsaPensjon,
        sluttAlder: alder,
      },
    }))
    // setValidationErrorInntektVsaGradertUttak('')
  }

  const handleGradertUttaksalderChange = (
    alder: Partial<Alder> | undefined
  ) => {
    setValidationErrorUttaksalderGradertUttak('')
    setLocalGradertUttak((previous) => ({
      ...previous,
      uttaksalder: alder,
    }))
  }

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

  const resetForm = (): void => {
    resetValidationErrors()
    setLocalInntektFremTilUttak(
      aarligInntektFoerUttakBeloepFraBrukerSkatt?.beloep ?? null
    )
    setLocalGradertUttak(undefined)
    setLocalHeltUttak(undefined)
  }

  return (
    <div
      className={`${styles.container} ${styles.container__hasMobilePadding}`}
    >
      <div className={styles.form}>
        <form
          id={FORM_NAMES.form}
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
                localHeltUttak,
                localInntektFremTilUttak,
                hasVilkaarIkkeOppfylt:
                  vilkaarsproeving?.vilkaarErOppfylt === false,
                harAvansertSkjemaUnsavedChanges,
              }
            )
          }}
        ></form>
        <div>
          <Label className={styles.label}>
            <FormattedMessage id="beregning.avansert.rediger.inntekt_frem_til_uttak.label" />
          </Label>
          <div className={styles.description}>
            <span className={styles.descriptionText}>
              <span
                className="nowrap"
                data-testid="formatert-inntekt-frem-til-uttak"
              >
                {formatWithoutDecimal(
                  localInntektFremTilUttak !== null
                    ? localInntektFremTilUttak
                    : aarligInntektFoerUttakBeloep
                )}
              </span>
              {` ${intl.formatMessage({ id: 'beregning.avansert.rediger.inntekt_frem_til_uttak.description' })}`}
            </span>
            <EndreInntekt
              visning="avansert"
              buttonLabel="beregning.avansert.rediger.inntekt.button"
              value={localInntektFremTilUttak}
              onSubmit={(inntekt) => {
                setLocalInntektFremTilUttak(inntekt)
              }}
            />
          </div>
          <div className={`${styles.spacer} ${styles.spacer__small}`} />
          <ReadMore
            name="Endring av inntekt i avansert fane"
            header={intl.formatMessage({
              id: 'inntekt.info_om_inntekt.read_more',
            })}
          >
            <InfoOmInntekt />
          </ReadMore>
        </div>
        <Divider noMargin />
        {vilkaarsproeving &&
          !vilkaarsproeving?.vilkaarErOppfylt &&
          uttaksalder && (
            <VilkaarsproevingAlert
              vilkaarsproeving={vilkaarsproeving}
              uttaksalder={uttaksalder}
            />
          )}
        <div>
          {localGradertUttak ? (
            <AgePicker
              form={FORM_NAMES.form}
              name={FORM_NAMES.uttaksalderGradertUttak}
              label={<FormattedMessage id="velguttaksalder.title" />}
              value={localGradertUttak?.uttaksalder}
              onChange={handleGradertUttaksalderChange}
              error={gradertUttakAgePickerError}
            />
          ) : (
            <AgePicker
              form={FORM_NAMES.form}
              name={FORM_NAMES.uttaksalderHeltUttak}
              label={<FormattedMessage id="velguttaksalder.title" />}
              value={localHeltUttak?.uttaksalder}
              onChange={handleHeltUttaksalderChange}
              error={heltUttakAgePickerError}
            />
          )}
          <div className={styles.spacer__small} />
          <ReadMoreOmPensjonsalder />
        </div>
        <div>
          <Select
            form={FORM_NAMES.form}
            data-testid="uttaksgrad-select"
            name={FORM_NAMES.uttaksgrad}
            className={styles.select}
            label={intl.formatMessage({
              id: 'beregning.avansert.rediger.uttaksgrad.label',
            })}
            description={intl.formatMessage({
              id: 'beregning.avansert.rediger.uttaksgrad.description',
            })}
            value={
              localGradertUttak?.grad ? `${localGradertUttak.grad} %` : '100 %'
            }
            onChange={handleUttaksgradChange}
          >
            <option>
              <FormattedMessage id="beregning.avansert.rediger.uttaksgrad.description" />
            </option>
            {['20 %', '40 %', '50 %', '60 %', '80 %', '100 %'].map((grad) => (
              <option key={grad} value={grad}>
                {grad}
              </option>
            ))}
          </Select>
          <div className={styles.spacer__small} />
          <ReadMore
            name="Om uttaksgrad"
            header={intl.formatMessage({
              id: 'beregning.avansert.rediger.read_more.uttaksgrad.label',
            })}
          >
            <BodyLong>
              <FormattedMessage
                id="beregning.avansert.rediger.read_more.uttaksgrad.body"
                values={{
                  ...getFormatMessageValues(intl),
                }}
              />
            </BodyLong>
          </ReadMore>
        </div>
        {localGradertUttak && (
          <>
            <div>
              <TextField
                form={FORM_NAMES.form}
                data-testid="inntekt-vsa-gradert-pensjon-textfield"
                type="text"
                inputMode="numeric"
                name={FORM_NAMES.inntektVsaGradertUttak}
                className={styles.textfield}
                label={
                  <FormattedMessage
                    id="beregning.avansert.rediger.inntekt_vsa_gradert_uttak.label"
                    values={{
                      ...getFormatMessageValues(intl),
                      grad: localGradertUttak.grad,
                    }}
                  />
                }
                description={intl.formatMessage({
                  id: 'inntekt.endre_inntekt_modal.textfield.description',
                })}
                error={
                  validationErrors[FORM_NAMES.inntektVsaGradertUttak]
                    ? intl.formatMessage({
                        id: validationErrors[FORM_NAMES.inntektVsaGradertUttak],
                      })
                    : ''
                }
                onChange={handleInntektVsaGradertPensjonChange}
                value={localGradertUttak?.aarligInntektVsaPensjonBeloep}
                max={5}
              />
            </div>
            <div>
              <AgePicker
                form={FORM_NAMES.form}
                name={FORM_NAMES.uttaksalderHeltUttak}
                label={
                  <FormattedMessage
                    id="beregning.avansert.rediger.heltuttak.agepicker.label"
                    values={{
                      ...getFormatMessageValues(intl),
                    }}
                  />
                }
                value={localHeltUttak?.uttaksalder}
                onChange={handleHeltUttaksalderChange}
                error={heltUttakAgePickerError}
              />
            </div>
          </>
        )}

        {localHeltUttak?.uttaksalder?.aar &&
          localHeltUttak?.uttaksalder?.maaneder !== undefined && (
            <>
              <div>
                <TextField
                  form={FORM_NAMES.form}
                  data-testid="inntekt-vsa-hel-pensjon-textfield"
                  type="text"
                  inputMode="numeric"
                  name={FORM_NAMES.inntektVsaHeltUttak}
                  className={styles.textfield}
                  label="Hva er din forventede årsinntekt mens du tar ut <nowrap>100 %</nowrap> alderspensjon?"
                  description="Dagens kroneverdi før skatt"
                  // error={
                  //   validationErrors[FORM_NAMES.inntektVsaGradertUttak]
                  //     ? intl.formatMessage({
                  //         id: validationErrors[FORM_NAMES.inntektVsaGradertUttak],
                  //       })
                  //     : ''
                  // }
                  onChange={handleInntektVsaHeltPensjonChange}
                  value={localHeltUttak?.aarligInntektVsaPensjon?.beloep}
                  // value={localGradertUttak?.aarligInntektVsaPensjonBeloep}
                  max={5}
                />
              </div>
              {localHeltUttak?.aarligInntektVsaPensjon?.beloep && (
                <div>
                  <AgePicker
                    name={FORM_NAMES.inntektVsaHeltUttakSluttAlder}
                    label="Til hvilken alder forventer du å ha inntekten?"
                    value={localHeltUttak?.aarligInntektVsaPensjon?.sluttAlder}
                    minAlder={
                      localHeltUttak?.uttaksalder?.aar
                        ? {
                            aar:
                              localHeltUttak?.uttaksalder?.maaneder === 11
                                ? localHeltUttak?.uttaksalder?.aar + 1
                                : localHeltUttak?.uttaksalder?.aar,
                            maaneder:
                              localHeltUttak?.uttaksalder?.maaneder !==
                                undefined &&
                              localHeltUttak?.uttaksalder?.maaneder !== 11
                                ? localHeltUttak?.uttaksalder?.maaneder + 1
                                : 0,
                          }
                        : undefined
                    }
                    maxAlder={{ aar: 75, maaneder: 11 }}
                    onChange={handleSluttAlderInntektVsaHeltPensjonChange}
                    error={
                      validationErrors['sluttalder-inntekt-vsa-pensjon']
                        ? `${intl.formatMessage({
                            id: validationErrors[
                              'sluttalder-inntekt-vsa-pensjon'
                            ],
                          })}.`
                        : ''
                    }
                  />
                </div>
              )}
              {/* <EndreInntektVsaPensjon
                uttaksperiode={localHeltUttak}
                oppdatereInntekt={(aarligInntektVsaPensjon?: {
                  beloep: number
                  sluttAlder: {
                    aar: number
                    maaneder: number
                  }
                }) => {
                  setLocalHeltUttak((prevState) => {
                    return {
                      ...prevState,
                      aarligInntektVsaPensjon,
                    }
                  })
                }}
              /> */}
            </>
          )}
        <FormButtonRow
          resetForm={resetForm}
          gaaTilResultat={gaaTilResultat}
          hasVilkaarIkkeOppfylt={vilkaarsproeving?.vilkaarErOppfylt === false}
        />
      </div>
    </div>
  )
}

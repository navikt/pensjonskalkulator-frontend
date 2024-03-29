import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { Alert, BodyLong, Label, Select, TextField } from '@navikt/ds-react'

import { AgePicker } from '@/components/common/AgePicker'
import { Alert as AlertDashBorder } from '@/components/common/Alert'
import { ReadMore } from '@/components/common/ReadMore'
import { EndreInntekt } from '@/components/EndreInntekt'
import { InfoOmInntekt } from '@/components/EndreInntekt/InfoOmInntekt'
import { EndreInntektVsaPensjon } from '@/components/EndreInntektVsaPensjon'
import { BeregningContext } from '@/pages/Beregning/context'
import {
  useTidligstMuligHeltUttakQuery,
  useTidligstMuligGradertUttakQuery,
} from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectSamboer,
  selectSivilstand,
  selectCurrentSimulation,
  selectAarligInntektFoerUttakBeloep,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
} from '@/state/userInput/selectors'
import { isAlderOverMinUttaksaar, formatUttaksalder } from '@/utils/alder'
import { formatWithoutDecimal } from '@/utils/inntekt'
import { getFormatMessageValues } from '@/utils/translations'

import { FormButtonRow } from './FormButtonRow'
import {
  useFormLocalState,
  useTidligstMuligUttakRequestBodyState,
  useFormValidationErrors,
} from './hooks'
import { ReadMoreOmPensjonsalder } from './ReadMoreOmPensjonsalder'
import {
  FORM_NAMES,
  onAvansertBeregningSubmit,
  getMinAlderTilHeltUttak,
} from './utils'

import styles from './RedigerAvansertBeregning.module.scss'

export const RedigerAvansertBeregning: React.FC<{
  gaaTilResultat: () => void
  hasVilkaarIkkeOppfylt?: boolean
}> = ({ gaaTilResultat, hasVilkaarIkkeOppfylt }) => {
  const intl = useIntl()
  const dispatch = useAppDispatch()

  const { uttaksalder, gradertUttaksperiode, aarligInntektVsaHelPensjon } =
    useAppSelector(selectCurrentSimulation)
  const afp = useAppSelector(selectAfp)
  const harSamboer = useAppSelector(selectSamboer)
  const sivilstand = useAppSelector(selectSivilstand)
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
    tidligstMuligHeltUttakRequestBody,
    tidligstMuligGradertUttakRequestBody,
  ] = useTidligstMuligUttakRequestBodyState({
    afp,
    sivilstand,
    harSamboer,
    aarligInntektFoerUttakBeloep,
    localInntektFremTilUttak,
    localGradertUttak,
    localHeltUttak,
  })

  const {
    data: tidligstMuligHeltUttak,
    isError: isTidligstMuligHeltUttakError,
  } = useTidligstMuligHeltUttakQuery(tidligstMuligHeltUttakRequestBody, {
    skip: !tidligstMuligHeltUttakRequestBody || hasVilkaarIkkeOppfylt,
  })

  const {
    data: tidligstMuligGradertUttak,
    isError: isTidligstMuligGradertUttakError,
  } = useTidligstMuligGradertUttakQuery(tidligstMuligGradertUttakRequestBody, {
    skip: !tidligstMuligGradertUttakRequestBody || hasVilkaarIkkeOppfylt,
  })

  const [
    validationErrors,
    gradertUttakAgePickerError,
    heltUttakAgePickerError,
    gradertUttakAgePickerBeskrivelse,
    heltUttakAgePickerBeskrivelse,
    {
      setValidationErrors,
      setValidationErrorUttaksalderHeltUttak,
      setValidationErrorUttaksalderGradertUttak,
      setValidationErrorInntektVsaGradertUttak,
      resetValidationErrors,
    },
  ] = useFormValidationErrors({
    grad: localGradertUttak?.grad,
    tidligstMuligHeltUttak,
    tidligstMuligGradertUttak,
  })

  // TODO se om denne kan flyttes til hooks? (venter på endring i TMU logikk)
  /* c8 ignore next 22 */
  const minAlderForHeltUttak = React.useMemo(() => {
    if (localGradertUttak || tidligstMuligHeltUttak) {
      const oppdatertMinAlder = getMinAlderTilHeltUttak({
        localGradertUttak: localGradertUttak?.uttaksalder,
        tidligstMuligHeltUttak,
      })
      // if the previously chosen uttaksalder is lower than oppdatertMinAlder
      if (
        localHeltUttak?.uttaksalder &&
        (localHeltUttak.uttaksalder?.aar ?? 0) * 12 +
          (localHeltUttak.uttaksalder?.maaneder ?? 0) <=
          (oppdatertMinAlder?.aar ?? 0) * 12 +
            (oppdatertMinAlder?.maaneder ?? 0)
      ) {
        setLocalHeltUttak((previous) => ({
          ...previous,
          uttaksalder: undefined,
        }))
      }
      return oppdatertMinAlder
    }
  }, [localGradertUttak, tidligstMuligHeltUttak])

  const handleUttaksgradChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidationErrors()
    const avansertBeregningFormatertUttaksgradAsNumber = e.target.value
      ? parseInt(e.target.value.match(/\d+/)?.[0] as string, 10)
      : 100
    setLocalGradertUttak((previous) => {
      return !isNaN(avansertBeregningFormatertUttaksgradAsNumber) &&
        avansertBeregningFormatertUttaksgradAsNumber !== previous &&
        avansertBeregningFormatertUttaksgradAsNumber !== 100
        ? {
            grad: avansertBeregningFormatertUttaksgradAsNumber,
            aarligInntektVsaPensjonBeloep: '',
          }
        : undefined
    })
    setLocalHeltUttak({
      uttaksalder: undefined,
      aarligInntektVsaPensjon: undefined,
    })
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

  const handleGradertUttakAlderChange = (alder: Partial<Alder> | undefined) => {
    setValidationErrorUttaksalderGradertUttak('')
    setLocalGradertUttak((previous) => ({
      ...previous,
      uttaksalder: alder,
    }))
  }

  const handleHeltUttakAlderChange = (alder: Partial<Alder> | undefined) => {
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
                hasVilkaarIkkeOppfylt,
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
              <span className="nowrap">
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
                if (
                  (aarligInntektFoerUttakBeloepFraBrukerInput !== null &&
                    inntekt !== aarligInntektFoerUttakBeloepFraBrukerInput) ||
                  (aarligInntektFoerUttakBeloepFraBrukerInput === null &&
                    inntekt !== null)
                ) {
                  resetForm()
                }
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
        <hr className={styles.separator} />
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
        </div>
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
        <div className={styles.spacer} />
        {localGradertUttak && (
          <div>
            <AgePicker
              form={FORM_NAMES.form}
              name={FORM_NAMES.uttaksalderGradertUttak}
              label={
                <FormattedMessage
                  id="beregning.avansert.rediger.gradertuttak.agepicker.label"
                  values={{
                    ...getFormatMessageValues(intl),
                    grad: localGradertUttak.grad,
                  }}
                />
              }
              description={gradertUttakAgePickerBeskrivelse}
              value={localGradertUttak?.uttaksalder}
              minAlder={tidligstMuligGradertUttak}
              maxAlder={{ aar: 74, maaneder: 11 }}
              onChange={handleGradertUttakAlderChange}
              error={gradertUttakAgePickerError}
            />
            {hasVilkaarIkkeOppfylt &&
              gradertUttaksperiode &&
              gradertUttaksperiode.uttaksalder &&
              JSON.stringify(gradertUttaksperiode.uttaksalder) ===
                JSON.stringify(localGradertUttak?.uttaksalder) && (
                <AlertDashBorder className={styles.alert}>
                  <FormattedMessage
                    id={
                      gradertUttaksperiode.uttaksalder.maaneder
                        ? 'beregning.lav_opptjening.aar_og_md'
                        : 'beregning.lav_opptjening.aar'
                    }
                    values={{
                      startAar: gradertUttaksperiode.uttaksalder.aar,
                      startMaaned: gradertUttaksperiode.uttaksalder.maaneder
                        ? gradertUttaksperiode.uttaksalder.maaneder
                        : undefined,
                    }}
                  />
                </AlertDashBorder>
              )}
            {localGradertUttak?.grad !== 100 && (
              <>
                <div className={styles.spacer__small} />
                <ReadMoreOmPensjonsalder
                  showTidligstMuligUttakOptionalIngress={
                    !isTidligstMuligGradertUttakError &&
                    !isTidligstMuligHeltUttakError &&
                    !hasVilkaarIkkeOppfylt
                  }
                />
              </>
            )}
            <div className={styles.spacer} />
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
            <div className={styles.spacer} />
            {tidligstMuligHeltUttak &&
              isAlderOverMinUttaksaar(tidligstMuligHeltUttak) && (
                <>
                  <Alert variant="info" aria-live="polite">
                    <FormattedMessage
                      id="beregning.avansert.rediger.uttaksgrad.info"
                      values={{
                        alder: formatUttaksalder(intl, tidligstMuligHeltUttak),
                      }}
                    />
                  </Alert>
                  <div className={styles.spacer} />
                </>
              )}
          </div>
        )}
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
            description={heltUttakAgePickerBeskrivelse}
            value={localHeltUttak?.uttaksalder}
            minAlder={minAlderForHeltUttak}
            onChange={handleHeltUttakAlderChange}
            error={heltUttakAgePickerError}
          />
          {hasVilkaarIkkeOppfylt &&
          !gradertUttaksperiode &&
          uttaksalder &&
          uttaksalder.aar < 67 &&
          JSON.stringify(uttaksalder) ===
            JSON.stringify(localHeltUttak?.uttaksalder) ? (
            <AlertDashBorder className={styles.alert}>
              <FormattedMessage
                id={
                  uttaksalder.maaneder
                    ? 'beregning.lav_opptjening.aar_og_md'
                    : 'beregning.lav_opptjening.aar'
                }
                values={{
                  startAar: uttaksalder.aar,
                  startMaaned: uttaksalder.maaneder
                    ? uttaksalder.maaneder
                    : undefined,
                }}
              />
            </AlertDashBorder>
          ) : (
            <div className={styles.spacer__small} />
          )}
        </div>
        {(!localGradertUttak ||
          !localGradertUttak?.grad ||
          localGradertUttak?.grad === 100) && (
          <ReadMoreOmPensjonsalder
            showTidligstMuligUttakOptionalIngress={
              !isTidligstMuligHeltUttakError && !hasVilkaarIkkeOppfylt
            }
          />
        )}
        {localHeltUttak?.uttaksalder?.aar &&
          localHeltUttak?.uttaksalder?.maaneder !== undefined && (
            <div>
              <EndreInntektVsaPensjon
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
              />
            </div>
          )}
        <FormButtonRow
          resetForm={resetForm}
          gaaTilResultat={gaaTilResultat}
          hasVilkaarIkkeOppfylt={hasVilkaarIkkeOppfylt}
        />
      </div>
    </div>
  )
}

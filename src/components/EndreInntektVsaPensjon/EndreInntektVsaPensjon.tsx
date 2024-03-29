import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { PencilIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Label, Modal, TextField } from '@navikt/ds-react'

import { AgePicker } from '@/components/common/AgePicker'
import { useGetPersonQuery } from '@/state/api/apiSlice'
import {
  formatUttaksalder,
  validateAlderFromForm,
  transformUttaksalderToDate,
} from '@/utils/alder'
import { formatWithoutDecimal, validateInntekt } from '@/utils/inntekt'
import { logger, wrapLogger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './EndreInntektVsaPensjon.module.scss'

interface Props {
  uttaksperiode?: RecursivePartial<HeltUttak>
  oppdatereInntekt: (aarligInntektVsaPensjon?: {
    beloep: number
    sluttAlder: {
      aar: number
      maaneder: number
    }
  }) => void
}

export const EndreInntektVsaPensjon: React.FC<Props> = ({
  uttaksperiode,
  oppdatereInntekt,
}) => {
  const intl = useIntl()

  const inntektVsaPensjonModalRef = React.useRef<HTMLDialogElement>(null)

  const { data: person, isSuccess } = useGetPersonQuery()

  const [inntektBeloepVsaPensjon, setInntektBeloepVsaPensjon] =
    React.useState<string>(
      uttaksperiode?.aarligInntektVsaPensjon?.beloep
        ? uttaksperiode?.aarligInntektVsaPensjon?.beloep.toString()
        : ''
    )
  const [sluttAlder, setSluttAlder] = React.useState<
    Partial<Alder> | undefined
  >(uttaksperiode?.aarligInntektVsaPensjon?.sluttAlder)
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({
    'inntekt-vsa-pensjon': '',
    'sluttalder-inntekt-vsa-pensjon': '',
  })

  React.useEffect(() => {
    if (uttaksperiode?.aarligInntektVsaPensjon === undefined) {
      setInntektBeloepVsaPensjon('')
      setSluttAlder(undefined)
    }
  }, [uttaksperiode])

  const handleTextfieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInntektBeloepVsaPensjon(e.target.value)
    setValidationErrors((prevState) => {
      return {
        ...prevState,
        'inntekt-vsa-pensjon': '',
      }
    })
  }

  const transformertDate = React.useMemo(() => {
    if (
      isSuccess &&
      person.foedselsdato &&
      sluttAlder &&
      sluttAlder.aar &&
      sluttAlder.maaneder !== undefined
    ) {
      return transformUttaksalderToDate(
        sluttAlder as Alder,
        person.foedselsdato
      )
    } else {
      return ''
    }
  }, [sluttAlder, isSuccess])

  const openInntektVsaPensjonModal = () => {
    logger('modal åpnet', {
      tekst:
        'Modal: Endring av pensjonsgivende inntekt vsa. 100% alderspensjon',
    })
    inntektVsaPensjonModalRef.current?.showModal()
  }

  const updateValidationErrorInputTextMessage = (id: string) => {
    setValidationErrors((prevState) => {
      return {
        ...prevState,
        'inntekt-vsa-pensjon': id,
      }
    })
  }

  const updateValidationAlderVelgerTextMessage = (id: string) => {
    setValidationErrors((prevState) => {
      return {
        ...prevState,
        'sluttalder-inntekt-vsa-pensjon': id,
      }
    })
  }

  const validateInntektVsaPensjon = (): void => {
    const isInntektValid = validateInntekt(
      inntektBeloepVsaPensjon,
      updateValidationErrorInputTextMessage
    )
    const isSluttAlderValid = validateAlderFromForm(
      { aar: sluttAlder?.aar, maaneder: sluttAlder?.maaneder },
      updateValidationAlderVelgerTextMessage
    )
    if (isInntektValid && isSluttAlderValid) {
      logger('button klikk', {
        tekst: uttaksperiode?.aarligInntektVsaPensjon
          ? 'Legger til pensjonsgivende inntekt vsa. 100% alderspensjon'
          : 'Endrer pensjonsgivende inntekt vsa. 100% alderspensjon',
      })
      oppdatereInntekt({
        beloep: parseInt(
          (inntektBeloepVsaPensjon as string).replace(/ /g, ''),
          10
        ),
        sluttAlder: { ...(sluttAlder as Alder) },
      })
      if (inntektVsaPensjonModalRef.current?.open) {
        setInntektBeloepVsaPensjon('')
        inntektVsaPensjonModalRef.current?.close()
      }
    }
  }

  const onCancel = (): void => {
    setInntektBeloepVsaPensjon(
      uttaksperiode?.aarligInntektVsaPensjon?.beloep
        ? uttaksperiode?.aarligInntektVsaPensjon?.beloep.toString()
        : ''
    )
    setSluttAlder(uttaksperiode?.aarligInntektVsaPensjon?.sluttAlder)
    setValidationErrors({
      'inntekt-vsa-pensjon': '',
      'sluttalder-inntekt-vsa-pensjon': '',
    })
    if (inntektVsaPensjonModalRef.current?.open) {
      inntektVsaPensjonModalRef.current?.close()
    }
  }

  const onDelete = (): void => {
    setSluttAlder(undefined)
    setInntektBeloepVsaPensjon('')
    setValidationErrors({
      'inntekt-vsa-pensjon': '',
      'sluttalder-inntekt-vsa-pensjon': '',
    })
    oppdatereInntekt(undefined)
  }

  return (
    <>
      <Modal
        ref={inntektVsaPensjonModalRef}
        header={{
          heading: intl.formatMessage({
            id: 'inntekt.endre_inntekt_vsa_pensjon_modal.title',
          }),
        }}
        onClose={onCancel}
        width="small"
      >
        <Modal.Body>
          <TextField
            data-testid="inntekt-vsa-pensjon-textfield"
            type="text"
            inputMode="numeric"
            name="inntekt-vsa-pensjon"
            className={styles.textfield}
            label={
              <FormattedMessage
                id="inntekt.endre_inntekt_vsa_pensjon_modal.textfield.label"
                values={{ ...getFormatMessageValues(intl) }}
              />
            }
            description={intl.formatMessage({
              id: 'inntekt.endre_inntekt_vsa_pensjon_modal.textfield.description',
            })}
            error={
              validationErrors['inntekt-vsa-pensjon']
                ? intl.formatMessage({
                    id: validationErrors['inntekt-vsa-pensjon'],
                  })
                : undefined
            }
            onChange={handleTextfieldChange}
            value={inntektBeloepVsaPensjon}
            max={5}
          />
          <div className={styles.spacer} />
          <AgePicker
            name="sluttalder-inntekt-vsa-pensjon"
            label={intl.formatMessage({
              id: 'inntekt.endre_inntekt_vsa_pensjon_modal.agepicker.label',
            })}
            value={sluttAlder}
            minAlder={
              uttaksperiode?.uttaksalder?.aar
                ? {
                    aar:
                      uttaksperiode?.uttaksalder?.maaneder === 11
                        ? uttaksperiode?.uttaksalder?.aar + 1
                        : uttaksperiode?.uttaksalder?.aar,
                    maaneder:
                      uttaksperiode?.uttaksalder?.maaneder !== undefined &&
                      uttaksperiode?.uttaksalder?.maaneder !== 11
                        ? uttaksperiode?.uttaksalder?.maaneder + 1
                        : 0,
                  }
                : undefined
            }
            maxAlder={{ aar: 75, maaneder: 11 }}
            onChange={(alder) => {
              setValidationErrors((prevState) => {
                return {
                  ...prevState,
                  'sluttalder-inntekt-vsa-pensjon': '',
                }
              })
              setSluttAlder(alder)
            }}
            error={
              validationErrors['sluttalder-inntekt-vsa-pensjon']
                ? `${intl.formatMessage({
                    id: validationErrors['sluttalder-inntekt-vsa-pensjon'],
                  })}.`
                : ''
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={validateInntektVsaPensjon}>
            {intl.formatMessage({
              id: uttaksperiode?.aarligInntektVsaPensjon
                ? 'inntekt.endre_inntekt_vsa_pensjon_modal.button.endre'
                : 'inntekt.endre_inntekt_vsa_pensjon_modal.button.legg_til',
            })}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {intl.formatMessage({
              id: 'stegvisning.avbryt',
            })}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={styles.spacer} />
      {uttaksperiode?.aarligInntektVsaPensjon &&
      uttaksperiode.aarligInntektVsaPensjon.beloep ? (
        <>
          <Label className={styles.label}>
            <FormattedMessage
              id="inntekt.endre_inntekt_vsa_pensjon_modal.label"
              values={{ ...getFormatMessageValues(intl) }}
            />
          </Label>
          <BodyShort>
            <span className="nowrap">{`${formatWithoutDecimal(
              uttaksperiode.aarligInntektVsaPensjon.beloep
            )} kr`}</span>
            {` ${intl.formatMessage({
              id: 'beregning.fra',
            })} ${
              uttaksperiode.uttaksalder?.aar &&
              uttaksperiode.uttaksalder.maaneder !== undefined
                ? formatUttaksalder(intl, uttaksperiode.uttaksalder as Alder, {
                    compact: true,
                  })
                : ''
            } ${intl.formatMessage({
              id: 'beregning.til',
            })} ${
              sluttAlder?.aar && sluttAlder.maaneder !== undefined
                ? formatUttaksalder(intl, sluttAlder as Alder, {
                    compact: true,
                  })
                : ''
            } (${transformertDate})`}
          </BodyShort>
          <Button
            className={`${styles.button} ${styles.button__marginRight}`}
            variant="tertiary"
            size="small"
            icon={<PencilIcon aria-hidden />}
            onClick={openInntektVsaPensjonModal}
          >
            {intl.formatMessage({
              id: 'inntekt.endre_inntekt_vsa_pensjon_modal.open.button.endre',
            })}
          </Button>
          <Button
            className={styles.button}
            variant="tertiary"
            size="small"
            icon={<TrashIcon aria-hidden />}
            onClick={wrapLogger('button klikk', {
              tekst: 'sletter inntekt vsa. 100% alderspensjon',
            })(onDelete)}
          >
            {intl.formatMessage({
              id: 'inntekt.endre_inntekt_vsa_pensjon_modal.button.slette',
            })}
          </Button>
        </>
      ) : (
        <>
          <BodyShort>
            <FormattedMessage
              id="inntekt.endre_inntekt_vsa_pensjon_modal.ingress_2"
              values={{ ...getFormatMessageValues(intl) }}
            />
          </BodyShort>
          <Button
            className={styles.button}
            variant="tertiary"
            size="small"
            icon={<PlusCircleIcon aria-hidden />}
            onClick={openInntektVsaPensjonModal}
          >
            {intl.formatMessage({
              id: 'inntekt.endre_inntekt_vsa_pensjon_modal.open.button.legg_til',
            })}
          </Button>
        </>
      )}
    </>
  )
}
